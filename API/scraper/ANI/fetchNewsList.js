const { default: axios } = require('axios');
const cheerio = require('cheerio');
const NewsList = require('../../models/newsList.js')
const {getNewsSummary} = require('./scrapeNews.js')
const { summarizer } = require('../../AIHelper/summarizer.js')
const {titleCurator} = require('../../AIHelper/titleCurator.js')

// Configuration and constants
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

// Main function to scrape news list
async function scrapeNewsList(url) {
    try {
        const data = await fetchData(url);
        const scrapedList = parseHTML(data, url);
        console.log('Articles found on page:', scrapedList.length)
        const filteredList = filterScrapedData(scrapedList);

        await saveScrapedData(filteredList);
    } catch (error) {
        console.error('Error during scraping:', error.message);
    }
}

// Function to fetch data from the URL
async function fetchData(url) {
    const response = await axios.get(url, {
        headers: { 'User-Agent': USER_AGENT },
    });
    return response.data;
}

// Function to parse HTML using Cheerio
function parseHTML(data, url) {
    const $ = cheerio.load(data);
    const scrapedList = [];

    $('.card').each((index, element) => {
        const titleElement = $(element).find('.title');
        const title = titleElement.text().trim();
        const link = `https://aninews.in${titleElement.parent().attr('href')}`;
        const image = $(element).find('.img-container img').attr('data-src');
        const updatedTime = new Date().toISOString();

        scrapedList.push({
            title,
            image,
            link,
            updatedTime,
            author: url,
            scrapedFrom: url
        });
    });

    return scrapedList;
}

// Function to filter irrelevant data
function filterScrapedData(scrapedList) {
    return scrapedList.filter(element => element.title && element.title !== 'Breaking News');
}

// Function to save scraped data to the database
async function saveScrapedData(filteredList) {

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const delayBetweenRequests = 2000; // Delay in milliseconds (adjust as needed)


    for (const element of filteredList) {
    try {
        const fetchedContent = await getNewsSummary(element.link)
        if (!fetchedContent) { console.log('Skipping, could not fetch:', element.link); continue }
        console.log('Fetched:', fetchedContent.fullTitle)   // prints BEFORE the AI step

        let getSummary = ''
        try { getSummary = await summarizer(fetchedContent.content) }
        catch (e) { console.log('AI summary failed:', e.message) }

        const listToSave = new NewsList({
            title: element.title,
            fullTitle: fetchedContent.fullTitle,
            fetchedContent: fetchedContent.content,
            summarizedContent: getSummary,
            image: element.image,
            link: element.link,
            updatedTime: element.updatedTime,
            author: element.author,
            scrapedFrom: element.scrapedFrom
        })
        await listToSave.save()
        console.log('Saved:', element.title)
    } catch (error) {
        console.error('Error on', element.link, error.message)
    }
    await delay(delayBetweenRequests)
}
    // for (const element of filteredList) {

    //     //looping through the list of news we got and then scraping individual news content for each link - need to add validation in future to not fetch data for urls if present already in the database
    //     const fetchedContent = await getNewsSummary(element.link)
    //     // console.log("Fetched content for", element.link, fetchedContent)
    //     //now for each news content fetched, using AI tool to summarize and format content
    //     const getSummary = await summarizer(fetchedContent.content)
    //     console.log("Fetched content for", element.link, fetchedContent, getSummary)
    //     const getTitle = await titleCurator(fetchedContent.fullTitle, fetchedContent.content )

    //     //now need to mention what we need to store to the db 
    //     const listToSave = new NewsList({
    //         title:element.title,
    //         fullTitle: fetchedContent.fullTitle,
    //         fetchedContent: fetchedContent.content,
    //         summarizedContent: getSummary,
    //         image: element.image,
    //         link: element.link,
    //         updatedTime: element.updatedTime,
    //         author: element.author,
    //         scrapedFrom: element.scrapedFrom
    //     });

    //     try {
    //         const savedList = await listToSave.save();
    //         console.log('Saved list:', savedList);
    //     } catch (error) {
    //         console.error('Error saving list:', error.message);
    //     }

    //     await delay(delayBetweenRequests);

    // }
}

module.exports = { scrapeNewsList };
