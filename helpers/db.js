const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Hurray 🎉! Connected to JobbyApp database successfully...✅");
	} catch (error) {
		throw error;
	}
};

mongoose.connection.on("connected", () => {
	console.log("Connecting to MongoDB database 🔃");
});

mongoose.connection.on("disconnected", () => {
	console.log("Disconnected from database 😵");
	connectDB();
});

mongoose.connection.on("error", (error) => {
	console.log("🚫 Error in database connection: ", error);
});

module.exports = connectDB;
