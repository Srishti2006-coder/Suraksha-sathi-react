const mongoose = require("mongoose");

// Password me @ ko %40 encode kiya
mongoose.connect("mongodb+srv://srishti:Srishti%40123@cluster0.jvbbxng.mongodb.net/test")
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.log("Error:", err);
});

module.exports = mongoose;