import React from 'react'

export const QuestionCard = ({currentQuestion,handleCorrectAnswer,fade,questions,options}) => {
  return (
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
  )
}
