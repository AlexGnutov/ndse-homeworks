const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(req.body);
    cb(null, './books')
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`)
  }
});

const allowedTypes = ['application/pdf', 'text/plain', 'application/msword'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

module.exports = multer({
  storage, fileFilter
});
