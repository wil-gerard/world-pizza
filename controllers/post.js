// Imports 
const User = require("../models/User");
const PizzaPost = require("../models/Post");
const cloudinary = require("../middleware/cloudinaryConfig");
const upload = require("../middleware/multer");

module.exports = {
    //async because we make requests to cloudinary and DB
    createPost: async (req, res) => {
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
            userName: req.user.userName,
          });
          console.log("New Pizza Posted");
          //redirect back to profile
          res.redirect("/profile");
        } catch (error) {
          console.error(error);
        }
      },
    renderPost: async (req, res) => {
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
      },
    deletePost: async (req, res) => {
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
      },
    likePost: async (req, res) => {
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
      },
    dislikePost: async (req, res) => {
        try {
          const id = req.params.id;
          const dislikedPost = await PizzaPost.findOneAndUpdate(
            { _id: `${id}` },
            {
              //increases post dislikes by +1🚮
              $inc: { dislikes: 1 },
            }
          );
          if (dislikedPost.dislikes > 10) {
            // await PizzaPost.findByIdAndDelete(id)
            // await cloudinary.uploader.destroy(post.cloudinary_id)
            await PizzaPost.findOneAndUpdate(
              { _id: `${id}` },
              { userName: 'BANNED' },
              console.log('YA BANNED')
            )
          }
          console.log('boooo! super awesome pizza post.....NOT. +1🚮');
          res.redirect(`/post/${id}`);
        } catch (err) {
          console.log(err);
        }
      },
    deleteUsersAndPosts: async (req, res) => {
      try {
        await PizzaPost.deleteMany({}, (err, result) => {
          if (err) {
            res.send(err)
          } else {
            res.send(result)
          }
        })
        await User.deleteMany({}, (err, result) => {
          if (err) {
            res.send(err)
          } else {
            res.send(result)
            console.log("🚮🚮🚮🚮ALL USERS AND POSTS DELETED🚮🚮🚮🚮")
          }
        })
        res.redirect('/feed')
      } catch (error) {
          console.error(error)
      }
    },  
}