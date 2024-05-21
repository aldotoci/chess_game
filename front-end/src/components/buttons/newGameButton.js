import { useRouter } from "next/router";

const NewGameButton = () => {
  const router = useRouter();

  const createNewGame = async () => {
    const res = await fetch("/api/new-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initializer: "user_id_of_initializer",
        opponent: "user_id_of_opponent",
        settings: { timeControl: "5min" },
      }),
    });
    const game = await res.json();
    if (res.ok) {
      router.push(`/game?gameId=${game.gameId}`);
    } else {
      alert(`Failed to create game: ${game.error}`);
    }
  };

  return <button onClick={createNewGame}>New Game</button>;
};

export default NewGameButton;
