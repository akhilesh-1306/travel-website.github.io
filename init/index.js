const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("connection success");  
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/traveltide');
}

const initDB = async () =>{ 
    await Listing.deleteMany({});
    initData.data = initData.data = initData.data.map((obj)=>({...obj ,owner : "666947125d99e2ffb7200ae1"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();