const express = require('express');
const Video = require('../models/Video');
const router = express.Router();
const fs=require('fs');
const path = require('path');


router.get('/uploads/:uploadedBy/:filteID', async (req, res) => {
   
    const { uploadedBy, filteID } = req.params;
    const filePath = path.join(__dirname, '..', 'routes/uploads', uploadedBy, filteID); // Adjust the path accordingly
  
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return res.status(404).send('File not found');
      }
  
      const { size } = stats;
  
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': size
      });
  
      const videoStream = fs.createReadStream(filePath);
      videoStream.pipe(res);
    });
  });
  

router.get('/', async (req, res) => {
  try {
    
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
