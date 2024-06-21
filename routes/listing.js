const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,validateListing ,isOwner} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(listingController.index))//Index route : Display all listings
    .post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));//Create route : Add the new listing into DB
    
router.get("/new",isLoggedIn, listingController.renderNewForm);//New route : To add a new listing

router.route("/:id")
    .get( wrapAsync( listingController.showListing))//Show route : Display all data of a particular listing
    .put(isLoggedIn,isOwner,validateListing, wrapAsync( listingController.updateListing))//Update route
    .delete(isLoggedIn,isOwner, wrapAsync ( listingController.deleteListing));//Delete route

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm));

module.exports = router;