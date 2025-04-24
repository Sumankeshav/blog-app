const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new Error("File formet is not correct"), false);
  }
};

module.exports = multer({ storage, fileFilter });
