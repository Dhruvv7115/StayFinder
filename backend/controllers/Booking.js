import { isValidObjectId } from "mongoose";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

const createABooking = async (req, res) => {
  // Logic to create a booking
  try {
    const bookingData = req.body;

    if (
      !bookingData ||
      !bookingData.listing ||
      !bookingData.startDate ||
      !bookingData.endDate ||
      !bookingData.totalPrice ||
      !bookingData.owner
    ) {
      console.log(bookingData);
      return res.status(400).json({ message: "Invalid booking data" });
    }
    if (bookingData.owner === req.user._id) {
      console.log("You cannot book your own listing");
      return res
        .status(400)
        .json({ message: "You cannot book your own listing" });
    }
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    if (user.type === "host") {
      console.log("Only users can create bookings.");
      return res
        .status(403)
        .json({ message: "Only users can create bookings." });
    }

    const booking = await Booking.create({
      ...bookingData,
      user: req.user._id,
    });

    if (!booking) {
      console.log("Booking creation failed");
      return res.status(400).json({ message: "Booking creation failed" });
    }

    return res.status(201).json({
      status: "SUCCESS",
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getAllBookingsOfUser = async (req, res) => {
  const userId = req.user._id;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "User ID is Invalid." });
  }
  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }

    if (user.type === "host") {
      return res.status(403).json({
        status: "FAILED",
        message: "Only users can view bookings.",
      });
    }
    // Fetch all bookings for the user
    const bookings = await Booking.find({ user: userId })
      .populate("listing", "address description images -_id")
      .populate("owner", "name email avatar -_id");
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        status: "FAILED",
        message: "No bookings found for this user",
      });
    }
    return res.status(200).json({
      status: "SUCCESS",
      message: `All bookings for user with ID ${userId} retrieved successfully`,
      bookings,
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
    });
  }
};
const getBookingById = async (req, res) => {
  // Logic to get a booking by ID
  const { bookingId } = req.params;
  if (!isValidObjectId(bookingId)) {
    return res.status(400).json({ message: "Invalid booking ID" });
  }
  try {
    const booking = await Booking.findById(bookingId)
      .select("-__v")
      .populate("listing", "address description images -_id")
      .populate("user", "name email avatar -_id")
      .populate("owner", "name avatar -_id");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({
      message: `Booking with ID ${bookingId} retrieved successfully`,
      booking,
    });
  } catch (error) {
    console.error("Error retrieving booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createABooking, getAllBookingsOfUser, getBookingById };
