const mongoose = require("mongoose");

let isConnected; // Track the connection status

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  console.log("Establishing new database connection");
  await mongoose.connect("mongodb+srv://yugeshkaran01:GEMBkFW5Ny5wi4ox@blog.adtwl.mongodb.net/Blog?retryWrites=true&w=majority&appName=blog", {
    maxPoolSize: 10, // Optional: set a pool size
    serverSelectionTimeoutMS: 5000 // Set a timeout for server selection
  });
  isConnected = mongoose.connection.readyState; // 1 for connected
};

module.exports = connectToDatabase;
