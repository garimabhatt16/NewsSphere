require('dns').setServers(['8.8.8.8', '1.1.1.1'])
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const NewsList = require('./models/newsList.js'
)
const {scrapeNewsList} = require('./scraper/ANI/fetchNewsList.js')
const cors = require('cors')

const app = express()
app.use(cors({origin: 'http://localhost:5173'}))


app.listen(4000, ()=>{

    console.log("App listening at PORT 4000")

})


async function startServer() {
  try {
    if (!process.env.MONGO) {
      throw new Error('MONGO variable missing. Check API/.env');
    }

    await mongoose.connect(process.env.MONGO);
    console.log('MongoDB connected successfully');

    const urlToScrape = [
      'https://aninews.in/topic/detail/breaking-topics/'
    ];

    console.log('Starting news scraper...');
    await scrapeNewsList(urlToScrape[0]);
  } catch (err) {
    console.error('MongoDB or scraper startup error:', err);
  }
}

startServer();


app.get('/breaking', async (req, res) => {
    try {
        const getNews = await NewsList.find();
        
        // Map the documents to only include the required fields
        const filteredNews = getNews.map(news => ({
            title: news.fullTitle,
            newsContent: news.summarizedContent,
            image: news.image,
            link: news.link,
            updatedTime: news.updatedTime,
            scrapedFrom: news.scrapedFrom
        }));
        
        res.json(filteredNews);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the news.' });
    }
});


