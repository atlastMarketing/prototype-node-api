const express = require('express');
const mongoose = require('mongoose');
const contentRouter = require('./routes/content');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/contentManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/content', contentRouter);

app.listen(3000, () => console.log('Server started'));
