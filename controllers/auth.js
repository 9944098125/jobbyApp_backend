const User = require("../models/User");
const bcryptJs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
const sendEmail = require("../helpers/sendEmail");
const sendJobAppliedMailToEmployer = require("../helpers/sendJobAppliedMail");

const register = async (req, res, next) => {
	try {
		const {
			name,
			email,
			password,
			isEmployer,
			profilePicture,
			countryCode,
			phone,
		} = req.body;
		const saltRounds = bcryptJs.genSaltSync(12);
		const hashedPassword = bcryptJs.hashSync(password, saltRounds);
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			isEmployer,
			profilePicture,
			countryCode,
			phone,
		});
		await newUser.save();
		sendEmail(email, name, "register", {});
		res.status(201).json({
			message: `Congrats ${
				name.split(" ")[0]
			}, You have successfully registered with us !🥳`,
		});
	} catch (err) {
		next(err);
	}
};

const uploadResume = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ _id: userId });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// console.log(req.file);
		user.resume = req.file.path;
		await user.save();

		sendEmail(user?.email, user?.name.split(" ")[0], "uploaded", {});
		res.status(200).json({
			message: `You have uploaded your resume successfully, ${
				user?.name?.split(" ")[0]
			}`,
			resume: user.resume,
		});
	} catch (err) {
		next(err);
	}
};

const login = async (req, res, next) => {
	const { emailOrPhone, password } = req.body;
	// console.log(req.body);
	try {
		// check if the req has email or not
		const isEmail = /^\S+@\S+\.\S+$/.test(emailOrPhone);

		const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };
		const existingUser = await User.findOne(query);
		if (!existingUser) {
			return res
				.status(400)
				.json({ message: "No User with this email or Phone...❌" });
		}
		const passwordMatches = await bcryptJs.compare(
			password,
			existingUser.password
		);
		if (!passwordMatches) {
			return res.status(504).json({ message: "Wrong Password !" });
		}
		const userWithoutPassword = await User.findOne(query).select("-password");
		const token = jwt.sign(
			{
				userId: existingUser._id,
				isEmployer: existingUser.isEmployer,
			},
			process.env.SECRET_TOKEN
		);
		sendEmail(existingUser.email, existingUser.name, "login", {});
		res.status(200).json({
			message: "Login Success ✅",
			token: token,
			user: userWithoutPassword,
		});
	} catch (err) {
		next(err);
	}
};

const userAppliedForAJob = async (req, res, next) => {
	try {
		const { jobId, userId } = req.params;
		const job = await Job.findById(jobId);
		const user = await User.findById(userId);

		if (!job) {
			return res.status(404).json({ message: "Job not found" });
		}
		sendEmail(user.email, user.name, "applied", job);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.appliedJobs.includes(jobId)) {
			return res
				.status(400)
				.json({ message: "User has already applied for this job" });
		}

		user.appliedJobs.push(jobId);
		job.appliedUser.push(userId);
		await user.save();
		await job.save();
		const jobCreator = await User.findOne({ _id: job.userId });
		if (jobCreator) {
			sendJobAppliedMailToEmployer(jobCreator.email, jobCreator.name, user);
		}

		res.status(200).json({ message: "Applied successfully", user, job });
	} catch (error) {
		next(err);
	}
};

const jobsAppliedByUser = async (req, res, next) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			res.status(403).json({
				message: "User ID must exist for fetching jobs applied by a user",
			});
		}

		const jobs = await Job.find({ userId: userId });
		const user = await User.findOne({ _id: userId });
		res.status(200).json({
			message: `Fetched jobs applied by ${user?.name}`,
			jobs: jobs,
		});
	} catch (err) {
		next(err);
	}
};

const getProfile = async (req, res, next) => {
	try {
		const { userId } = req.query;
		if (!userId) {
			return res.status(404).json({
				message: "Please provide userId to fetch profile",
			});
		}
		const user = await User.findOne({ _id: userId });

		res.status(200).json({
			message: "Profile fetched Successfully",
			user: user,
		});
	} catch (err) {
		next(err);
	}
};

const updatePassword = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { oldPassword, newPassword } = req.body;
		const user = await User.findById({ _id: userId });
		if (!user) {
			res.status(404).json({
				message: `User with id ${userId} does not exist 🚫`,
			});
			return;
		}
		const isPasswordCorrect = bcryptJs.compareSync(oldPassword, user.password);
		if (!isPasswordCorrect) {
			res.status(400).json({
				message: `Incorrect old password! Please try again... 😒`,
			});
			return;
		}
		const saltRounds = bcryptJs.genSaltSync(12);
		const hashedPassword = bcryptJs.hashSync(newPassword, saltRounds);
		await User.findByIdAndUpdate(
			{ _id: userId },
			{
				password: hashedPassword,
			}
		);
		res.status(200).json({
			message: `Hola, ${user?.name} updated your password successfully 🤩`,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	register,
	uploadResume,
	login,
	userAppliedForAJob,
	jobsAppliedByUser,
	getProfile,
	updatePassword,
};
