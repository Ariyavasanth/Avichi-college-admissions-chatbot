const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const listCollections = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));
    
    // Check 'admins' collection count
    const adminCount = await conn.connection.db.collection("admins").countDocuments();
    console.log("'admins' count:", adminCount);
    
    // Check if there is an admin with ANY email
    const allAdmins = await conn.connection.db.collection("admins").find({}).toArray();
    console.log("All Admins emails:", allAdmins.map(a => a.email));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
listCollections();
