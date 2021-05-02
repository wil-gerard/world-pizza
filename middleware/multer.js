const multer = require('multer')
const path = require('path')
/*
Using this as reference
https://dev.to/itsmefarhan/cloudinary-files-images-crud-operations-with-nodejs-express-multer-2147
Basic config for multer - we are using the path module to get the extension name of files so people 
can't upload things that aren't images (basically?)
*/
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
            cb(new Error("File type is not supported :("), false)
            return;
        }
        cb(null, true)
    },
});