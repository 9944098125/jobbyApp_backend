const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isEmployer: {
			type: Boolean,
			default: false,
		},
		profilePicture: {
			type: String,
			required: false,
		},
		countryCode: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		resume: {
			type: String,
		},
		address: {
			type: String,
			required: true,
		},
		appliedJobs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Job",
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
