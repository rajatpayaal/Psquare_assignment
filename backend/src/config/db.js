// Mongoose library ko import karte hain MongoDB ke saath kaam karne ke liye
const mongoose = require('mongoose');

// Ek asynchronous function banate hain jo MongoDB database se connect karega
const connectDB = async () => {
  try {
    // MongoDB database se connect karne ki koshish karte hain, connection string environment variables se lete hain
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Naya URL parser use karte hain taaki deprecation warnings na aaye
      useUnifiedTopology: true, // Naya server discovery aur monitoring engine use karte hain
    });
    // Agar connection successful ho jaye, toh success message ke saath database host ko log karte hain
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Agar connection fail ho jaye, toh error message log karte hain
    console.error(`Error: ${error.message}`);
    // Process ko failure code (1) ke saath exit karte hain taaki error indicate ho
    process.exit(1);
  }
};

// connectDB function ko export karte hain taaki isse application ke doosre parts mein use kiya ja sake
module.exports = connectDB;