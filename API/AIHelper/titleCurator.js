require('dotenv').config()
// console.log(process.env.API)

function titleCurator(title, content){

return new Promise((resolve, reject)=> {

    
// console.log("hi I am here", content)

fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.API}`,
    // "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    // "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "nousresearch/nous-capybara-7b:free",
    "messages": [
      {"role": "user", "content": `Provide a relevant and engaging title for this content: {title: ${title}, content: ${content}}`},
    ],
  })
})
.then(response => response.json())
.then((data) => 
    {
        // console.log("returning this data back", data)
        // resolve(data.choices[0].message.content)
        if (!data.choices) { return reject(new Error(JSON.stringify(data))) }
resolve(data.choices[0].message.content)
    }
)
.catch((err)=>{
    console.log(err)
    reject(err)
})


})



// return response

}


module.exports = {titleCurator}

