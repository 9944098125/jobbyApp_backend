const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const cloudinary = require("../helpers/cloudinaryConfig");

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "resumes",
		resource_type: "raw", // Ensure the correct type if not auto-detecting
		allowed_formats: ["pdf", "doc", "docx"],
		public_id: (req, file) => {
			const extension = file.originalname.split(".").pop();
			return `${file.originalname.split(".")[0]}.${extension}`;
		},
		format: async (req, file) => file.originalname.split(".").pop(),
	},
});

const upload = multer({
	storage: storage,
});
module.exports = upload;
