import { isValidObjectId } from "mongoose";
import Favourite from "../models/Favourite.js";

const addToFavourites = async (req, res) => {
  const { listingId } = req.body;

  if (!isValidObjectId(listingId)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid listing id.",
    });
  }

  try {
    const favourite = await Favourite.create({
      user: req.user._id,
      listing: listingId,
      createdAt: Date.now(),
    });

    if (!favourite) {
      return res.status(500).json({
        status: "FAILED",
        message: "Internal server error in creating a favourite.",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "Listing added to favourites successfully.",
      favourite,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(400).json({
      status: "FAILED",
      message: "Error adding listing to favourites.",
    });
  }
};

const removeFromFavourites = async (req, res) => {
  const { listingId } = req.body;

  if (!isValidObjectId(listingId)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid listing id.",
    });
  }

  try {
    const removedFavourite = await Favourite.deleteOne({ listing: listingId });

    if (!removedFavourite) {
      return res.status(200).json({
        status: "FAILED",
        message: "Error occured while removing the favourite.",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "Favourite removed successfully.",
      removedFavourite,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    throw new Error("Error occured while removing listing from favourites.");
  }
};

const getUserFavourites = async (req, res) => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid user id.",
    });
  }

  try {
    const userFavourites = await Favourite.find({ user: userId }).populate(
      "listing",
      "images price owner"
    );

    if (!userFavourites || userFavourites.length === 0) {
      return res.status(400).json({
        status: "FAILED",
        message: "No user favourites found.",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "User favourites fetched successfully.",
      userFavourites,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(400).json({
      status: "FAILED",
      message: "Error occured while fetching user favourites.",
    });
  }
};

export { addToFavourites, removeFromFavourites, getUserFavourites };
