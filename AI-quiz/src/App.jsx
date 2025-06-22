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
      setQuestions(data.questions);
      setOptions(data.answerOpt);
      setCorrectAnswer(data.correctAnswer);
      setLoading(false);
      console.log(data);

    } catch (err){
      console.error(err);
    }
  }

  const handleCorrectAnswer = (currentQuestion,oindex,e) => {

    const isCorrect = correctAnswer[currentQuestion] === oindex;
    e.target.classList.remove('hover:bg-blue-600');

    e.target.classList.add(isCorrect ? 'bg-green-500' : 'bg-red-500');

    
    setTimeout(()=>setFade(false),800)
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
      {currentQuestion === questions.length && questions.length !== 0 && (<><button onClick={()=>setCurrentQuestion(0)}>Retry</button></>)}
    </>
  )
}

export default App
