const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

// Stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Middleware combiné : multer + sharp
module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return next(new Error("Invalid file type."));
    if (!req.file) return next();

    const originalName = req.file.originalname
      .split(" ")
      .join("_")
      .split(".")[0];
    const filename = `compressed_${originalName}_${Date.now()}.webp`;
    const filepath = path.join("images", filename);

    sharp(req.file.buffer)
      .resize(206, 260)
      .webp({ quality: 80 })
      .toFile(filepath)
      .then(() => {
        req.file.imageUrl = `${req.protocol}://${req.get(
          "host"
        )}/images/${filename}`;
        next();
      })
      .catch(next);
  });
};
