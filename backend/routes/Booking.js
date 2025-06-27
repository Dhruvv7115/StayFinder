import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
  createABooking,
  getAllBookingsOfUser,
  getBookingById,
} from "../controllers/Booking.js";

const router = Router();

// Define a route for booking
router.route("/create").post(verifyJWT, createABooking);
router.route("/display").get(verifyJWT, getAllBookingsOfUser);
router.route("/display/:bookingId").get(getBookingById);

export default router;
