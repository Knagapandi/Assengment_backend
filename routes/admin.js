const express = require('express');
const path = require('path');
const Video = require('../models/Video');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uploadedBy } = req.body;
    const uploadPath = path.join(__dirname, 'uploads', uploadedBy);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'filePath', maxCount: 1 }
]);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/upload-video', upload, async (req, res) => {
  const { title, description, category, uploadedBy } = req.body;
  const filePath = req.files['filePath'][0].filename;

  try {
    const newVideo = new Video({
      title,
      description,
      category,
      filePath,
      uploadedBy,
    });

    const video = await newVideo.save();
    res.json(video);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Serve static files from the uploads directory


module.exports = router;
