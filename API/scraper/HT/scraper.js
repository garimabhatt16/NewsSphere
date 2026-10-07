const puppeteer = require('puppeteer');
const NewsList = require('../../models/newsList.js')
const mongoose = require('mongoose');
const { individualNewsScraper } = require('./individualNewsScraper.js');
const { summarizer } =require('../../AIHelper/summarizer.js'); 
const { titleCurator } = require('../../AIHelper/titleCurator.js');


//temp for mongoose to test scraper//
require('dotenv').config()
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((err) => {
    console.log(err, 'something went wrong connecting MONGOOSE');
  });





async function fetchItemListJSONLD(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the URL and wait for the network to be idle
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the JSON-LD script content
    const itemListJSONLD = await page.evaluate(() => {
      const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
      console.log(`Found ${scriptTags.length} script tags`); // this was not getting printed because it's printing in the puppeteer headless browser LOL
      let itemList = null;

      scriptTags.forEach(script => {
        try {
          const jsonData = JSON.parse(script.textContent);
          if (jsonData['@type'] === 'ItemList') {
            itemList = jsonData;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      });

      return itemList;
    });

    await browser.close();

     // Debugging output

    if (itemListJSONLD) {
        // console.log(itemListJSONLD)
      return itemListJSONLD;
    } else {
      throw new Error('No ItemList JSON-LD found');
    }
  } catch (error) {
    console.error('Error fetching ItemList JSON-LD:', error);
    await browser.close();
  }
}

// URL of the page to scrape
const url = 'https://www.hindustantimes.com/india-news';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delayBetweenRequests = 10000; // Delay in milliseconds (adjust as needed)


fetchItemListJSONLD(url).then(async itemListJSONLD => {
  if (itemListJSONLD && itemListJSONLD.itemListElement) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    for (const item of itemListJSONLD.itemListElement){
        
        try {
          await delay(delayBetweenRequests)


          const individualNewsContent = await individualNewsScraper(page, item.url) 
          console.log("here is what is scraped", individualNewsContent.headline)
          const summarizedContent = await summarizer(individualNewsContent.articleBody)
          const craftedTitle = await titleCurator(individualNewsContent.headline, individualNewsContent.articleBody)

          const listToSave = new NewsList({
            title: individualNewsContent.headline,
            fullTitle: craftedTitle,
            fetchedContent: individualNewsContent.articleBody,
            summarizedContent: summarizedContent,
            image: individualNewsContent.image,
            link: item.url,
            updatedTime: individualNewsContent.dateModified,
            author: "Hindustan Times",
            scrapedFrom: "Hindustan Times" 

        })
        const savedItem = await listToSave.save()
        console.log(savedItem)
          
        } catch (error) {
          console.log(error)
          
        }
    };
    await browser.close();

    }
    else {
      console.log('No data received.'); // Debugging output
    }
  } 
);


