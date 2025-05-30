/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks";
import { useScore } from "../../../context/ScoreContext";
import { buttonPrimary } from './GameContainer.css';
import QuestionGame from "./QuestionGame";

interface Props {
  id?: string;
  lang?: string;
  quiz:{
    question:string;
    options:string[];
  } | undefined;
}

interface Question {
  question: string;
  options: string[];
  answerId: string;
}

const translations = {
  ca: {
    loading: "Carregant...",
    score: "Punts",
    restart: "🔄 Reinicia el joc",
    correct: "Encertada!",
    incorrect: "Incorrecta!",
    next: "Següent ▶️",
  },
  es: {
    loading: "Cargando...",
    score: "Puntos",
    restart: "🔄 Reiniciar juego",
    correct: "¡ Acierto !",
    incorrect: "¡ Fallo !",
    next: "Siguiente ▶️",
  },
  en: {
    loading: "Loading...",
    score: "Score",
    restart: "🔄 Restart game",
    correct: "🎉 Nice job!",
    incorrect: "😢 Oops, try again!",
    next: "Next ▶️",
  },
};

export default function GameContainer({ id, lang = "ca", quiz }: Props) {
  const { score, total, resetSession, sessionId, status } = useScore();
  const [question, setQuestion] = useState<Question | null>(null);

  const t = translations[lang as keyof typeof translations] ?? translations.ca;

  const carregar = async () => {
    try {
      const url = id ? `${import.meta.env.BASE_URL}api/quiz/${lang}/${id}` : `${import.meta.env.BASE_URL}api/quiz/${lang}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const nova = await res.json();
      setQuestion(nova);
    } catch (err) {
      console.error("Error carregant la pregunta:", err);
    }
  };

  useEffect(() => {
    if (!quiz && question) {
      carregar();
    }
    else {
      setQuestion(quiz);
    }
  }, [id]);

  const handleNext = (result: "correcte" | "incorrecte") => {
    const currentId = parseInt(id || "0", 10);
    const nextId = currentId + 1;

    const _seed = `${Math.floor(Math.random() * 1000000)}`;
    const _sessionId = sessionId || "anon";
    const nextSeed = `${Date.now()}-${_seed}-${_sessionId.slice(-4)}`;

    window.location.href = `${import.meta.env.BASE_URL}${lang}/game/${nextSeed}`;
  };

  if (!question) return <p>{t.loading}</p>;

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="scoreboard">
          {t.score}: {score} / {total}
        </div>
        <button className="reset-button" onClick={resetSession}>
          {t.restart}
        </button>

        {status && (
          <div className={`extra-content answer-feedback ${status}`}>
            <p>
              <strong>
                {status === 'correcte' ? t.correct : t.incorrect}
              </strong> 
             </p>
            <button className="next-button" onClick={() => handleNext(status)}>
              {t.next}
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
