const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const isAuth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const comment = await Comment.find().populate("user").populate("post");
    return res.json(comment);
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Cannot get all comment" });
  }
});

//POST -> localhost:9999/comments/postId
router.post("/:id", isAuth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.json({ msg: "Post not found" });

    let comment = await Comment.create(req.body);

    post.comments.push({ comment: comment._id });
    await post.save();
    return res.json({ msg: "Commend added successfully", comment });
  } catch (e) {
    return res
      .status(400)
      .json({
        msg: "Cannot add a comment, Please try again later",
        error: e.message,
      });
  }
});

// update comment -> process.env.REACT_APP_API_URL/comments/commentId
router.put("/:id", isAuth, async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;
  const userId = req.user._id; // Assuming isAuth middleware adds the user object to req

  try {
    // Find the comment by ID
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the one who commented
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update the comment fields
    if (body) {
      comment.body = body;
    }
    comment.updated_at = Date.now();

    // Save the updated comment
    await comment.save();

    res.status(200).json({ msg: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

//delete comment
router.delete("/:id", isAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(400).json({ msg: "Comment not found" });
    // console.log (comment);
    // console.log(comment.post);
    let post = await Post.findOne({ _id: comment.post });
    //  console.log(post);
    //  return
    if (post) {
      await Comment.findByIdAndDelete(req.params.id);
      post.comments.pull({ comment: req.params.id });
      post.save();
      return res.json({ msg: "Comment Deleted" });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Cannot delete the comment" });
  }
});

module.exports = router;
