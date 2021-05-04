const cities = require("./cities")
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const {places, descriptors} = require("./seedHelpers");
//const dbUrl = process.env.DB_URL;
const dbUrl = require("../index")
//use for mongo server ^ instead of local
//https://thawing-brushlands-46562.herokuapp.com/
//mongodb://localhost:27017/yelp-camp
//works with local ^  does not work with the cloud database (needs a string?) export problem?
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++){
    const random1000 =  Math.floor(Math.random() * 1000)   
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
        author: "603925864c189e1284f0655f",
        //your user id
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        description: "A Quiet and peaceful camping spot",
        price,
        geometry:{
            type:"Point",
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
            ]
        },
        images:  [
            {
              url: 'https://res.cloudinary.com/mikescloudacc/image/upload/v1613492266/Yelp%20camp/r6t9pmst5zxz1byggmto.jpg',
              filename: 'Yelp camp/r6t9pmst5zxz1byggmto'
            }
          ]
    })
    await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

