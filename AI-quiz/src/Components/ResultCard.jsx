import React from 'react'

export const ResultCard = ({setCurrentQuestion, setCheckCount, checkCount, questionCount, popup, setPopup, setQuizName, handleSaveQuiz, fade}) => {
  return (
    <>
      <div className={`border border-white mb-4 p-6 transition duration-200 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'} `}>
        <h1>{checkCount}/{questionCount}</h1>
      </div>
      <button onClick={()=>{
        setCurrentQuestion(0);
        setCheckCount(0);
        }}>Retry</button>
      <button className='ml-4' onClick={()=>setPopup(true)}>Save</button>
      <div className={`absolute w-screen h-screen top-0 left-0 flex backdrop-blur-xs justify-center items-center transition duration-200 ${popup ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className='relative w-md h-1/3 flex justify-center items-center bg-blue-100/20 rounded-lg'>
          <button className='absolute top-0 right-0 m-4' onClick={()=>setPopup(false)}>Back</button>
          <input type="text" onChange={(e)=>setQuizName(e.target.value)} className='bg-white text-black m-4 h-8 rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150' placeholder='Name of Quiz'/>
          <input type="submit" className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md cursor-pointer" value="Confirm" onClick={handleSaveQuiz} />
        </div>
      </div>
    </>
  )
}
