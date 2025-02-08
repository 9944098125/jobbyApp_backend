const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../helpers/cloudinaryConfig");

// ✅ Multer Storage Configuration
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "resumes",
		resource_type: "raw", // Support for PDF & DOCX
		allowed_formats: ["pdf", "doc", "docx"],
		public_id: (req, file) => {
			const fileName = file.originalname.split(".").shift();
			const fileExt = file.originalname.split(".").pop();
			return `${fileName}-${Date.now()}.${fileExt}`;
		},
	},
});

// ✅ Multer Upload Middleware
const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
	fileFilter: (req, file, cb) => {
		if (
			![
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			].includes(file.mimetype)
		) {
			return cb(
				new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."),
				false
			);
		}
		cb(null, true);
	},
});

module.exports = upload;
