/* basic cloudinary config
you can create a free account with plenty of free storage
https://cloudinary.com/documentation/node_integration#overview
 */
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


module.exports = cloudinary;