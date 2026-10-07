//This is a utility to scraper individual news material from the news links fetched 

const axios = require('axios')
const cheerio = require('cheerio')
// const {summarizer} = require('./summarizer');

  async function getNewsSummary(targetURL){

      try {

          const response = await axios.get(targetURL, {headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
          }})
          
          const {data} = response

          const $ = cheerio.load(data)

          //extracting title
          const fullTitle = $('h1.title').text().trim();
          // console.log(fullTitle)

          //using array since we can have multiple p tags
          const bodyContent = []
          $('article p').each((index, element) => {
              bodyContent.push($(element).text().trim());
          });
          //joining the p into a single string
          const content = bodyContent.join('\n\n');

          // console.log(content)

          // console.log("here")
          //returning the scraped data
          return {
              fullTitle,
              content
          };




          
      } catch (error) {

          console.error("Error fetching news summary:", error);
          return null;
          
      }

  }


// async function summarizeNews(newsUrl) {

//     // const newsUrl = 'https://aninews.in/news/tech/computers/meta-introduces-ai-system-that-can-translate-100-different-languages20230823102512/';
//     // const news = await getNewsSummary(newsUrl);
//     // console.log(news);

//     const getSummary = await summarize(news.content)
//     return getSummary


// }

// summarizeNews();

// console.log(filtered)
// // console.log("end of filtered data")
// filtered.forEach(async (element, index) => {
//     // console.log("loop running", index)


//     if (index == 5) {
//         const finalSummary = await getNewsSummary(element.link)
//         // console.log(finalSummary)
//         const getSummary = await summarizer(finalSummary)
//         console.log("final", getSummary)
//     }

         

// })

module.exports = {getNewsSummary}