import { useState } from 'react'
import './App.css'
import { TrophySpin } from "react-loading-indicators"
import { FormInput } from './Components/FormInput';
import { QuestionCard } from './Components/QuestionCard';
import { ResultCard } from './Components/ResultCard';
import { SavedQuizzesCard } from './Components/SavedQuizzesCard';

function App() {

  const[prompt,setPrompt] = useState("");
  const[questionCount,setQuestionCount] = useState(null);
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

  const[savedIsClicked,setSavedIsClicked] = useState([]);

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
      const res = await fetch(`http://localhost:3000/prompt?questionCount=${questionCount}`,{
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
      localStorage.setItem(quizName,JSON.stringify(jsonObject));
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
      {questions.length == 0 && (
        <FormInput setQuestionCount={setQuestionCount} handleChange={handleChange} handleSubmit={handleSubmit}/>
      )}
      {questions.length !== 0 && currentQuestion < questions.length && (
        <QuestionCard currentQuestion={currentQuestion} 
                      handleCorrectAnswer={handleCorrectAnswer} 
                      fade={fade} 
                      questions={questions} 
                      options={options} />
    )}
    <h1 className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-shadow-md bg-gray-800 border border-white p-8 rounded-md pointer-events-none transition duration-150 ${popCheck ? 'opacity-100' : 'opacity-0'} ${popScale ? 'scale-125' : 'scale-100'}`}>{checkCount}/{questionCount}</h1>
      {currentQuestion === questions.length && questions.length !== 0 && (
        <ResultCard setCurrentQuestion={setCurrentQuestion} 
                    setCheckCount={setCheckCount} 
                    checkCount={checkCount} 
                    questionCount={questionCount} 
                    popup={popup} setPopup={setPopup} 
                    setQuizName={setQuizName} 
                    handleSaveQuiz={handleSaveQuiz}
                    fade={fade}/>
      )}
      <button className='m-4' onClick={()=>setSavedPopup(true)}>Saved Quizzes</button>
      {questions.length !== 0 && (<button className='' onClick={()=>{
        setCurrentQuestion(0);
        setCheckCount(0);
        setQuestions([]);
        setOptions([]);
        setCorrectAnswer([]);
      }}>Back</button>)}
        
      <SavedQuizzesCard setSavedIsClicked={setSavedIsClicked} 
                        savedIsClicked={savedIsClicked} 
                        savedPopup={savedPopup} 
                        setSavedPopup={setSavedPopup} 
                        setQuestions={setQuestions} 
                        setQuestionCount={setQuestionCount} 
                        setOptions={setOptions} 
                        setCorrectAnswer={setCorrectAnswer}
                        setLoading={setLoading}/>
      
    </>
  )
}

export default App
