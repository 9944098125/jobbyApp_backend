const Feed = require("../models/Feed");
const User = require("../models/User");

const create = async (req, res, next) => {
	try {
		const { userId, title, description, images } = req.body;
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
		if (feed?.owner.userId !== userId) {
			return res.status(404).json({
				message: "Oh sorry ! It is not your Feed Item !",
			});
		}
		await Job.findByIdAndUpdate(
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

module.exports = { create, read, update, deleteFeed };
