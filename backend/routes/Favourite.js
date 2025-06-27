import { Router } from "express";
import {
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
} from "../controllers/Favourite.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.use(verifyJWT);

router.route("/add").post(addToFavourites);
router.route("/remove").delete(removeFromFavourites);
router.route("/user").get(getUserFavourites);

export default router;
