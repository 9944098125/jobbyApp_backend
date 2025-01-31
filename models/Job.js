const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
	{
		role: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		skills: {
			type: [Number],
			required: true,
		},
		experience: {
			type: [Number],
			required: true,
		},
		companyLogo: {
			type: String,
			required: true,
		},
		companyName: {
			type: String,
			required: true,
		},
		basicQualifications: {
			type: [Number],
		},
		appliedUser: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
		},
		aboutTheCompany: {
			type: String,
			required: true,
		},
		aboutTheJob: {
			type: String,
			required: true,
		},
		salary: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
