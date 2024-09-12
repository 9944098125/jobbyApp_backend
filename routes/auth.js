const router = require("express").Router();
const {
	register,
	login,
	uploadResume,
	userAppliedForAJob,
} = require("../controllers/auth");
const { verifyRegisteredUser } = require("../middleware/verify");
const upload = require("../middleware/cloudinary");

router.route("/register").post(register);

router.route("/login").post(login);

router
	.route("/upload-resume/:userId")
	.post(verifyRegisteredUser, upload.single("resume"), uploadResume);

router
	.route("/apply/:jobId/:userId")
	.patch(verifyRegisteredUser, userAppliedForAJob);

module.exports = router;
