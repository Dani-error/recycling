import { useEffect, useMemo, useState } from "react";
import GameUI from "./GameUI";
import { shuffle } from "./lib/utils";
import { bins, difficulties, items } from "./consts";
import { Button } from "./components/ui/button";
import { Difficulty, GameState } from "./typings";
import { Recycle } from "lucide-react";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(difficulties[0])
  const [state, setState] = useState<GameState>({
    playing: false,
    health: 0,
    score: 0,
    timeLeft: 0,
    items: [],
  });

  const won = useMemo(() => state.score >= items.length, [state.score]);
  const lost = useMemo(() => state.health === 0 || state.timeLeft <= 0, [state.health, state.timeLeft]);

  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      if (!lost && !won) setState((s) => ({ ...s, timeLeft: s.timeLeft - 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [lost, won, gameStarted]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff)
    setState({
      playing: true,
      health: diff.maxHealth,
      score: 0,
      timeLeft: diff.maxTime,
      items: shuffle([...items]),
    });
    setGameStarted(true);
  };

  const changeSettings = () => setGameStarted(false)

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-svh gap-4">
        <Recycle size={120} />
        <h1 className="text-3xl font-bold">Recycling Game</h1>
        <p>Select Difficulty:</p>
        <div className="flex gap-4">
          {difficulties.map((diff) => (
            <Button key={diff.name} onClick={() => startGame(diff)}>{diff.name}</Button>
          ))}
        </div>
        <Button variant={"link"} className="text-muted-foreground text-sm absolute bottom-10" asChild><a target="_blank" href="https://github.com/Dani-error">@dani-error</a></Button>
      </div>
    );
  }

  return <GameUI difficulty={difficulty} setState={setState} state={state} bins={bins} changeSettings={changeSettings} />;
}

export default App;
