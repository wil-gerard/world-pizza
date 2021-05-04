const express = require("express");
// good video on router and MVC (thanks Wolfie!) https://www.youtube.com/watch?v=zW_tZR0Ir3Q&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=12&ab_channel=TheNetNinja
const router = express.Router();
// This is where we will be requiring the User and ensureAuth, so I don't believe we'll need it in the server anymore? (VKB)
/* ------------ */
//All imports below this line will be moved to controllers eventually
const User = require("../models/User");
const PizzaPost = require("../models/Post");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
//Import cloudinary
const cloudinary = require("../middleware/cloudinaryConfig");
//import multer
const upload = require("../middleware/multer");

//the middleware in this handler is multer grabbing the file data
//
//not 100% sure how it works - would be cool to research
//async because we make requests to cloudinary and DB
router.post("/create-post", upload.single("file"), async (req, res) => {
  try {
    //now we can access the file and send to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    //and create the new post
    await PizzaPost.create({
      title: req.body.title,
      //this is what we'll use to display our images
      image: cloudinaryResponse.secure_url,
      caption: req.body.caption,
      cloudinary_id: cloudinaryResponse.public_id,
      likes: 0,
      dislikes: 0,
      user: req.user.id,
    });
    console.log("New Pizza Posted");
    //redirect back to profile
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const post = await PizzaPost.findById(req.params.id);
    res.render("post.ejs", {
      post: post,
      user: req.user,
      feed: false,
      title: post.title,
      style: "post",
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/deletePost/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let post = await PizzaPost.findById(id);
    //destroy cloudinary image
    await cloudinary.uploader.destroy(post.cloudinary_id);
    //destroy DB Doc
    await PizzaPost.findByIdAndDelete(id)
    console.log("Deleted Post " + post.title)
    res.redirect('/profile')
  } catch (error) {
      console.error(error)
  }
});

router.put("/likePost/:id", async (req, res) => {
  try {
    await PizzaPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        //increases post likes by +1🍕
        $inc: { likes: 1 },
      }
    );
    console.log('wowwww!!! super awesome pizza post. +1🍕');
    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

router.put("/dislikePost/:id", async (req, res) => {
  try {
    await PizzaPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        //increases post dislikes by +1🚮
        $inc: { dislikes: 1 },
      }
    );
    console.log('boooo! super awesome pizza post.....NOT. +1🚮');
    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;