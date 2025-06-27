import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";
import {
  createListing,
  getAllListings,
  getListingById,
  getAllListingsOfUser,
  updateListing,
  deleteListing,
} from "../controllers/Listing.js";
import { checkUserType } from "../middlewares/checkUserType.js";

const router = Router();

router
  .route("/upload")
  .post(verifyJWT, checkUserType, upload.array("images", 5), createListing);
router.route("/display").get(getAllListings);
router.route("/display/:id").get(getListingById);
router.route("/display/user/:userId").get(getAllListingsOfUser);
router
  .route("/update/:id")
  .patch(verifyJWT, checkUserType, upload.array("images", 5), updateListing);
router.route("/delete/:id").delete(verifyJWT, checkUserType, deleteListing);

export default router;
