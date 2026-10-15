import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile, 
    toggleSaveJob, 
    getSavedJobs 
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);
router.route("/saved-jobs/:jobId").post(isAuthenticated, toggleSaveJob);

export default router;
