/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';

interface RankingEntry {
  session_id: string;
  score: number;
  total: number;
}

interface Props {
  lang?: string;
}

const translations = {
  ca: {
    loading: 'Carregant rànquing...',
    title: '🏆 Rànquing històric',
    user: 'Usuari',
  },
  es: {
    loading: 'Cargando ranking...',
    title: '🏆 Ranking histórico',
    user: 'Usuario',
  },
  en: {
    loading: 'Loading ranking...',
    title: '🏆 All-time ranking',
    user: 'User',
  },
};

export default function Ranking({ lang = 'ca' }: Props) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang as keyof typeof translations] ?? translations.ca;

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        setRanking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>{t.loading}</p>;

  return (
    <div className="ranking-container">
      <h2>{t.title}</h2>
      <ol className="ranking-list">
        {ranking.map((entry, index) => (
          <li key={entry.session_id}>
            <span className="ranking-user">{t.user} {entry.session_id.slice(-4)}</span>
            <span className="ranking-score">{entry.score} / {entry.total}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
