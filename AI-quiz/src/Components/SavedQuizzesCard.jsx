import React from 'react'

export const SavedQuizzesCard = ({setSavedIsClicked, savedIsClicked, savedPopup, setSavedPopup, setQuestions, setQuestionCount, setOptions, setCorrectAnswer}) => {
  return (
    <div onClick={()=>setSavedIsClicked({isClicked: false, parsedData : ""})} className={`absolute w-screen h-screen top-0 left-0 backdrop-blur-xs flex flex-col justify-center items-center transition duration-200 ${savedPopup ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} `}>

        <div className='relative w-md h-1/3' onClick={(e) => e.stopPropagation()}> 

          <h1>Saved Quizzes</h1>
          <button className='absolute right-0 -top-10' onClick={()=>setSavedPopup(false)}>Back</button>
          <div className='bg-blue-100/20 rounded-lg grid grid-cols-2 grid-rows-[repeat(4,minmax(42px,1fr))] overflow-y-auto gap-4 p-4 h-4/5'>
            {Object.entries(localStorage).map(([key, value])=>{
              const parsedData = JSON.parse(value);
              return <button onClick={()=>{
                setSavedIsClicked({isClicked: true,parsedData: parsedData,key: key});
              }}>{key}</button> 
            })}
            
            
          </div>

        </div>
        <div className='flex'>
          <button className={`mr-4 ${savedIsClicked.isClicked ? "pointer-events-auto text-white" : "pointer-events-none text-gray-500"} transition duration-200`} onClick={()=>{
            setQuestions(savedIsClicked.parsedData.questions);
            setQuestionCount(savedIsClicked.parsedData.questions.length)
            setOptions(savedIsClicked.parsedData.answerOpt);
            setCorrectAnswer(savedIsClicked.parsedData.correctAnswer);
            setSavedPopup(false);
          }}>Open</button>
          <button className={`${savedIsClicked.isClicked ? "pointer-events-auto text-white" : "pointer-events-none text-gray-500"}`} onClick={()=>{
            setSavedPopup(false);
            localStorage.removeItem(savedIsClicked.key);
          }}>Delete</button>
        </div>
        
    </div>
  )
}
