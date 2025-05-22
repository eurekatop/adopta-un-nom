/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import { useScore } from '../context/ScoreContext';

interface Props {
  question: string;
  options: string[];
  answerId: string;
  onNext: (result: 'correcte' | 'incorrecte') => void;
}

export default function QuestionGame({ question, options, answerId, onNext }: Props) {
  const { sessionId, updateScore, updateStatus, status } = useScore();
  const [selected, setSelected] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  async function handleClick(option: string) {

    if (selected) return;
    setSelected(option);

    const res = await fetch(`${import.meta.env.BASE_URL}api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: answerId, 
        answer: option ,
        sessionId: sessionId
      }),
    });

    const data = await res.json();
    updateStatus(data.result);
    setCorrectAnswer(data.correct);
    
    const {score} = data;
    updateScore(score.score, score.total);



  }

  const getButtonClass = (opt: string) => {
    if (!selected) return "option-button";
    if (opt === correctAnswer) return "option-button correct animate-pulse-correcte";
    if (opt === selected) return "option-button incorrect";
    return "option-button disabled";
  };

  return (
    <div className="question-container">
      <h2 className="question-title">{question}</h2>
      <div className="option-list">
        {options.map((opt) => (
          <button
            key={opt}
            className={getButtonClass(opt)}
            onClick={() => handleClick(opt)}
            disabled={!!selected}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
