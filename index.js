// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const connectDB = require("./helpers/db");
// const authRoute = require("./routes/auth");
// const jobsRoute = require("./routes/job");
// const feedsRoute = require("./routes/feed");

// const app = express();
// // some middleware functionalities
// app.use(cors());
// app.use(express.json({ limit: "100mb" }));
// app.use(bodyParser.urlencoded({ limit: "100md", extended: true }));

// // routes here
// app.use("/api/auth", authRoute);

// app.use("/api/jobs", jobsRoute);

// app.use("/api/feed", feedsRoute);

// app.use((err, req, res, next) => {
// 	const errMessage = err.message || "Something went wrong !";
// 	const errStatus = err.status || 500;
// 	return res.status(errStatus).json({
// 		message: errMessage,
// 		status: errStatus,
// 		error: err,
// 		stack: err.stack,
// 		success: false,
// 	});
// });

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
// 	connectDB();
// 	console.log(`App is now running on port: ${port}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./helpers/db");
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/job");
const feedsRoute = require("./routes/feed");

const app = express();

// ✅ Fix: Use `express.json()` **only** for routes that need JSON
app.use(cors());
app.use("/api", express.json({ limit: "100mb" }));
app.use("/api", bodyParser.urlencoded({ limit: "100mb", extended: true }));

// ✅ Do NOT apply JSON body parsing for file upload routes
app.use("/api/auth", authRoute);
app.use("/api/jobs", jobsRoute);
app.use("/api/feed", feedsRoute);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
	const errMessage = err.message || "Something went wrong!";
	const errStatus = err.status || 500;
	return res.status(errStatus).json({
		message: errMessage,
		status: errStatus,
		error: err,
		stack: err.stack,
		success: false,
	});
});

// ✅ Fix: Increase request size limit in `express.urlencoded()`
const port = process.env.PORT || 5000;
app.listen(port, () => {
	connectDB();
	console.log(`App is now running on port: ${port}`);
});
