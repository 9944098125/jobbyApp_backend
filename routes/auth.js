const router = require("express").Router();
const {
	register,
	login,
	uploadResume,
	userAppliedForAJob,
	jobsAppliedByUser,
	getProfile,
	updatePassword,
	updateProfile,
} = require("../controllers/auth");
const { verifyRegisteredUser } = require("../middleware/verify");
const upload = require("../middleware/cloudinary");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/upload-resume/:userId").post(verifyRegisteredUser, uploadResume);

router
	.route("/apply/:jobId/:userId")
	.patch(verifyRegisteredUser, userAppliedForAJob);

router
	.route("/jobsAppliedByUser/:userId")
	.get(verifyRegisteredUser, jobsAppliedByUser);

router.route("/getProfile").get(verifyRegisteredUser, getProfile);

router.route("/update/:userId").patch(verifyRegisteredUser, updateProfile);

router
	.route("/updatePassword/:userId")
	.patch(verifyRegisteredUser, updatePassword);

module.exports = router;
