const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 9999;
const connectDB = require("./connection");

app.use(cors()); //Allows request from different origins frontend->backend
app.use(express.json()); //Accepts incoming request in JSON format

app.use("/users", require("./controllers/users"));
app.use('/posts', require('./controllers/posts'));
app.use('/comments', require('./controllers/comments'));
app.use('/likes', require('./controllers/likes'));

connectDB();
app.listen(PORT, () => console.log("Server is running on PORT: " + PORT));