import React, { useState, useEffect } from 'react';
import wordMeanings from './complete_word_meanings.json';

function App() {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    setShuffledWords(shuffleArray([...wordMeanings.words]));
  }, []);

  const currentQuestion = shuffledWords[currentIndex];

  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-screen text-2xl">Loading...</div>;
  }

  const handleAnswerClick = (index) => {
    if (!showResult) {
      setSelectedAnswer(index);
      setShowResult(true);
      setAttempted((prev) => prev + 1);
      if (index === currentQuestion.correct) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  };

  const percentage = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-start h-screen p-3 bg-orange-200">
      <div className="w-full flex justify-between items-center px-3 mb-3">
        <div className="text-lg p-3 font-bold text-gray-500 border border-gray-500">freethrow</div>
        <div className="text-xl font-bold text-gray-900">
          <div className="text-gray-500">Question {currentIndex + 1}/{shuffledWords.length}</div>
          <div className="text-gray-700">Score: {score}/{attempted} ({percentage}%)</div>
        </div>
      </div>
      <h1 className="text-8xl font-bold my-8 font-sans">
        {currentQuestion.word}
      </h1>
      <div className="grid grid-cols-2 gap-5 w-full max-w-4xl h-96">
        {currentQuestion.meanings.map((meaning, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            className={`flex items-center justify-center p-5 border rounded-lg text-2xl transition-all max-h-32 ${
              showResult && index === currentQuestion.correct
                ? 'bg-green-100 border-green-200'
                : showResult && index === selectedAnswer && index !== currentQuestion.correct
                ? 'bg-red-100 border-red-200'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            disabled={showResult}
          >
            {meaning}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-8 text-center">
          <p className="text-xl mb-4">
            {selectedAnswer === currentQuestion.correct
              ? 'Correct!'
              : 'Incorrect! The correct answer is: ' + currentQuestion.meanings[currentQuestion.correct]}
          </p>
          <button
            className="px-8 py-3 text-lg font-light text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
