const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	comments: [
		{
			comment: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
			_id: false,
		},
	],
	likes: [
		{
			liker: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
			_id: false,
		},
	],
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Post", PostSchema);
