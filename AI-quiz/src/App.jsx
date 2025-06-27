import { useState } from 'react'
import './App.css'
import { TrophySpin } from "react-loading-indicators"

function App() {

  const[prompt,setPrompt] = useState("");
  const[pdfFile,setPdfFile] = useState(null);
  const[questions,setQuestions] = useState([]);
  const[options,setOptions] = useState([]);
  const[correctAnswer,setCorrectAnswer] = useState([]);
  const[loading,setLoading] = useState(false);

  const[currentQuestion,setCurrentQuestion] = useState(0);

  const[fade,setFade] = useState(true);
  const[popCheck,setPopCheck] = useState(false);
  const[popScale,setPopScale] = useState(false);
  const[popup,setPopup] = useState(false);
  const[savedPopup,setSavedPopup] = useState(false);

  const[checkCount,setCheckCount] = useState(0);

  const[quizName,setQuizName] = useState("");
  const[isTaken,setIsTaken] = useState(false);
  const[jsonObject,setJsonObject] = useState(null);

  const popupAnimation = () => {
    setPopScale(true);
    setPopCheck(true);
    setTimeout(()=>{
      setPopScale(false)
    },50);
  }

  const handleChange = (e) => {
    setPdfFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append('pdfFile',pdfFile);
    try{
      const res = await fetch('http://localhost:3000/prompt',{
        method: 'POST',
        encType: 'multipart/form-data',
        body: formData
      })

      const data = await res.json();
      setJsonObject(data);
      setQuestions(data.questions);
      setOptions(data.answerOpt);
      setCorrectAnswer(data.correctAnswer);
      setLoading(false);
      console.log(data);

    } catch (err){
      console.error(err);
    }
  }

  const handleSaveQuiz = () => {
    if(localStorage.getItem(quizName)){
      alert("Name is Taken. Please Choose Another.")
    }else{
      // localStorage.setItem(quizName,JSON.stringify(jsonObject));
      setPopup(false);
    }
    
  }

  const handleCorrectAnswer = (currentQuestion,oindex,e) => {

    const isCorrect = correctAnswer[currentQuestion] === oindex;
    e.target.classList.remove('hover:bg-blue-600');

    e.target.classList.add(isCorrect ? 'bg-green-500' : 'bg-red-500');
    {isCorrect ? setCheckCount(prev=>prev+1) : ""}
    
    popupAnimation();

    setTimeout(()=>{setFade(false);setPopCheck(false)},800)
    setTimeout(()=>{
      setCurrentQuestion(prev => prev + 1);
      e.target.classList.remove('bg-green-500')
      e.target.classList.remove('bg-red-500')
      e.target.classList.add('hover:bg-blue-600');
      setTimeout(()=>setFade(true),200)
    },1000);
    
    
  }

  if(loading){
    return(
      <>
        <TrophySpin color="#316dcc" size="medium" text="loading" textColor="" />
      </>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8 space-x-4">
      <input
        type="file"
        name="pdfFile"
        onChange={handleChange}
        className="text-white file:bg-blue-600 file:border-0 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-semibold file:cursor-pointer"
      />
      <input
        type="submit"
        value="Submit"
        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md cursor-pointer"
      />
    </form>
      {questions.length !== 0 && currentQuestion < questions.length && (
      <div
        className={`w-full max-w-xl p-6 rounded-lg border border-white shadow-lg transition-opacity duration-300 ease-in-out ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">
          {questions[currentQuestion]}
        </h3>
        <div className="space-y-2">
          {options[currentQuestion].map((o, oindex) => (
            <p
              key={oindex}
              className="cursor-pointer bg-gray-800 hover:bg-blue-600 transition-colors duration-200 px-4 py-2 rounded-md text-center"
              onClick={(e) =>
                handleCorrectAnswer(currentQuestion, oindex, e)
              }
            >
              {o}
            </p>
          ))}
        </div>
      </div>
    )}
    <h1 className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-shadow-md bg-gray-800 border border-white p-8 rounded-md pointer-events-none transition duration-150 ${popCheck ? 'opacity-100' : 'opacity-0'} ${popScale ? 'scale-125' : 'scale-100'}`}>{checkCount}/5</h1>
      {currentQuestion === questions.length && questions.length !== 0 && (<>
      <div className={`border border-white mb-4 p-6 transition duration-200 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'} `}>
        <h1>{checkCount}/5</h1>
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
      </>)}
      <button className='m-4' onClick={()=>setSavedPopup(true)}>Saved Quizzes</button>
      {questions.length !== 0 && (<button className='' onClick={()=>{
        setCurrentQuestion(0);
        setCheckCount(0);
        setQuestions([]);
        setOptions([]);
        setCorrectAnswer([]);
      }}>Back</button>)}
      {savedPopup && (
        <>
          <div className='absolute w-screen h-screen top-0 left-0 backdrop-blur-xs flex flex-col justify-center items-center'>

            <div className='relative w-md h-1/3'> 

              <h1>Saved Quizzes</h1>
              <button className='absolute right-0 -top-10' onClick={()=>setSavedPopup(false)}>Back</button>
              <div className='bg-blue-100/20 rounded-lg grid grid-cols-2 grid-rows-[repeat(4,minmax(42px,1fr))] overflow-y-auto gap-4 p-4 h-48'>
                {Object.entries(localStorage).map(([key, value])=>{
                  const parsedData = JSON.parse(value);
                  return <button onClick={()=>{
                    setQuestions(parsedData.questions);
                    setOptions(parsedData.answerOpt);
                    setCorrectAnswer(parsedData.correctAnswer);
                    setSavedPopup(false);
                  }}>{key}</button> 
                })}
                
                
              </div>

            </div>
            
            
          </div>
        </>
      )}
      
    </>
  )
}

export default App
