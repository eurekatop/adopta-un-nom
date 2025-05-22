import type { MiddlewareHandler } from "astro";

const SUPPORTED_LANGS = ["ca", "es", "en"];

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Si l'usuari accedeix a l'arrel ("/"), redirigeix segons navegador
  if (path === import.meta.env.BASE_URL) {
    const header = context.request.headers.get("accept-language") || "";
    const lang = SUPPORTED_LANGS.includes(header.slice(0, 2))
      ? header.slice(0, 2)
      : "ca";


    console.log(lang);

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${import.meta.env.BASE_URL}${lang}/`,
      },
    });
  }

  return next();
};
