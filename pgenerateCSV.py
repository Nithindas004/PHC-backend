import pandas as pd

data = {
    "_id": "661796608ef3da33077b42b2",
    "workerId": "66169c6229bbac25a6dad75f",
    "surveyNumber": 22,
    "houseNumber": "12",
    "houseName": "ABC",
    "houseType": "Terrace",
    "owner": "John",
    "mobile": "9876543210",
    "religion": "Christian",
    "caste": "RC",
    "income": 12000000,
    "rationCard": "BPL",
    "scst": "no",
    "waterSource": "tap",
    "toilet": "septicTank",
    "nearby": {
        "pond": "no",
        "stream": "no",
        "garbage": "no",
        "wasteWater": "no"
    },
    "cattle": "no",
    "wasteManagement": "compost",
    "workingMembers": 3,
    "jobType": "private",
    "members": [
        {
            "disability": {
                "mentalIllness": "no",
                "fromBirth": "no"
            },
            "blindness": {
                "accident": "no",
                "complete": "no",
                "partial": "no"
            },
            "tobacco": {
                "smoking": "no",
                "chewing": "no"
            },
            "vaccination": {
                "complete": 3,
                "partiallyComplete": 2,
                "incomplete": 1
            },
            "name": "Doe",
            "age": "22",
            "gender": "M",
            "dob": "14/03/2002",
            "education": "BSc",
            "married": "no",
            "job": "no",
            "spectacles": "no",
            "alcohol": "no",
            "immigrantEmigrant": "no",
            "otherInfo": "no",
            "bloodPressure": "no",
            "diabetes": "no",
            "asthma": "no",
            "epilepsy": "no",
            "cancer": "no",
            "heartDisease": "no",
            "mentalRetardation": "no",
            "TB": "no",
            "Stroke": "no",
            "liverDisease": "no",
            "dialysis": "no",
            "other": "NIL",
            "covidVaccination": "no",
            "maternityInfo": "NIL",
            "familyPlanningMethod": "NIL",
            "remark": "NIL"
        }
    ]
}

df = pd.json_normalize(data)
df.to_csv("output.csv", index=False)
