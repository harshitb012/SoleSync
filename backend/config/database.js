const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB, {
  
        serverSelectionTimeoutMS: 30000 
    })
    .then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1); // Exit the process with an error code
    });
};

module.exports = connectDatabase;
