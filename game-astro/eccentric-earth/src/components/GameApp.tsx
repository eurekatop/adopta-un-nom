/** @jsxImportSource preact */
import { ScoreProvider } from '../context/ScoreContext';
import GameContainer from './GameContainer'; // component real del joc


interface Props {
	id?: string; // identificador de la pregunta
  lang?: string; // idioma en el que es mostra el joc
}


export default function GameApp({ id , lang }: Props) {
  return (
    <ScoreProvider>
      <GameContainer id={id} lang={lang} />
    </ScoreProvider>
  );
}