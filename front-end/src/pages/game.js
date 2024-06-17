import ChessGame from "@/components/ChessBoard";
import HomeWrapper from "@/components/HomeWrapper/HomeWrapper";
import Game from "../models/Game";
import dbConnect from '@/lib/mongodb';
import MiniProfile from "@/components/MiniProfile/MiniProfile";

export async function getServerSideProps(context) {
  const { gameId } = context.query;
  await dbConnect();

  try {
    const game = await Game.findById(gameId).populate('initializer').populate('opponent');
    
    console.log('game', game);

    // Remove sensitive data
    game.initializer.password = undefined;
    game.opponent.password = undefined;
    
    if (game.status === 'ended') { 
      return {
        props: {
          game: null,
        },
      };
    }

    return {
      props: {
        game: JSON.parse(JSON.stringify(game)),
      },
    };
  } catch (error) {
    return {
      props: {
        game: null,
      },
    };
  }
}

export default function Home({game}) {
  
  return (
    <HomeWrapper>
        <h1 className="text-6xl font-bold text-center text-white mb-7 mt-7">Chess</h1>
        <div className="flex justify-center mb-7"> 
          <MiniProfile user={game.initializer} />
          <ChessGame {...{game}} />  
          <MiniProfile user={game.opponent}/>
        </div>
		</HomeWrapper>  
  );
}