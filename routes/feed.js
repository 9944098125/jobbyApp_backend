const express = require("express");
const {
	create,
	read,
	update,
	deleteFeed,
	aiRewrite,
} = require("../controllers/feed");
const { verifyRegisteredUser } = require("../middleware/verify");

const router = express.Router();

router.route("/create/:userId").post(verifyRegisteredUser, create);

router.route("/read").get(read);

router.route("/ai-rewrite/:userId").post(verifyRegisteredUser, aiRewrite);

router.route("/update/:feedId/:userId").patch(verifyRegisteredUser, update);

router
	.route("/delete/:feedId/:userId")
	.delete(verifyRegisteredUser, deleteFeed);

module.exports = router;
