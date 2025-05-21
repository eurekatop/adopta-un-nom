/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks";
import QuestionGame from "./QuestionGame";
import { useScore } from "../context/ScoreContext";

interface Props {
  id?: string;
  lang?: string;
}

interface Question {
  question: string;
  options: string[];
  answerId: string;
}

export default function GameContainer({ id, lang }: Props) {
  const { score, total, resetSession, sessionId , status } = useScore();
  const [question, setQuestion] = useState<Question | null>(null);

  const carregar = async () => {
    try {
      const url = id ? `/api/quiz/${lang}/${id}` : `/api/quiz/${lang}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const nova = await res.json();
      setQuestion(nova);
    } catch (err) {
      console.error("Error carregant la pregunta:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, [id]);

  const handleNext = (result: "correcte" | "incorrecte") => {
    const currentId = parseInt(id || "0", 10);
    const nextId = currentId + 1;

    const _seed = `${Math.floor(Math.random() * 1000000)}`;
    const _sessionId = sessionId || "anon";
    const nextSeed = `${Date.now()}-${_seed}-${_sessionId.slice(-4)}`;


    window.location.href = `/${lang}/game/${nextSeed}`;
  };

  if (!question) return <p>Carregant...</p>;

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="scoreboard">Punts: {score} / {total}</div>
        <button className="reset-button" onClick={resetSession}>
          🔄 Reinicia el joc
        </button>

        {status && (
          <div className={`extra-content answer-feedback ${status}`}>
            <p>Has respost: <strong>{status}</strong></p>
            <button className="next-button" onClick={() => {
              handleNext(status);
            }}>
              Següent ▶️
            </button>
          </div>
        )}

      </header>



      <main className="game-wrapper">
        <QuestionGame
          question={question.question}
          options={question.options}
          answerId={question.answerId}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
