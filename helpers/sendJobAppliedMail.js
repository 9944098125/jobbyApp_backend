const nodemailer = require("nodemailer");

async function sendJobAppliedMailToEmployer(employerEmail, employerName, user) {
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
			to: employerEmail,
			subject: "Job Applied 📞",
			html: `Alert ${employerName.split(" ")[0]}, ${
				user.name.split(" ")[0]
			} has applied for the job you have posted in JobbyApp. Please check the <a href="${
				user?.resume
			}" target="_blank">Resume Here</a>
			 => USER DETAILS: Name:${user?.name}<br />Email:${user.email}<br />Phone:${
				user.phone
			}`,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
		// console.log("Email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

module.exports = sendJobAppliedMailToEmployer;
