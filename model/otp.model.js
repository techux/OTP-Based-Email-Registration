const mongoose = require('mongoose');
const sendEmail = require("../utils/sendmail");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now,
        expires: 60 * 5 // 5 minutes || Delete the entry automatically after 5 minutes 
    }
})

otpSchema.pre('save', async function(next) {
    try {
        console.log("Attempting to send OTP email for email:", this.email);
        const result = await sendEmail(this.email, this.otp);
        console.log("Email sent successfully:", result);
        next(); 
    } catch (error) {
        console.error("Error sending email:", error);
        next(error);
    }
});

module.exports = mongoose.model("otp", otpSchema) ;