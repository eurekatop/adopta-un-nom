import { serve } from "bun";
import index from "./index.html";
import {getQuizHandler} from "./routes/quiz/get";



const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/quiz": async (req) => {
      try {
        const quiz = await getQuizHandler();
        return Response.json(quiz);
      } catch (err) {
        console.error("❌ Error en getQuizHandler:", err);
        return new Response("Error intern del servidor", { status: 500 });
      }
    }

  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});



console.log(`🚀 Server running at ${server.url}`);
