const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../helpers/cloudinaryConfig"); // Ensure correct Cloudinary import

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "resumes",
		resource_type: "raw", // Ensures PDFs and Docs are uploaded
		allowed_formats: ["pdf", "doc", "docx"],
		public_id: (req, file) => `resume_${Date.now()}_${file.originalname}`,
	},
});

const upload = multer({ storage });

module.exports = upload;
