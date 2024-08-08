const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { SECRET_KEY } = process.env;

//localhost:9999/users/register -> name, username, password
router.post("/register", async (req, res) => {
    try {
        //check if the user already exist by its username if it exist dont allow to register, or else allow to register
        let userFound = await User.findOne({ username: req.body.username });
        if (userFound) {
            return res.status(400).json({ msg: "User already exists" });
        }

        let user = new User(req.body);
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(user.password, salt); // qweqweqwe -> asiudasyiud2321312312jhdask123621
        user.password = hash;
        user.save();
        return res.json({ user, msg: "Registered successfully" });
    } catch (e) {
        return res.status(400).json({ msg: "Failed to register", error: e.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        let userFound = await User.findOne({ username });
        // console.log(userFound);

        if (!userFound) return res.status(400).json({ msg: "User Not Found" });

        let isMatch = bcrypt.compareSync(password, userFound.password);
        // console.log(isMatch);

        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        jwt.sign({ data: userFound }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
            if (err) return res.status.json({ msg: "Failed to login", error: e.message });
            return res.json({ token, user: userFound, msg: "Login successfully" });
        });
    } catch (e) {
        return res.status(400).json({ msg: "Invalid Credentials" });
    }
});

module.exports = router;
