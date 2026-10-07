import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const NewsCard = ({ title, description, image, link, publishTime }) => {
  return (
    <div className='w-full flex flex-col md:flex-row gap-5 shadow-lg hover:shadow-2xl px-5 py-5 text-left'>
      <img
        src={image}
        alt={title}
        className='w-full md:w-72 h-48 object-cover flex-shrink-0'
      />
      <div className='flex flex-col gap-2 justify-between flex-1'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-xl'>{title}</h2>
          <div className='flex gap-1 text-sm'>
            <span>News curated by</span>
            <span className='font-semibold'>Garima Bhatt</span>
            <span>/</span>
            <span>{format(new Date(publishTime), 'MMM d, yyyy')}</span>
          </div>
          <article className='text-justify text-sm'>{description}</article>
        </div>
        <Link to={link} target='_blank' className='text-blue-600'>
          Read more here
        </Link>
      </div>
    </div>
  )
}

export default NewsCard