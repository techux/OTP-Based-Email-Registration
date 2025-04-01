const express = require('express');
const OTP = require("./model/otp.model");
const User = require("./model/user.model");
const { default: mongoose } = require('mongoose');

const port = process.env.port || 9090 ;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");

function generateOtp(n) {
    let otp = '';
    for (let i = 0; i < n; i++) {
        otp += Math.floor(Math.random() * 10); 
    }
    return otp;
}

function dbConnect() {
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log("Database Connected Successfully..."))
        .catch((err)=>console.log("Error in Database Connection...",err));
}

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/verifymail", async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).send({status:"error", message: "Email already exists"});
        }
        const otp = generateOtp(6) ;
        console.log(email +" "+ otp);
        try {
            await OTP.create({email, otp});
            return res.json({status:"ok", message: "OTP sent to your email"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:"error", message:"Unable to send the OTP, Please retyr again"})            
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({status:"error",message:"Error sending OTP"})
    }
})


app.post("/verifyotp", async (req, res)=> {
    try {
        const {email, otp} = req.body ;
        const result = await OTP.findOne({email, otp}) ;
        console.log(result);
        
        if(result) {
            return res.json({status:"ok", message:"OTP verified successfully"}) ;
        }
        return res.json({status:"error", message:"Invalid OTP"}) ;
    } catch (error) {
        console.log(error);
        return res.status(500).json({status:"error", message:"Unable to verify mail, please retry"})        
    }
})

app.post("/register", async (req, res) => {
    try {
        const {firstName, lastName, email, otp , password} = req.body ;
        if (!firstName || !lastName || !email || !otp || !password){
            return res.status(400).json({status:"error", message:"Please fill all the fields"});
        }
        const otpResult = await OTP.findOne({email, otp}) ;
        if(!otpResult) {
            return res.status(400).json({status:"error", message: "Email Unverified or Wrong OTP"});
        }
        const user = await User.create({firstName, lastName, email, password}) ;
        console.log(user);
        
        return res.json({status:"ok", message:"User created successfully"}) ;
    } catch (error) {
        console.log(error);
        return res.status(500).json({status:"error", message:"Unable to register user"});
    }
})

app.listen(port, "0.0.0.0", ()=>{
    dbConnect()
    console.log(`Server started on port : ${port}`);
})