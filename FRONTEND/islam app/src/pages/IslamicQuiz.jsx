import React, { useState, useEffect } from 'react';
import { Gamepad2, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import quizData from '../data/islamic_quiz.json';

export default function IslamicQuiz() {
  const [questions, setQuestions] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [level, setLevel] = useState('Tous');

  // Auto advance to next question after 4 seconds
  useEffect(() => {
    let timer;
    if (isAnswered && currentIdx < questions.length - 1) {
      timer = setTimeout(() => {
        nextQuestion();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isAnswered, currentIdx, questions.length]);

  // Initialize and shuffle questions on mount
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    let filtered = quizData;
    if (level !== 'Tous') {
      filtered = quizData.filter(q => q.difficulty === level);
    }
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setHasStarted(true);
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (!hasStarted) {
    return (
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-24 text-center">
        <PageHeader 
          icon={<Gamepad2 size={32} />} 
          title="Quiz Islamique" 
          subtitle="Testez vos connaissances sur l'Islam (Coran, Prophètes, Croyance)." 
        />
        <div className="mt-12 bg-theme-surface border border-theme-border rounded-3xl p-8 max-w-md mx-auto shadow-xl">
          <Award size={64} className="text-theme-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-theme-text mb-4">Prêt à tester votre savoir ?</h2>
          <p className="text-theme-text-muted mb-6">
            Vous aurez {level === 'Tous' ? '10' : 'des'} questions aléatoires. Répondez correctement pour obtenir le meilleur score possible !
          </p>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-theme-text-muted mb-3 text-left">Choisir le niveau :</label>
            <div className="flex flex-wrap gap-2">
              {['Tous', 'Facile', 'Moyen', 'Difficile'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 min-w-[80px] py-2 rounded-lg font-bold text-sm transition-all border ${
                    level === lvl 
                      ? 'bg-theme-primary text-black border-theme-primary' 
                      : 'bg-theme-bg text-theme-text border-theme-border hover:border-theme-primary/50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={startNewGame}
            className="w-full bg-theme-primary text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-theme-primary/20"
          >
            Commencer le Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    let message = "";
    if (percentage === 100) message = "Parfait ! Vous maîtrisez votre sujet. Ma sha Allah !";
    else if (percentage >= 70) message = "Très bon score ! Continuez à apprendre.";
    else if (percentage >= 50) message = "Bon score, mais vous pouvez faire encore mieux !";
    else message = "C'est l'occasion idéale d'apprendre de nouvelles choses !";

    return (
      <div className="pt-8 px-4 max-w-4xl mx-auto pb-24 text-center animate-in fade-in zoom-in duration-300">
        <div className="mt-12 bg-theme-surface border border-theme-border rounded-3xl p-8 sm:p-12 max-w-lg mx-auto shadow-2xl">
          <Award size={80} className={`${percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'} mx-auto mb-6`} />
          <h2 className="text-3xl font-bold text-theme-text mb-2">Quiz Terminé !</h2>
          <div className="text-5xl font-black text-theme-primary my-6">
            {score} <span className="text-2xl text-theme-text-muted">/ {questions.length}</span>
          </div>
          <p className="text-theme-text font-medium text-lg mb-10">{message}</p>
          
          <button 
            onClick={startNewGame}
            className="w-full flex justify-center items-center gap-2 bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text font-bold py-4 rounded-xl transition-all"
          >
            <RotateCcw size={20} /> Rejouer au Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="pt-8 px-4 max-w-3xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-theme-text flex items-center gap-3">
            <Gamepad2 className="text-theme-primary" /> Quiz Islamique
          </h1>
        </div>
        <div className="bg-theme-surface border border-theme-border px-4 py-2 rounded-xl text-theme-primary font-bold">
          Score: {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-theme-text-muted mb-2">
          <span>Question {currentIdx + 1} / {questions.length}</span>
          <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-theme-surface rounded-full overflow-hidden">
          <div 
            className="h-full bg-theme-primary transition-all duration-300 rounded-full"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-block px-3 py-1 bg-theme-bg border border-theme-border rounded-lg text-xs font-bold text-theme-text-muted mb-4 uppercase tracking-wider">
          {currentQ.category} • {currentQ.difficulty}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-theme-text mb-8 leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswer;
            
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-base sm:text-lg flex justify-between items-center ";
            
            if (!isAnswered) {
              btnClass += "border-theme-border bg-theme-bg hover:border-theme-primary/50 hover:bg-theme-surface-hover text-theme-text";
            } else {
              if (isCorrect) {
                btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-500";
              } else if (isSelected) {
                btnClass += "border-red-500 bg-red-500/10 text-red-500";
              } else {
                btnClass += "border-theme-border bg-theme-bg opacity-50 text-theme-text-muted";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className={`p-4 rounded-xl border-l-4 ${selectedOption === currentQ.correctAnswer ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
              <h3 className="font-bold mb-1">
                {selectedOption === currentQ.correctAnswer ? 'Bonne réponse !' : 'Mauvaise réponse...'}
              </h3>
              <p className="text-sm opacity-90 leading-relaxed">{currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* Next Button always visible */}
        <button 
          onClick={nextQuestion}
          disabled={!isAnswered}
          className={`w-full mt-6 flex justify-center items-center gap-2 font-bold py-4 rounded-xl transition-all ${
            isAnswered 
              ? 'bg-theme-primary text-black hover:scale-[1.01] shadow-lg cursor-pointer' 
              : 'bg-theme-bg border border-theme-border text-theme-text-muted opacity-50 cursor-not-allowed'
          }`}
        >
          {currentIdx < questions.length - 1 
            ? (isAnswered ? 'Question Suivante (Auto...)' : 'Choisissez une réponse') 
            : 'Voir les Résultats'}
          {isAnswered && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
