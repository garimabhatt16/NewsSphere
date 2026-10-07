import React, { useEffect, useState } from 'react'
import NewsCard from '../components/NewsCard'




function Index() {

    const [news, setNews] = useState([])
    useEffect(()=>{
        fetch('http://localhost:4000/breaking')
        .then(response => response.json())
        .then(data => setNews(data))
        .catch(err => console.log("something went wrong fetching data"))
    }, [])



  return (
    <div>
      <div className='w-screen text-center shadow-lg sticky top-0 bg-lime-50'>
        <h1 className='text-4xl px-4 py-6 mb-20 drop-shadow-2xl'>NewsSphere - Your AI Journalist</h1>
      </div>
    <div className='wrapper flex gap-4 flex-col'>
      
        {
        news.map((element, index)=> {
            return <NewsCard key={index} title={element.title} description={element.newsContent} image={element.image} link={element.link} publishTime={element.updatedTime}/>
        })    
        }
        </div>
    </div>
  )
}

export default Index