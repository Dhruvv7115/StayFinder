import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-aggregate-paginate-v2";

const listingSchema = new Schema({
  address: {
    type: String,
    trim: true,
    required: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    trim: true,
    required: true,
    minLength: [10, "Description must be at least 10 characters long"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },
  type: {
    type: String,
    enum: ["apartment", "house", "condo", "townhouse", "flat", "other"],
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: [1, "Number of bedrooms must be at least 1"],
  },
  bathrooms: {
    type: Number,
    required: true,
    min: [0, "Number of bathrooms must be a non-negative integer"],
  },
});
listingSchema.plugin(mongoosePaginate);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
