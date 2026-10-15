import { Job } from "../models/job.model.js";

// Recruiter posts job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !companyId) {
            return res.status(400).json({
                message: "Please fill in all required job fields.",
                success: false
            });
        }

        const requirementsArray = typeof requirements === "string" 
            ? requirements.split(",").map(r => r.trim()).filter(Boolean)
            : (Array.isArray(requirements) ? requirements : []);

        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience) || 0,
            position: Number(position) || 1,
            company: companyId,
            created_by: userId,
            status: 'active'
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Post job error:", error);
        return res.status(500).json({
            message: "Internal server error while creating job.",
            success: false
        });
    }
};

// Candidate / Guest gets all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const location = req.query.location || "";
        const jobType = req.query.jobType || "";

        const query = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { requirements: { $regex: keyword, $options: "i" } },
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (jobType) {
            query.jobType = { $regex: jobType, $options: "i" };
        }

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .populate({ path: "created_by", select: "-password" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: jobs || [],
            success: true
        });
    } catch (error) {
        console.error("Get all jobs error:", error);
        return res.status(500).json({
            message: "Internal server error while fetching jobs.",
            success: false
        });
    }
};

// Get single job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({ path: "company" })
            .populate({
                path: "applications",
                populate: {
                    path: "applicant",
                    select: "-password"
                }
            })
            .populate({ path: "created_by", select: "-password" });

        if (!job) {
            return res.status(404).json({
                message: "Job opening not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Get job by id error:", error);
        return res.status(500).json({
            message: "Internal server error fetching job details.",
            success: false
        });
    }
};

// Recruiter gets their posted jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .populate({ path: 'applications' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: jobs || [],
            success: true
        });
    } catch (error) {
        console.error("Get admin jobs error:", error);
        return res.status(500).json({
            message: "Internal server error fetching recruiter jobs.",
            success: false
        });
    }
};

// Update an existing job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, status } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to edit this job", success: false });
        }

        if (title) job.title = title;
        if (description) job.description = description;
        if (salary !== undefined) job.salary = Number(salary);
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (experience !== undefined) job.experienceLevel = Number(experience);
        if (position !== undefined) job.position = Number(position);
        if (companyId) job.company = companyId;
        if (status) job.status = status;

        if (requirements) {
            job.requirements = typeof requirements === "string"
                ? requirements.split(",").map(r => r.trim()).filter(Boolean)
                : requirements;
        }

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Update job error:", error);
        return res.status(500).json({
            message: "Internal server error updating job.",
            success: false
        });
    }
};

// Toggle active/closed status
export const toggleJobStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized", success: false });
        }

        job.status = job.status === 'active' ? 'closed' : 'active';
        await job.save();

        return res.status(200).json({
            message: `Job marked as ${job.status}.`,
            status: job.status,
            success: true
        });
    } catch (error) {
        console.error("Toggle job status error:", error);
        return res.status(500).json({ message: "Server error updating job status", success: false });
    }
};

// Similar jobs recommendations
export const getSimilarJobs = async (req, res) => {
    try {
        const jobId = req.params.id;
        const currentJob = await Job.findById(jobId);
        if (!currentJob) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        const similarJobs = await Job.find({
            _id: { $ne: jobId },
            status: 'active',
            $or: [
                { jobType: currentJob.jobType },
                { location: currentJob.location },
                { title: { $regex: currentJob.title.split(" ")[0], $options: "i" } }
            ]
        })
        .populate({ path: 'company' })
        .limit(4);

        return res.status(200).json({
            jobs: similarJobs,
            success: true
        });
    } catch (error) {
        console.error("Get similar jobs error:", error);
        return res.status(500).json({ message: "Server error fetching similar jobs", success: false });
    }
};