const express = require('express');

const contentManager = require('./content-manager');
const { SOCIAL_MEDIA_PLATFORMS } = require('../../constants/enum');
const { APIError } = require('../../_error');

require('dotenv').config();

const router = express.Router();

router.get('/:contentId', async (req, res) => {
    try {
        const { contentId } = req.params;
        const content = await contentManager.findContent(contentId);

        if (!content) {
            res.status(404).json({});
        } else {
            res.status(200).json(content);
        }
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const data = await contentManager.findContentByUserId(userId);
        console.log({ data });

        if (!data) {
            res.status(404).json([]);
            return;
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            user_id: userId,
            platform,
            image_url: imageUrl = null,
            caption = '',
            post_date: postDate = null,
            is_draft: isDraft = true,
        } = req.body;

        if (!userId) throw new APIError('User id was not given!', 400, 'Bad Request');
        if (!platform) throw new APIError('Platform was not given!', 400, 'Bad Request');
        if (!Object.values(SOCIAL_MEDIA_PLATFORMS).includes(platform)) throw new APIError('Platform is not recognized!', 400, 'Bad Request');

        const contentData = {
            user_id: userId,
            platform,
            image_url: imageUrl,
            caption,
            post_date: postDate,
            is_draft: isDraft,
        };

        const id = await contentManager.saveContent(contentData);

        res.status(201).json({ _id: id });
    } catch (err) {
        console.log(err);
        res.status(err.status || 400).json(err);
    }
});

router.put('/:contentId', async (req, res) => {
    try {
        const {
            platform = null,
            image_url: imageUrl = null,
            caption = null,
            post_date: postDate = null,
            is_draft: isDraft = null,
        } = req.body;

        const { contentId } = req.params;

        const contentData = {};

        if (platform) contentData.platform = platform;
        if (imageUrl) contentData.image_url = imageUrl;
        if (caption) contentData.caption = imageUrl;
        if (postDate) contentData.post_date = postDate;
        if (isDraft) contentData.is_draft = isDraft;

        await contentManager.updateContent(contentId, contentData);

        res.status(204).json({});
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
});

router.delete('/:contentId', async (req, res) => {
    try {
        const { contentId } = req.params;

        await contentManager.deleteContent(contentId);

        res.status(204).json({});
    } catch (err) {
        console.log({ err });
        res.status(err.status || 400).json(err);
    }
});

module.exports = router;
