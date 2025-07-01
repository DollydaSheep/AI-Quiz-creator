import React from 'react'

export const Card = ({children, }) => {
  return (
    <div className='p-2 border border-white rounded-lg'>
      {children}
    </div>
  )
}
