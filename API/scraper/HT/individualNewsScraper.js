const puppeteer = require('puppeteer');


// const browser = await puppeteer.launch()

async function individualNewsScraper(page, targetURL){
    console.log("item url to scrape ss", targetURL)
    try {
        await page.goto(targetURL, { waitUntil: 'networkidle2'});
        console.log("page loaded, now extracting data")
        const NewsArticleJSONLD = await page.evaluate(()=>{
            const scriptTags = document.querySelectorAll('script[type="application/ld+json"]')
            let newsArticleList = null
            
            scriptTags.forEach(script => {
                try {
                    const jsonData = JSON.parse(script.textContent)
                    if (jsonData['@type'] == 'NewsArticle'){ 
                        newsArticleList = jsonData
                    }
                    
                } catch (e) {
                    console.error('Error parsing JSON:', e)
                }
            });
            return newsArticleList


        })
    return NewsArticleJSONLD
    // const {headline, articleBody} = NewsArticleJSONLD
    // console.log("headline is", headline, "body is", articleBody)
        
    } catch (error) {
        console.log("error in individual scraping", error)
    }
    
    // const page = await browser.newPage()

    // try {
    //     await page.goto(targetURL, {waitUntil: 'networkidle2'})
    //     const newsArticleJSONLD = await page.evaluate(()=>{
    //         const scriptTags = document.querySelectorAll('script[type="application/ld+json"]')
    //         const newsJSON = null
    //         scriptTags.forEach(script => {
    //             try {
    //                 const jsonData = JSON.parse(script.textContent)
    //                 if (jsonData['@type'] === 'NewsArticle') {
    //                     newsJSON = jsonData
    //                 }
    //             } catch (error) {
    //                 console.log('Error parsing JSON', error)
    //             }

    //             return newsJSON
    //         }) 
    //     })

    //     console.log(newsArticleJSONLD)
    // } catch (error) {
    //     console.log("error here", error)
    // }


    // try {
    //   await page.goto(targetURL, {waitUntil: 'networkidle2'})
    //   const newsArticleJSONLD = await page.evaluate(()=>{
    //     const scriptTags = document.querySelectorAll('script[type="application/ld+json"]')
    //     const itemList = null
    //     scriptTags.forEach(script => {
    //       try {
    //         const jsonData = JSON.parse(script.textContent);
    //         if (jsonData['@type'] === 'NewsArticle') {
    //           itemList = jsonData;
    //         }
    //       } catch (e) {
    //         console.error('Error parsing JSON:', e);
    //       }
    //     })
    //     return itemList
    //   });

    //   await browser.close()

    //   if (newsArticleJSONLD){
    //     // console.log("fetched schema is", newsArticleJSONLD)
    //     return newsArticleJSONLD


    //   } else {
    //     throw new Error('No NewsArticle Schema found')
    //   }

      
      
    // } catch (error) {
    //   console.log('Error fetching JSON Schema', error)
    // }

  }

  


module.exports = {individualNewsScraper}