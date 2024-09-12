const nodemailer = require("nodemailer");

async function sendEmail(email, name, mode, job) {
	try {
		// Create a transporter using your email service credentials
		const transporter = nodemailer.createTransport({
			service: "Gmail", // service provider
			auth: {
				user: "srinivas72075@gmail.com",
				pass: "ifhp vypf rhqb ubpw",
			},
		});

		// Email content
		const mailOptions = {
			from: "srinivas72075@gmail.com",
			to: email,
			subject:
				mode === "register"
					? "Welcome, you are a member of our App now..."
					: mode === "login"
					? `Login Alert 📞 ${name?.split(" ")[0]}`
					: mode === "applied"
					? `You have applied for the ${job.role} role in the ${job.company} successfully`
					: mode === "createdJob"
					? `You have successfully created a job ${
							name?.split(" ")[0]
					  } in the company ${job.company}`
					: "Uploaded Resume",
			html:
				mode === "register"
					? `
       You have successfully Registered with us ${
					name?.split(" ")[0]
				}, so now search and apply for different jobs you suit for...
      `
					: mode === "login"
					? `You have successfully logged in ${
							name?.split(" ")[0]
					  }, if it's not you please contact us`
					: mode === "applied"
					? `You have successfully applied for the job <br />1.for the role of --->>> ${job.role}<br />2. in --->>> ${job.companyName}<br />3. with the job description >>> ${job.aboutTheJob}<br />4. with --->>> ${job.aboutTheCompany}<br />5. for --->>> ${job.salary}<br />6. if you have at least >>> ${job?.basicQualifications} you are suitable for this role.`
					: mode === "createdJob"
					? `You have created a job successfully`
					: `You have uploaded your resume ${
							name?.split(" ")[0]
					  } successfully, now start applying for jobs`,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
		// console.log("Email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

module.exports = sendEmail;
