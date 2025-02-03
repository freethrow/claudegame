import React, { useState, useEffect } from 'react';
import wordMeanings from './complete_word_meanings.json';
import './App.css';

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
    return <div>Loading...</div>;
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
    <div className="App">
      <div className="score">
        <span>Question {currentIndex + 1}/{shuffledWords.length}</span>
        <span>Score: {score}/{attempted} ({percentage}%)</span>
      </div>
      <h1 className="word">{currentQuestion.word}</h1>
      <div className="options">
        {currentQuestion.meanings.map((meaning, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            className={`option ${showResult && index === currentQuestion.correct ? 'correct' : ''} ${
              showResult && index === selectedAnswer && index !== currentQuestion.correct ? 'incorrect' : ''
            }`}
            disabled={showResult}
          >
            {meaning}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="result">
          <p>
            {selectedAnswer === currentQuestion.correct
              ? 'Correct!'
              : 'Incorrect! The correct answer is: ' + currentQuestion.meanings[currentQuestion.correct]}
          </p>
          <button className="next-button" onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
