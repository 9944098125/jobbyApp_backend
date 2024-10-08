require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./helpers/db");
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/job");

const app = express();
// some middleware functionalities
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes here
app.use("/api/auth", authRoute);

app.use("/api/jobs", jobsRoute);

app.use((err, req, res, next) => {
	const errMessage = err.message || "Something went wrong !";
	const errStatus = err.status || 500;
	return res.status(errStatus).json({
		message: errMessage,
		status: errStatus,
		error: err,
		stack: err.stack,
		success: false,
	});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	connectDB();
	console.log(`App is now running on port: ${port}`);
});
