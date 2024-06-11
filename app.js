const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const { secureHeapUsed } = require("crypto");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main()
.then((res)=>{
    console.log("connection success");  
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/traveltide');
}

const sessionOptions = {
    secret : "mysecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.get("/",(req,res)=>{
    res.send("I am root");
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//Listings
app.use("/listings",listings);

//Reviews
app.use("/listings/:id/reviews",reviews)


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message})
});

app.listen(8080 , ()=>{
    console.log("listening on port 8080");
});