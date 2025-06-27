import Listing from "../models/Listing.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

const uploadImages = async (images) => {
  try {
    const uploadPromises = images.map((image) => uploadOnCloudinary(image));
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages.map((image) => image.secure_url); // Assuming uploadOnCloudinary returns an object with secure_url
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload images");
  }
};
const deleteImages = async (images) => {
  try {
    const oldImages = images.map((image) => {
      const parts = image.split("/");
      const publicId = parts[parts.length - 1].split(".")[0]; // Extract public ID from the URL
      return publicId;
    });
    const deletePromises = oldImages.map((image) =>
      deleteFromCloudinary(image)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting images:", error);
    throw new Error("Failed to delete images");
  }
};

const createListing = async (req, res) => {
  try {
    const listingData = req.body;

    if (
      !listingData.address ||
      !listingData.description ||
      !listingData.price ||
      !listingData.bedrooms ||
      !listingData.bathrooms ||
      !listingData.type
    ) {
      return res.status(400).json({
        message:
          "Address, description, price, bedrooms, bathrooms and type of listing is required.",
      });
    }
    const images = req.files.map((file) => file.path); // Assuming images are uploaded and stored in req.files
    if (images.length === 0) {
      return res.status(400).json({
        status: "FAILED",
        message: "At least one image is required.",
      });
    }
    const imagesUploaded = await uploadImages(images);

    const newListing = await Listing.create({
      ...listingData,
      images: imagesUploaded, // Assuming images are uploaded and stored in req.files
      owner: req.user._id, // Assuming user ID is available in req.user
    });

    return res.status(201).json({
      status: "SUCCESS",
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: "Error creating listing",
      error: error.message,
    });
  }
};

const getAllListings = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "price",
    sortType = "asc",
    bedrooms,
    washrooms,
  } = req.query;

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortType === "asc" ? 1 : -1 }, // Sort by price or any other field
    };

    const aggregateQuery = Listing.aggregate([
      {
        $match: {
          availability: true,
          ...(bedrooms ? { bedrooms: parseInt(bedrooms) } : {}),
          ...(washrooms ? { bathrooms: parseInt(washrooms) } : {}),
        },
      },
      {
        $lookup: {
          from: "users", // the name of the users collection (check your DB for exact name)
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $project: {
          title: 1,
          price: 1,
          availability: 1,
          images: 1,
          bedrooms: 1,
          bathrooms: 1,
          type: 1,
          "owner.name": 1,
          "owner.avatar": 1,
        },
      },
    ]);

    const listings = await Listing.aggregatePaginate(aggregateQuery, options);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Listings retrieved successfully",
      listings: listings.docs,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: "Error retrieving listings",
      error: error.message,
    });
  }
};

const getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id)
      .populate("owner", "_id name avatar")
      .select("-__v");

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    return res.status(200).json({
      message: "Listing retrieved successfully",
      listing,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving listing",
      error: error.message,
    });
  }
};

const getAllListingsOfUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const listings = await Listing.find({ owner: userId })
      .populate("owner", "-_id name avatar")
      .select("-__v");

    if (listings.length === 0) {
      return res.status(404).json({
        message: "No listings found for this user",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "Listings retrieved successfully",
      listings,
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: "Error retrieving listings",
      error: error.message,
    });
  }
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body;
  console.log("Update request received:");
  console.log("ID:", id);
  console.log("Body:", listingData);
  console.log("Files:", req.files);

  try {
    if (!isValidObjectId(id)) {
      console.log("Invalid listing id.");
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid listing id.",
      });
    }
    let listing = await Listing.findById(id);

    if (!listing) {
      console.log("Listing not found.");
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    if (req.files && req.files.length > 0) {
      const previousImages = listing.images || [];
      // Remove previous images from cloud storage
      if (previousImages.length > 0) {
        await deleteImages(previousImages);
      }
      // Upload new images
      const images = req.files.map((file) => file.path);
      const imagesUploaded = await uploadImages(images);
      listing.images = imagesUploaded;
    }

    listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

    const updatedListing = await Listing.findById(id)
      .populate("owner", "-_id name avatar")
      .select("-__v");

    return res.status(200).json({
      status: "SUCCESS",
      message: "Listing updated successfully",
      updatedListing,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      status: "FAILED",
      message: "Error updating listing",
      error: error.message,
    });
  }
};

const deleteListing = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }
    // Delete images from cloud storage
    if (listing.images && listing.images.length > 0) {
      await deleteImages(listing.images);
    }
    // Delete the listing from the database
    await Listing.findByIdAndDelete(id);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Listing deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "FAILED",
      message: "Error deleting listing",
      error: error.message,
    });
  }
};

export {
  createListing,
  getAllListings,
  getListingById,
  getAllListingsOfUser,
  updateListing,
  deleteListing,
};
