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
    const delayBetweenRequests = 2000;

    for (const element of filteredList) {
        try {
            // ✅ PEHLE duplicate check karo
            const existing = await NewsList.findOne({ link: element.link })
            if (existing) {
                console.log('Skipping duplicate:', element.title)
                continue
            }

            // ✅ Tabhi content fetch karo
            const fetchedContent = await getNewsSummary(element.link)
            if (!fetchedContent) { console.log('Skipping, could not fetch:', element.link); continue }
            console.log('Fetched:', fetchedContent.fullTitle)

            // ✅ Tabhi AI call karo
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
}

module.exports = { scrapeNewsList };
