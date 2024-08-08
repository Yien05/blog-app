const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const isAuth = require("../middleware/auth");
const Post = require("../models/Post");

router.post("/:id", isAuth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(400).json({ msg: "Post not found" });

        let exisitingLiker = await Like.findOne({ user: req.user._id, post: post._id });
        console.log(exisitingLiker);
        if (exisitingLiker) {
            await Like.findByIdAndDelete(exisitingLiker._id);
            post.likes.pull({ liker: exisitingLiker._id });
            post.save();
            return res.json({ msg: "Unlike a post" });
        } else {
            let like = new Like({ user: req.user._id, post: post._id });
            await like.save();
            post.likes.push({ liker: like });
            await post.save();

            return res.json({ msg: "Liked a post" });
        }
    } catch (e) {
        return res.status(400).json({ msg: "Cannot like this post" });
    }
});

module.exports = router;
