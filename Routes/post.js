const express = require("express");
// good video on router and MVC (thanks Wolfie!) https://www.youtube.com/watch?v=zW_tZR0Ir3Q&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=12&ab_channel=TheNetNinja
const router = express.Router();
// This is where we will be requiring the User and ensureAuth, so I don't believe we'll need it in the server anymore? (VKB)
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//import multer
//the middleware in this handler is multer grabbing the file data
//not 100% sure how it works - would be cool to research
const upload = require("../middleware/multer");
// still need the upload here
const postsControllers = require('../controllers/post')
/* ------------ */


router.post("/create-post", upload.single("file"), postsControllers.createPost);

router.get("/:id", ensureAuth, postsControllers.renderPost);

router.delete("/deletePost/:id", postsControllers.deletePost);

router.put("/likePost/:id", postsControllers.likePost);

router.put("/dislikePost/:id", postsControllers.dislikePost);

module.exports = router;