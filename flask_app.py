from flask import Flask, jsonify, request, abort
import joblib
import pandas as pd
from sklearn.preprocessing import RobustScaler
import numpy as np
from sklearn.neighbors import LocalOutlierFactor
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import os

app = Flask(__name__)
plots_folder = os.path.join(os.path.dirname(__file__), 'plots')

loaded_model = joblib.load('rf_tuned.pkl')
model = joblib.load('linear_regression_model.pkl')

def set_insulin(row):
    if row["Insulin"] >= 16 and row["Insulin"] <= 166:
        return "Normal"
    else:
        return "Abnormal"
    
def process_data(df):
    NewBMI = pd.Series(["Underweight", "Normal", "Overweight", "Obesity 1", "Obesity 2", "Obesity 3"], dtype = "category")
    df["NewBMI"] = NewBMI
    df.loc[df["BMI"] < 18.5, "NewBMI"] = NewBMI[0]
    df.loc[(df["BMI"] > 18.5) & (df["BMI"] <= 24.9), "NewBMI"] = NewBMI[1]
    df.loc[(df["BMI"] > 24.9) & (df["BMI"] <= 29.9), "NewBMI"] = NewBMI[2]
    df.loc[(df["BMI"] > 29.9) & (df["BMI"] <= 34.9), "NewBMI"] = NewBMI[3]
    df.loc[(df["BMI"] > 34.9) & (df["BMI"] <= 39.9), "NewBMI"] = NewBMI[4]
    df.loc[df["BMI"] > 39.9 ,"NewBMI"] = NewBMI[5]

    df = df.assign(NewInsulinScore=df.apply(set_insulin, axis=1))


    NewGlucose = pd.Series(["Low", "Normal", "Overweight", "Secret", "High"], dtype = "category")
    df["NewGlucose"] = NewGlucose
    df.loc[df["Glucose"] <= 70, "NewGlucose"] = NewGlucose[0]
    df.loc[(df["Glucose"] > 70) & (df["Glucose"] <= 99), "NewGlucose"] = NewGlucose[1]
    df.loc[(df["Glucose"] > 99) & (df["Glucose"] <= 126), "NewGlucose"] = NewGlucose[2]
    df.loc[df["Glucose"] > 126 ,"NewGlucose"] = NewGlucose[3]

    df = pd.get_dummies(df, columns =["NewBMI","NewInsulinScore", "NewGlucose"], drop_first = True)

    cat = ['NewBMI_Obesity 1','NewBMI_Obesity 2', 'NewBMI_Obesity 3', 'NewBMI_Overweight','NewBMI_Underweight', 'NewInsulinScore_Normal','NewGlucose_Low','NewGlucose_Normal', 'NewGlucose_Overweight', 'NewGlucose_Secret']

    # print(df.head())
    for column_name in cat:
        if column_name not in df.columns:
            df[column_name] = 0

    categorical_df = df[['NewBMI_Obesity 1','NewBMI_Obesity 2', 'NewBMI_Obesity 3', 'NewBMI_Overweight','NewBMI_Underweight', 'NewInsulinScore_Normal','NewGlucose_Low','NewGlucose_Normal', 'NewGlucose_Overweight', 'NewGlucose_Secret']]
    
    X = df.drop(['NewBMI_Obesity 1','NewBMI_Obesity 2', 'NewBMI_Obesity 3', 'NewBMI_Overweight','NewBMI_Underweight',
                     'NewInsulinScore_Normal','NewGlucose_Low','NewGlucose_Normal', 'NewGlucose_Overweight', 'NewGlucose_Secret'], axis = 1)
    cols = X.columns
    index = X.index
    return X, cols, index, categorical_df

def get_transformer():
    def median_target(var):   
        temp = df[df[var].notnull()]
        temp = temp[[var, 'Outcome']].groupby(['Outcome'])[[var]].median().reset_index()
        return temp

    df = pd.read_csv("diabetes.csv")
    df[['Glucose','BloodPressure','SkinThickness','Insulin','BMI']] = df[['Glucose','BloodPressure','SkinThickness','Insulin','BMI']].replace(0,np.NaN)

    columns = df.columns
    columns = columns.drop("Outcome")
    for i in columns:
        median_target(i)
        df.loc[(df['Outcome'] == 0 ) & (df[i].isnull()), i] = median_target(i)[i][0]
        df.loc[(df['Outcome'] == 1 ) & (df[i].isnull()), i] = median_target(i)[i][1]

    lof =LocalOutlierFactor(n_neighbors= 10)
    lof.fit_predict(df)
    df_scores = lof.negative_outlier_factor_
    np.sort(df_scores)[0:30]
    threshold = np.sort(df_scores)[7]
    outlier = df_scores > threshold
    df = df[outlier]
    X_train, cols, index, _ = process_data(df)
    X_train = X_train.drop(columns=['Outcome'])
    transformer = RobustScaler().fit(X_train)
    
    return transformer, cols, index


