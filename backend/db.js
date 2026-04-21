const mongoose = require("mongoose");

// Password me @ ko %40 encode kiya
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/suraksha-sathi';

mongoose.connect(uri)
.then(() => {
    console.log(`MongoDB Connected to: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
});

module.exports = mongoose;