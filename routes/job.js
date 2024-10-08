const {
	createJob,
	getJobs,
	updateJob,
	deleteJob,
	generateJobDescription,
} = require("../controllers/job");
const {
	verifyEmployer,
	verifyJobOwner,
	verifyRegisteredUser,
} = require("../middleware/verify");

const router = require("express").Router();

router.route("/createJob").post(verifyEmployer, createJob);

router.route("/getJobs/:userId").get(verifyRegisteredUser, getJobs);

router.route("/update/:jobId").patch(verifyJobOwner, updateJob);

router.route("/delete/:jobId").delete(verifyJobOwner, deleteJob);

router.route("/generate-job-description").post(generateJobDescription);

module.exports = router;
