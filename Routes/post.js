const express = require('express')
// good video on router and MVC (thanks Wolfie!) https://www.youtube.com/watch?v=zW_tZR0Ir3Q&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=12&ab_channel=TheNetNinja
const router = express.Router()
// This is where we will be requiring the User and ensureAuth, so I don't believe we'll need it in the server anymore? (VKB)
/* ------------ */
//All imports below this line will be moved to controllers eventually
const User = require('../models/User')
const PizzaPost = require('../models/Post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
//Import cloudinary
const cloudinary = require('../middleware/cloudinaryConfig')
//import multer
const upload = require('../middleware/multer')



//the middleware in this handler is multer grabbing the file data
//
//not 100% sure how it works - would be cool to research
//async because we make requests to cloudinary and DB
router.post('/create-post', upload.single("file"), async (req, res) => {
    try {
        //now we can access the file and send to cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path)
        //and create the new post
        await PizzaPost.create({
            title: req.body.title,
            //this is what we'll use to display our images
            image: cloudinaryResponse.secure_url,
            caption: req.body.caption,
            cloudinary_id: cloudinaryResponse.public_id,
            likes: 0,
            user: req.user.id,
        })
        console.log('New Pizza Posted')
        //redirect back to profile
        res.redirect('/profile')
    } catch (error) {
        console.error(error)
    }
})

module.exports = router;