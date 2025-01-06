const mongoose = require("mongoose");

const feedSchema = mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		images: {
			type: [String],
		},
	},
	{ timestamps: true }
);

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
