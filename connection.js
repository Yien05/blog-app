const mongoose = require("mongoose");
require("dotenv").config();
const { DB_URL} = process.env;

const connect = async () => {
    // console.log(DB_NAME);
    try {
        // await mongoose.connect(`mongodb://localhost/${DB_NAME}`);
        await mongoose.connect(
            `${DB_URL}`
        );

        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(`Error connecting to MongoDB: ${e.message}`);
    }
};

module.exports = connect;
