const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    //adding the cloudinary id to the post model
    cloudinary_id: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})

module.exports = mongoose.model('Post', PostSchema)