const Feed = require("../models/Feed");
const User = require("../models/User");
const OpenAI = require("openai");

// Create a configuration with your OpenAI API key
const openAI = new OpenAI({
	apiKey: process.env.OPEN_AI_API_KEY,
});

const create = async (req, res, next) => {
	try {
		const { title, description, images } = req.body;
		const { userId } = req.params;
		const user = await User.findOne({ _id: userId });
		const newFeed = new Feed({
			owner: {
				userId: userId,
				profilePicture: user?.profilePicture,
				name: user?.name,
			},
			title,
			description,
			images,
		});
		await newFeed.save();
		res.status(200).json({
			message: "Fetched the feed successfully",
			user: user,
			feed: newFeed,
		});
	} catch (err) {
		next(err);
	}
};

const read = async (req, res, next) => {
	try {
		const feedItems = await Feed.find();
		res.status(200).json({
			message: "Feed Items fetched successfully",
			feedItems: feedItems,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const { feedId, userId } = req.params;
		const feed = await Feed.findOne({ _id: feedId });
		if (feed?.owner.userId?.toString() !== userId) {
			console.log("feed userId", feed?.owner?.userId);
			return res.status(404).json({
				message: "Oh sorry ! It is not your Feed Item !",
			});
		}
		await Feed.findByIdAndUpdate(
			feedId,
			{ $set: { ...req.body } },
			{ new: true }
		);
		res.status(200).json({
			message: "Updated the Feed successfully",
		});
	} catch (err) {
		next(err);
	}
};

const deleteFeed = async (req, res, next) => {
	try {
		const { feedId, userId } = req.params;
		const feed = await Feed.findOne({ _id: feedId });
		if (feed?.owner.userId !== userId) {
			return res.status(404).json({
				message: "Oh sorry ! It is not your Feed Item !",
			});
		}
		await Feed.findByIdAndDelete(feedId);
		res.status(200).json({
			message: "Deleted the Feed successfully",
		});
	} catch (err) {
		next(err);
	}
};

const aiRewrite = async (req, res, next) => {
	try {
		const { description } = req.body;
		if (!description) {
			return res.status(304).json({
				message: "Prefilled Description not provided !",
			});
		}
		const completion = await openAI.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are an expert in completing the posts in jobs related apps.",
				},
				{
					role: "user",
					content: `Here is my post's not formatted description, so now please rewrite the same content professionally => ${description}.`,
				},
			],
			max_tokens: 500,
		});

		const formattedDescription = completion.choices[0].message.content;

		res.status(200).json({
			message: "Description Re-written.",
			description: formattedDescription,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { create, read, update, deleteFeed, aiRewrite };
