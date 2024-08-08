const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const isAuth = require("../middleware/auth");

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate({ path: "user", select: "-password" }).populate("comments.comment").populate("likes.liker");
        return res.json(posts);
    } catch (e) {
        return res.status(400).json({ error: e.message, msg: "Cannot get all posts" });
    }
});

router.get("/profile", isAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id }).populate({ path: "user", select: "-password" }).populate("comments.comment").populate("likes.liker");
        console.log(posts);
        return res.json(posts);
    } catch (e) {
        return res.status(400).json({ error: e.message, msg: "Cannot get all posts" });
    }
});

router.post("/", isAuth, (req, res) => {
    try {
        const post = new Post(req.body);
        // title, description, user
        post.user = req.user._id;
        post.save();
        return res.json({ post, msg: "Post added successfully" });
    } catch (e) {
        return res.status(400).json({ error: e.message, msg: "Failed to add a post" });
    }
});

// get post by id
router.get("/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        return res.json(post);
    } catch (e) {
        return res.json({ msg: e.message });
    }
});

//edit post
router.put("/:id", isAuth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        //here the req.user_id is a middleware, it is taking the isAuth and
        //passing the req.user and all the decoded data including the _id and name and everything
        if (post.user == req.user._id) {
            let updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.json({ msg: "Post updated successfully", updatePost });
        } else {
            return res.json({ msg: "Post doesn't belong to you!" });
        }
    } catch (e) {
        return res.json({ msg: e.message });
    }
    // req.user._id -> this is the id of the current logged in user
    // post.user._id -> this is the id of the user who created this post
    // if post.user._id == req.user._id then therefore update this post
});

//delete post
router.delete("/:id", isAuth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user._id) {
            await Post.findByIdAndDelete(req.params.id);
            return res.json({ msg: "Post deleted successfully", post });
        } else {
            return res.json({ msg: "Can't delete, post doesn't belong to you!" });
        }
    } catch (e) {
        return res.json({ msg: e.message });
    }
});

module.exports = router;
