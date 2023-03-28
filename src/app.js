const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const scheduler = require('./api/contentManager/scheduler'); 

require('dotenv').config();

const dbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@atlastcluster.fftquql.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(dbURI)
    .then((result) => console.log("Connected to Atlast database!"))
    .catch((err) => console.log(err));

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'healthy',
    });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

scheduler.initScheduler(mongoose.connection);  

module.exports = app;
