const jwt = require("jsonwebtoken");
const Job = require("../models/Job");

const verifyRegisteredUser = (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}

	jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
		if (err) {
			return res
				.status(401)
				.json({ message: "Unauthorized! Invalid token", err });
		}
		req.user = decoded;
		const userId = req.params.userId || req.query.userId;
		if (userId !== req.user.userId) {
			console.log("userId", req.user?.userId, userId);
			return res.status(400).json({ message: "Unauthorized" });
		}
		next();
	});
};

const verifyJobOwner = (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1];
	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}
	jwt.verify(token, process.env.SECRET_TOKEN, async (err, decoded) => {
		if (err) {
			return res
				.status(401)
				.json({ message: "Unauthorized! Invalid token", err });
		}
		req.user = decoded;
		if (req.user.isEmployer) {
			const { jobId } = req.params;
			const job = await Job.findOne({ _id: jobId });
			if (!job) {
				return res.status(400).json({
					message: "Job not found",
				});
			}
			// console.log(job.userId, req.user.userId);
			if (job?.userId.equals(req.user.userId)) {
				next();
			} else {
				return res.status(400).json({
					message: "Come on Dude ! You are not the owner of this job...😒",
				});
			}
		} else {
			return res.status(403).json({
				message: "You are not an employer at all...😒",
			});
		}
	});
};

const verifyEmployer = (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1];
	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}
	jwt.verify(token, process.env.SECRET_TOKEN, async (err, decoded) => {
		if (err) {
			res.status(403).json({
				message: "Something went wrong !",
			});
		}
		req.user = decoded;
		// console.log(req.user.userId);
		if (req.user.isEmployer) {
			next();
		} else {
			return res.status(403).json({
				message: "You are not an employer...",
			});
		}
	});
};

module.exports = { verifyRegisteredUser, verifyEmployer, verifyJobOwner };
