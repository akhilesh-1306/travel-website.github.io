const mongoose = require("mongoose");
const Review = require("./review.js");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : { 
        type : String
    },
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-…",
        set : (v) => 
            v === "" 
                ? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-…" 
                : v
    },
    price : { 
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;