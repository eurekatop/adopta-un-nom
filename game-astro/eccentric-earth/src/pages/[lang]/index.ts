export async function GET({ params }) {
  const lang = params?.lang ?? 'en'; 
  const rand = Math.floor(Math.random() * 10000) + 1;
  const languages = ['en', 'es', 'ca'];

  let _lang = undefined;
  if (!languages.includes(lang)) {
    _lang = 'en';
  }
  else {
    _lang = lang;
  }
  

  console.log(`Redirecting to /${lang}/game/${rand}`);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${import.meta.env.BASE_URL}${_lang}/game/${rand}`,
    },
  });
}


