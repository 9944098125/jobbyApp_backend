const nodemailer = require("nodemailer");

async function sendJobAppliedMailToEmployer(employerEmail, employerName, user) {
	try {
		// Create a transporter using your email service credentials
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "srinivas72075@gmail.com",
				pass: "ifhp vypf rhqb ubpw",
			},
		});

		// Email content with clickable resume link
		const mailOptions = {
			from: "srinivas72075@gmail.com",
			to: employerEmail,
			subject: "Job Applied 📞",
			html: `
				<p>Alert ${employerName.split(" ")[0]},</p>
				<p>${
					user.name.split(" ")[0]
				} has applied for the job you posted on JobbyApp.</p>
				<p><strong>User Details:</strong></p>
				<ul>
					<li><strong>Name:</strong> ${user?.name}</li>
					<li><strong>Email:</strong> ${user?.email}</li>
					<li><strong>Phone:</strong> ${user?.countryCode}+${user?.phone}</li>
				</ul>
				<p>You can <a href="${
					user?.resume
				}" target="_blank" style="color:blue; font-weight:bold;">VIEW THE RESUME HERE</a>.</p>
			`,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

module.exports = sendJobAppliedMailToEmployer;
