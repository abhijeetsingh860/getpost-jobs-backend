# GetPost Jobs - Backend

A RESTful API backend for GetPost Jobs, a full-stack job portal application connecting job seekers with recruiters.

## 🚀 Live Demo

Backend API: https://getpost-jobs-backend.onrender.com

Frontend: https://getpost-jobs-frontend.vercel.app

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer, Cloudinary
- **Other:** cookie-parser, cors, dotenv

## ✨ Features

- User authentication (Student & Recruiter roles)
- JWT-based secure login with httpOnly cookies
- Company management (create, update)
- Job posting and management
- Job application system
- Applicant status tracking (Accepted/Rejected)
- Profile management with resume/photo upload via Cloudinary

## 📁 Project Structure

backend/
├── controllers/      # Route logic
├── middlewares/       # Auth & file upload middleware
├── models/            # Mongoose schemas
├── routes/            # API routes
├── utils/              # Helper functions (DB connection, Cloudinary, etc.)
└── index.js            # Entry point

## 🔌 API Endpoints

### User
- POST /api/v1/user/register - Register new user
- POST /api/v1/user/login - Login user
- GET /api/v1/user/logout - Logout user
- POST /api/v1/user/profile/update - Update profile

### Company
- POST /api/v1/company/register - Register company
- GET /api/v1/company/get - Get recruiter's companies
- GET /api/v1/company/get/:id - Get company by ID
- PUT /api/v1/company/update/:id - Update company

### Job
- POST /api/v1/job/post - Post a new job
- GET /api/v1/job/get - Get all jobs (with search)
- GET /api/v1/job/get/:id - Get job by ID
- GET /api/v1/job/getadminjobs - Get jobs posted by recruiter

### Application
- GET /api/v1/application/apply/:id - Apply to a job
- GET /api/v1/application/get - Get applied jobs
- GET /api/v1/application/:id/applicants - Get job applicants
- POST /api/v1/application/status/:id/update - Update application status

## ⚙️ Environment Variables

Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string
PORT=8000
SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

## 🚀 Getting Started

git clone https://github.com/abhijeetsingh860/getpost-jobs-backend.git
cd getpost-jobs-backend
npm install
npm run dev

## 👤 Author

**Abhijeet Singh**

- GitHub: [@abhijeetsingh860](https://github.com/abhijeetsingh860)