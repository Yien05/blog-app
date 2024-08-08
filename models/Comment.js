const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
	body: { type: String },
	post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Comment", CommentSchema);
