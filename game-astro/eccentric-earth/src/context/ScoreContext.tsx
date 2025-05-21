/** @jsxImportSource preact */
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { getOrCreateSessionId } from "../lib/session";

type ScoreContextType = {
  sessionId: string | null;
  score: number;
  total: number;
  status: 'correcte' | 'incorrecte' | null;
  updateScore: (score: number, total: number) => void;
  resetSession: () => void;
  updateStatus: (status: 'correcte' | 'incorrecte' | null) => void;
};

const ScoreContext = createContext<ScoreContextType | null>(null);

export function ScoreProvider({ children }: { children: any }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<'correcte' | 'incorrecte' | null>(null);

  // Genera o recupera sessionId
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
  }, []);

  // Un cop tenim sessionId, llegim puntuació
  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/get-score?session=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setScore(data.score || 0);
        setTotal(data.total || 0);
      })
      .catch((err) => console.error("Error loading score", err));
  }, [sessionId]);

  const updateScore = (newScore: number, newTotal: number) => {
    setScore(newScore);
    setTotal(newTotal);
  };

  const updateStatus = (newStatus: 'correcte' | 'incorrecte' | null) => {
    setStatus(newStatus);
  };

  const resetSession = async () => {
    if (sessionId) {
      // await fetch(`/api/delete-score?session=${sessionId}`, { method: "POST" });
    }

    localStorage.removeItem("sessionId");
    const newId = getOrCreateSessionId();
    setSessionId(newId);
    setScore(0);
    setTotal(0);
  };

  return (
    <ScoreContext.Provider value={{ sessionId, score, total, status, updateScore, updateStatus, resetSession }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
}
