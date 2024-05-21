import ChessGame from "@/components/ChessBoard";
import HomeWrapper from "@/components/HomeWrapper/HomeWrapper";
import Game from "../models/Game";
import dbConnect from '@/lib/mongodb';


export async function getServerSideProps(context) {
  const { gameId } = context.query;
  await dbConnect();

  try {
    const game = await Game.findById(gameId);
    return {
      props: {
        game: JSON.parse(JSON.stringify(game)),
      },
    };
  } catch (error) {
    console.error(error);
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
          <ChessGame {...{game}} />  
        </div>
		</HomeWrapper>  
  );
}