/** @jsxImportSource preact */
import { ScoreProvider } from '../context/ScoreContext';
import GameContainer from './GameContainer'; // component real del joc


interface Props {
	id?: string; 
  lang?: string; 
  quiz:{
    question: string;
    options: string[];
    answerId: string;
  } | undefined;
}


export default function GameApp({ id , lang, quiz }: Props) {
  return (
    <ScoreProvider>
      <GameContainer id={id} lang={lang} quiz={quiz} />
    </ScoreProvider>
  );
}