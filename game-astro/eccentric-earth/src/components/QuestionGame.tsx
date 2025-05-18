/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

interface Props {
  question: string;
  options: string[];
  correct: string;
}

export default function QuestionGame({ question, options, correct }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'correcte' | 'incorrecte' | null>(null);

  function handleClick(option: string) {
    setSelected(option);
    setStatus(option === correct ? 'correcte' : 'incorrecte');
  }

  return (
    <div>
      <h3>{question}</h3>
      <div style={{ marginTop: '1rem' }}>
        {options.map((opt) => (
          <button
            key={opt}
            disabled={selected !== null}
            onClick={() => handleClick(opt)}
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor:
                selected === opt
                  ? opt === correct
                    ? 'lightgreen'
                    : 'lightcoral'
                  : '#eee',
              border: '1px solid #ccc',
              cursor: selected ? 'default' : 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {status && (
        <p>
          Has respost: <strong>{status}</strong>
        </p>
      )}
    </div>
  );
}
