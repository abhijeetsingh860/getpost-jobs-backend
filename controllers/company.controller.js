import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "A company with this name is already registered.",
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Register company error:", error);
        return res.status(500).json({
            message: "Internal server error registering company.",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            companies: companies || [],
            success: true
        });
    } catch (error) {
        console.error("Get company error:", error);
        return res.status(500).json({
            message: "Internal server error fetching companies.",
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("Get company by id error:", error);
        return res.status(500).json({
            message: "Internal server error fetching company.",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        if (name) company.name = name;
        if (description) company.description = description;
        if (website) company.website = website;
        if (location) company.location = location;

        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                company.logo = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary company logo upload failed:", uploadError);
            }
        }

        await company.save();

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Update company error:", error);
        return res.status(500).json({
            message: "Internal server error updating company.",
            success: false
        });
    }
};