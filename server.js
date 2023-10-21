const express = require('express');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');



mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.find();
        res.render('index', { shortUrl: shortUrl });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/shortUrl', async (req, res) => {
    try {
        await ShortUrl.create({ full: req.body.fullUrl });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl }); // Remove the curly braces around req.params.shortUrl
    if (shortUrl == null)
        return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
});
