const Feed = require("../models/Feed");
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

const create = async (req, res, next) => {
	try {
		const { title, description, images, reference } = req.body;
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
			reference,
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
		if (feed?.owner.userId.toString() !== userId) {
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
      return res.status(400).json({ error: "Description is required" });
    }

    const apiResponse = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        {
          role: "user",
          content: `Rewrite the following post description.
Return ONLY the rewritten text.
Do NOT add explanations, options, labels, or quotes.

Text:
${description}`
        }
      ],
      max_tokens: 300,
      temperature: 0.4
    });

    let rewrittenText =
      apiResponse.choices?.[0]?.message?.content || "";

    rewrittenText = rewrittenText
      .replace(/^["'`]+|["'`]+$/g, "")
      .trim();

    return res.status(200).json({
      description: rewrittenText
    });
  } catch (error) {
    next(error);
  }
};



module.exports = { create, read, update, deleteFeed, aiRewrite };
