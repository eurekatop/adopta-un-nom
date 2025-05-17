// bun-react-ssr-quiz/index.tsx
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";

const port = 3000;

function Page({ definition, options }: { definition: string; options: string[] }) {
  return (
    <html lang="ca">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Joc de definicions - Eurekatop</title>
        <meta name="description" content="Aprèn vocabulari en català jugant amb definicions aleatòries." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
            background: #f9f9f9;
            color: #222;
            max-width: 640px;
            margin: 0 auto;
            padding: 2rem;
          }
          h1 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }
          .question-box {
            background: white;
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .question-text {
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .option {
            background: #eef;
            border: none;
            padding: 0.75rem;
            border-radius: 8px;
            cursor: pointer;
            text-align: left;
            transition: background 0.2s ease;
          }
          .option:hover {
            background: #dde;
          }
          .feedback {
            margin-top: 1rem;
            font-weight: 600;
          }
          .next-btn {
            margin-top: 2rem;
            padding: 0.75rem 1.5rem;
            background: #333;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }
          .next-btn:hover {
            background: #111;
          }
          footer {
            margin-top: 4rem;
            font-size: 0.9rem;
            text-align: center;
            color: #777;
          }
        `}</style>
      </head>
      <body>
        <h1>Joc de definicions</h1>
        <p>Endevina la paraula correcta segons la definició. Posa a prova el teu vocabulari!</p>

        <div className="question-box">
          <div className="question-text" id="definition">{definition}</div>
          <div className="options" id="options">
            {options.map((opt, idx) => (
              <button className="option" key={idx}>{opt}</button>
            ))}
          </div>
          <div className="feedback" id="feedback"></div>
          <button className="next-btn" id="nextBtn" style={{ display: "none" }}>Següent</button>
        </div>

        <footer>
          © 2025 Eurekatop — Fomentem el català amb jocs i cultura
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          const apiURL = "/api/get-quiz";
          const defEl = document.getElementById("definition");
          const optionsEl = document.getElementById("options");
          const feedbackEl = document.getElementById("feedback");
          const nextBtn = document.getElementById("nextBtn");
          let correctAnswer = "coure"; // dummy inicial

          function renderQuiz(quiz) {
            defEl.textContent = quiz.question;
            optionsEl.innerHTML = "";
            feedbackEl.textContent = "";
            nextBtn.style.display = "none";
            correctAnswer = quiz.correct;

            quiz.options.forEach(word => {
              const btn = document.createElement("button");
              btn.className = "option";
              btn.textContent = word;
              btn.onclick = () => {
                if (word === correctAnswer) {
                  feedbackEl.textContent = "✅ Correcte!";
                  feedbackEl.style.color = "green";
                } else {
                  feedbackEl.textContent = "❌ Incorrecte! Era: " + correctAnswer;
                  feedbackEl.style.color = "red";
                }
                nextBtn.style.display = "inline-block";
              };
              optionsEl.appendChild(btn);
            });
          }

          nextBtn.addEventListener("click", async () => {
            const res = await fetch(apiURL);
            const quiz = await res.json();
            renderQuiz(quiz);
          });
        ` }} />
      </body>
    </html>
  );
}

serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      const definition = "Acció de preparar aliments amb calor.";
      const options = ["dormir", "coure", "tallar"];

      const html = renderToString(<Page definition={definition} options={options} />);
      return new Response("<!DOCTYPE html>" + html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/api/get-quiz") {
      const definition = "Acció d’estar en posició horitzontal per descansar.";
      const options = ["dormir", "menjar", "beure"];
      const correct = "dormir";

      return Response.json({ question: definition, options, correct });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`🧠 SSR quiz en marxa: http://localhost:${port}`);