transformer, _, _ = get_transformer()

def transform_data(df):
    global transformer

    X, cols, index, categorical_df = process_data(df)
    
    X = transformer.transform(X)
    X = pd.DataFrame(X, columns=cols, index = index)
    X = pd.concat([X,categorical_df], axis = 1)

    return X
    

@app.route('/diabetes/predict', methods=['POST'])
def diabetes_predict():
    data = request.get_json()
    df = pd.DataFrame(data, index=[0])
    X = transform_data(df)

    # x = [[-0.6       ,  0.5       , -2.        ,  1.        ,  0.97761194,
    #      1.23333333,  4.9980456 ,  0.23529412,  0.        ,  0.        ,
    #      1.        ,  0.        ,  0.        ,  0.        ,  0.        ,
    #      0.        ,  0.        ,  1.        ]]

    prediction = loaded_model.predict(X)[0]

    prediction = "positive" if prediction == 1 else "negative"

    return jsonify({'diabetes': prediction})

def generate_age_distribution_chart(data):
    plt.figure(figsize=(8, 6))
    data["age"].hist(bins=10, edgecolor="black")
    plt.xlabel("Age")
    plt.ylabel("Number of People")
    plt.title("Distribution of Age in the Survey")
    plt.grid(True)
    plt.savefig('plots/fig1.png', format="png")
    # plt.show()
    plt.clf()
    # return plt

def generate_smoking_prevalence_chart(data):
    smoking_counts = data["tobacco.smoking"].value_counts()
    plt.pie(smoking_counts, labels=smoking_counts.index, autopct="%1.1f%%")
    plt.title("Prevalence of Smoking")
    plt.savefig('plots/fig2.png', format="png")
    plt.clf()
    # return plt 

def generate_vaccination_status_chart(data):
    vaccination_counts = data[["vaccination.complete", "vaccination.partiallyComplete", "vaccination.incomplete"]].sum(axis=1).value_counts()
    plt.bar(vaccination_counts.index, vaccination_counts.values)
    plt.xlabel("Vaccination Status")
    plt.ylabel("Number of People")
    plt.title("Vaccination Status Breakdown")
    plt.xticks(rotation=45)
    plt.grid(axis="y")
    plt.savefig('plots/fig3.png', format="png")
    plt.clf()

def generate_disease_distribution_chart(data):
    health_conditions = ["bloodPressure", "diabetes", "asthma", "epilepsy", "cancer",
                        "heartDisease", "TB", "Stroke", "liverDisease"]

    disease_counts = {}
    for condition in health_conditions:
        disease_counts[condition] = (data[condition] == "yes").sum()

        disease_names = list(disease_counts.keys())
        disease_values = list(disease_counts.values())

        plt.figure(figsize=(10, 6))
        plt.bar(disease_names, disease_values, color="skyblue")
        plt.xlabel("Disease")
        plt.ylabel("Number of People (Yes)")
        plt.title("Distribution of Health Conditions (Yes Answers)")
        plt.xticks(rotation=45)
        plt.grid(axis="y")
        plt.tight_layout()
        plt.savefig('plots/fig4.png', format="png")
        plt.clf()

@app.route('/analytics')
def analytics():
    data = pd.read_csv("members_data.csv")

    generate_age_distribution_chart(data)
    generate_smoking_prevalence_chart(data)
    generate_vaccination_status_chart(data)
    generate_disease_distribution_chart(data)

    try:
        image_data = []
        for filename in os.listdir(plots_folder):
            image_path = os.path.join(plots_folder, filename)
            if os.path.isfile(image_path):  # Check if it's a file (not a directory)
                with open(image_path, 'rb') as image_file:
                    image_bytes = image_file.read()
                    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
                    image_data.append({
                        'filename': filename,
                        'data': f'data:image/{os.path.splitext(filename)[1][1:]};base64,{image_b64}'
                    })

        return jsonify(images=image_data)  # Return JSON response with images data

    except Exception as e:
        # Handle any unexpected errors
        print(f"Error sending images: {e}")
        abort(500) 

@app.route('/diabetes-count/predict',  methods=['POST'])
def count():
    data = request.get_json()
    sample_data = pd.DataFrame({'Year': [data['year']]})
    predicted_count = model.predict(sample_data)
    print(predicted_count[0])
    return jsonify({'result': str(predicted_count[0])})

if __name__ == '__main__':
    app.run(debug=True)
