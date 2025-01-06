const router = require("express").Router();
const {
	register,
	login,
	uploadResume,
	userAppliedForAJob,
	jobsAppliedByUser,
	getProfile,
	updatePassword,
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

router
	.route("/jobsAppliedByUser/:userId")
	.get(verifyRegisteredUser, jobsAppliedByUser);

router.route("/:userId").get(verifyRegisteredUser, getProfile);

router
	.route("/updatePassword/:userId")
	.patch(verifyRegisteredUser, updatePassword);

module.exports = router;
