import { useEffect, useMemo, useState } from "react";
import GameUI from "./game-ui";
import { shuffle } from "./lib/utils";
import { bins, difficulties, items } from "./consts";
import { Button } from "./components/ui/button";
import { Difficulty, GameState } from "./typings";
import { Recycle } from "lucide-react";
import usePrefersDarkMode from "./hooks/usePrefersDarkMode";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";
import { Input } from "./components/ui/input";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [customDifficultyOpen, setCustomDifficultyOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(difficulties[0])
  const [state, setState] = useState<GameState>({
    playing: false,
    health: 0,
    score: 0,
    timeLeft: 0,
    items: [],
  });

  const won = useMemo(() => state.score >= difficulty.maxItems, [state.score, difficulty.maxItems]);
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
      items: shuffle([...items], diff.maxItems),
    });
    setGameStarted(true);
  };

  const prefersDark = usePrefersDarkMode();

  useEffect(() => {
    const mode = prefersDark ? "dark" : "light"

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [prefersDark]);

  const changeSettings = () => setGameStarted(false)

  if (!gameStarted) {
    return (
      <>
        <Dialog open={customDifficultyOpen} onOpenChange={(value) => {
          setCustomDifficultyOpen(value)
          if (!value) {
            setDifficulty({ name: "Custom", maxHealth: 3, maxItems: 8, maxTime: 30 })
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configure Difficulty</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="maxHealth">Max Health</Label>
                <Slider
                  id="maxHealth"
                  min={1}
                  max={10}
                  step={1}
                  value={[difficulty.maxHealth]}
                  onValueChange={(value) => setDifficulty({ ...difficulty, maxHealth: value[0] })}
                />
                <div className="text-center text-sm text-muted-foreground">{difficulty.maxHealth}</div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxTime">Max Time (seconds)</Label>
                <Input
                  id="maxTime"
                  type="number"
                  value={difficulty.maxTime}
                  onChange={(e) => setDifficulty({ ...difficulty, maxTime: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxItems">Max Items</Label>
                <Slider
                  id="maxItems"
                  min={1}
                  max={10}
                  step={1}
                  value={[difficulty.maxItems]}
                  onValueChange={(value) => setDifficulty({ ...difficulty, maxItems: value[0] })}
                />
                <div className="text-center text-sm text-muted-foreground">{difficulty.maxItems}</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => startGame(difficulty)}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col items-center justify-center h-svh gap-4">
          <Recycle size={120} />
          <h1 className="text-3xl font-bold">Recycling Game</h1>
          <p>Select Difficulty:</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              {difficulties.map((diff) => (
                <Button key={diff.name} onClick={() => startGame(diff)}>{diff.name}</Button>
              ))}
            </div>
            <Button variant={"outline"} onClick={() => setCustomDifficultyOpen(true)}>Custom</Button>
          </div>
          <Button variant={"link"} className="text-muted-foreground text-sm absolute bottom-10" asChild><a target="_blank" href="https://github.com/Dani-error/recycling">@dani-error</a></Button>
        </div>
      </>
    );
  }

  return <GameUI difficulty={difficulty} setState={setState} state={state} bins={bins} changeSettings={changeSettings} />;
}

export default App;
