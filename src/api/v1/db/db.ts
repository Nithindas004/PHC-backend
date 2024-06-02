import mongoose from 'mongoose';

export const dbConnection = async () => {
    await mongoose
    .connect("mongodb+srv://nithindas1234:1234nith@cluster0.lvn9hia.mongodb.net/phcDb?retryWrites=true&w=majority",{useNewUrlParser: true})
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error: any) => {
        console.error("Error connecting to database:", error);
    });
}