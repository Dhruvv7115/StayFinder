import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoDBURI = process.env.MONGODB_URI;
const DBname = process.env.DB_NAME;

export default async function connect() {
  await mongoose
    .connect(`${mongoDBURI}/${DBname}`)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}
