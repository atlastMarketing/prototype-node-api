const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// GET all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET a list of content by userId
router.get('/user/:userId', async (req, res) => {
    try {
      const content = await Content.find({ userId: req.params.userId });
      res.json(content);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// GET content by contentId
router.get('/:contentId', async (req, res) => {
try {
    const content = await Content.findById(req.params.contentId);
    res.json(content);
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

// POST new content
router.post('/', async (req, res) => {
  const content = new Content({
    userId: req.body.userId,
    contentId: req.body.contentId,
    image_url: req.body.image_url,
    caption: req.body.caption,
    postDate: req.body.postDate,
    isDraft: req.body.isDraft
  });

  try {
    const newContent = await content.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a content
router.delete('/:id', async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
