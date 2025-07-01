import React from 'react'
import { Card } from './Card'

export const FormInput = ({setQuestionCount, handleChange, handleSubmit}) => {
  return (
    <Card>
      <form onSubmit={handleSubmit} className="mb-8 mx-4">
        <input
        type="file"
        name="pdfFile"
        required
        onChange={handleChange}
        className="text-white file:bg-blue-600 file:border-0 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-semibold file:cursor-pointer"
        />
        <input
        type="submit"
        value="Submit"
        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md cursor-pointer"
        />
        <p>Questions</p>
        <input type="radio" name='questionCount' onClick={()=>setQuestionCount(5)} value={5} required/>
        <label className='mr-4' htmlFor="">5</label>
        <input type="radio" name='questionCount' onClick={()=>setQuestionCount(10)} value={10}/>
        <label className='mr-4' htmlFor="">10</label>
        <input type="radio" name='questionCount' onClick={()=>setQuestionCount(20)} value={20}/>
        <label className='mr-4' htmlFor="">20</label>
      </form>
    </Card>
  )
}
