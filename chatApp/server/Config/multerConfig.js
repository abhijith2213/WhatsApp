const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/images");
  },
  filename(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            const error = new Error("Only support jpg, jpeg, png, webp file Types");
            return callback(error)
          } else {
            return callback(
              null,
              `${file.fieldname}_${Date.now()}_${file.originalname}`
            );
          }
  },
});

const upload = multer({storage: storage});
module.exports = upload;
