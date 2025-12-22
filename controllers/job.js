const sendJobAppliedMailToEmployer = require("../helpers/sendJobAppliedMail");
const sendEmail = require("../helpers/sendEmail");
const Job = require("../models/Job");
const User = require("../models/User");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost",   // REQUIRED
    "X-Title": "My MERN App"               // REQUIRED
  }
});

const createJob = async (req, res, next) => {
	try {
		const {
			role,
			location,
			skills,
			experience,
			companyName,
			basicQualifications,
			aboutTheCompany,
			aboutTheJob,
			userId,
			salary,
			companyLogo,
		} = req.body;

		const user = await User.findOne({ _id: userId });
		if (!user) {
			return res.status(403).json({
				message:
					"This userId does not exist, You cannot create a job without userId 🚫",
			});
		}
		if (!companyLogo) {
			return res.status(403).json({
				message: "Company Logo is required !",
			});
		}
		if (!basicQualifications || !skills) {
			return res.status(403).json({
				message: "All the fields are required !",
			});
		}
		const newJob = new Job({
			role,
			location,
			skills,
			experience,
			companyName,
			basicQualifications,
			aboutTheCompany,
			aboutTheJob,
			userId,
			salary,
			companyLogo,
		});
		await newJob.save();
		sendEmail(user?.email, user?.name, "createdJob", newJob);
		// console.log(user.name?.split(" ")[0]);
		res.status(201).json({
			message: `Congrats ${
				user.name?.split(" ")[0]
			}, you have created a job with role ${role} in ${companyName}`,
			job: newJob,
		});
	} catch (err) {
		next(err);
	}
};

const getJobs = async (req, res, next) => {
	try {
		const { employerId } = req.query;
		const employer = await User.findOne({ _id: employerId });
		let jobs;
		if (!employerId) {
			jobs = await Job.find();
		} else {
			jobs = await Job.find({ userId: employerId });
		}
		res.status(200).json({
			message: employerId
				? `Hey ${
						employer.name.split(" ")[0]
				  } here are the jobs you have created !`
				: "Fetched the jobs successfully",
			jobs: jobs,
		});
	} catch (err) {
		next(err);
	}
};

const updateJob = async (req, res, next) => {
	try {
		const { jobId } = req.params;
		const job = await Job.findOne({ _id: jobId });
		const user = await User.findOne({ _id: job.userId });
		const updatedJob = await Job.findByIdAndUpdate(
			jobId,
			{ $set: { ...req.body } },
			{ new: true }
		);
		res.status(200).json({
			message: `You have successfully update the job ${
				user.name.split(" ")[0]
			}`,
			job: updatedJob,
		});
	} catch (err) {
		next(err);
	}
};

const deleteJob = async (req, res, next) => {
	try {
		const { jobId } = req.params;
		const job = await Job.findOne({ _id: jobId });
		if (!job) {
			return res.status(404).json({
				message: "Job not found",
			});
		}
		const user = await User.findOne({ _id: job.userId });
		await Job.findByIdAndDelete(jobId);
		res.status(200).json({
			message: `You have successfully delete the job ${
				user.name.split(" ")[0]
			}`,
		});
	} catch (err) {
		next(err);
	}
};

const generateJobDescription = async (req, res, next) => {
  try {
    const { jobTitle } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ error: "Job title is required" });
    }

    const apiResponse = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct", // safe free model
      messages: [
        {
          role: "system",
          content:
            "You are an HR assistant. Generate clear, professional job descriptions. Output ONLY the job description text. No headings, no quotes, no explanations."
        },
        {
          role: "user",
          content: `Generate a concise and effective job description for the following role:\n${jobTitle}`
        }
      ],
      max_tokens: 500,
      temperature: 0.5
    });

    let jobDescription =
      apiResponse.choices?.[0]?.message?.content || "";

    jobDescription = jobDescription
      .replace(/^["'`]+|["'`]+$/g, "")
      .trim();

    if (!jobDescription) {
      return res.status(500).json({ error: "AI failed to generate job description" });
    }

    return res.status(200).json({
      jobDescription
    });
  } catch (error) {
    next(error);
  }
};


const getApplicantsForEmployerJobs = async (req, res, next) => {
	try {
		const { employerId } = req.params;

		// Find jobs created by the employer
		const jobs = await Job.find({ userId: employerId }).populate({
			path: "appliedUser",
			select: "name email profilePicture countryCode phone resume",
		});

		// Extract job information and applicants
		const jobApplicants = jobs.map((job) => ({
			jobId: job?._id,
			companyName: job?.companyName,
			companyLogo: job?.companyLogo,
			role: job?.role,
			location: job?.location,
			skills: job?.skills,
			applicants: job.appliedUser,
		}));

		res.status(200).json({
			message: "Applicants fetched successfully",
			jobApplicants,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createJob,
	getJobs,
	updateJob,
	deleteJob,
	generateJobDescription,
	getApplicantsForEmployerJobs,
};
