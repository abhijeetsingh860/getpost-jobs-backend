import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getAdminJobs, 
    getAllJobs, 
    getJobById, 
    postJob, 
    updateJob, 
    toggleJobStatus, 
    getSimilarJobs 
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);
router.route("/similar/:id").get(getSimilarJobs);
router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/status/:id").patch(isAuthenticated, toggleJobStatus);

export default router;
