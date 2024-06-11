const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//Listings models : 
//Index route : Display all listings
router.get("/", wrapAsync ( async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}));

//New route : To add a new listing
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show route : Display all data of a particular listing
router.get("/:id", wrapAsync( async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exist");    
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Create route : Add the new listing into DB
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created ! ");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", wrapAsync( async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update route
router.put("/:id",validateListing, wrapAsync( async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", wrapAsync ( async(req,res)=>{
    const {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted ");
    res.redirect("/listings");
}));

module.exports = router;