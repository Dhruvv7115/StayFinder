import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./utils/connect.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

import userRouter from "./routes/User.js";
import listingRouter from "./routes/Listing.js";
import bookingRouter from "./routes/Booking.js";
import favouriteRouter from "./routes/Favourite.js";
import cookieParser from "cookie-parser";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/favourites", favouriteRouter);

app.get("/", (req, res) => {
  res.send("api is running...");
});

connect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port http://localhost:8000/`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
