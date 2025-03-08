const mongoose = require("mongoose");
const configs = require("./config");

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(configs.databaseURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDatabase;