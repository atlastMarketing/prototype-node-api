const Content = require('./content-model');
const { handleMongoError } = require('../../_error');

async function saveContent(data) {
    const content = new Content(data);
    const { _id: id } = await content.save();
    return id;
}

async function findContent(id) {
    try {
        return Content.findOne({ _id: id });
    } catch (err) {
        return handleMongoError(err);
    }
}

async function findContentByUserId(userId) {
    try {
        return Content.find({ user_id: userId });
    } catch (err) {
        return handleMongoError(err);
    }
}

async function updateContent(id, data) {
    try {
        const filter = { _id: id };
        await Content.findOneAndUpdate(filter, data);
        return true;
    } catch (err) {
        return handleMongoError(err);
    }
}

async function deleteContent(id) {
    try {
        await Content.deleteOne({ _id: id });
        return true;
    } catch (err) {
        return handleMongoError(err);
    }
}

module.exports = {
    saveContent,
    findContent,
    findContentByUserId,
    updateContent,
    deleteContent,
};
