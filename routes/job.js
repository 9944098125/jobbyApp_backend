const {
	createJob,
	getJobs,
	updateJob,
	deleteJob,
	generateJobDescription,
	getApplicantsForEmployerJobs,
} = require("../controllers/job");
const {
	verifyEmployer,
	verifyJobOwner,
	verifyRegisteredUser,
} = require("../middleware/verify");

const router = require("express").Router();

router.route("/createJob").post(verifyEmployer, createJob);

router.route("/getJobs").get(getJobs);

router.route("/update/:jobId").patch(verifyJobOwner, updateJob);

router.route("/delete/:jobId").delete(verifyJobOwner, deleteJob);

router
	.route("/generate-job-description/:jobId")
	.post(verifyJobOwner, generateJobDescription);

router
	.route("/applicants/:jobId/:employerId")
	.get(verifyJobOwner, getApplicantsForEmployerJobs);

module.exports = router;
