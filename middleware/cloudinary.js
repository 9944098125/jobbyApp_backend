const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../helpers/cloudinaryConfig");

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "resumes",
		resource_type: "raw",
		allowed_formats: ["pdf", "doc", "docx"],
		public_id: (req, file) => `${Date.now()}-${file.originalname}`,
	},
});

const upload = multer({ storage });

module.exports = upload;
