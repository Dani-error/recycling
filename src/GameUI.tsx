import { useEffect, useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { toast } from "sonner";
import { Cog, Heart, HeartCrack } from "lucide-react";
import { Button } from "./components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./components/ui/alert-dialog";
import { Toaster } from "./components/ui/sonner";
import { items } from "./consts";
import { shuffle } from "./lib/utils";
import { DraggableItem } from "./components/draggable-item";
import { DroppableBin } from "./components/droppable-bin";
import { Bin, Difficulty, GameState } from "./typings";
import { motion } from "motion/react";

interface GameUIProps {
  state: GameState,
  difficulty: Difficulty,
  setState: React.Dispatch<React.SetStateAction<GameState>>,
  bins: Bin[]
  changeSettings: () => void
}

const shakeAnimation = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 2, 0], // Movimiento de izquierda a derecha
    transition: { duration: 0.3 },
  },
};


function GameUI({ state, difficulty, setState, bins, changeSettings }: GameUIProps) {
  const [dialog, setDialog] = useState<"won" | "lost" | null>(null);
  const [settingsDialog, setSettingsDialog] = useState(false);

  const won = useMemo(() => state.score >= items.length, [state.score]);
  const lost = useMemo(() => state.health === 0 || state.timeLeft <= 0, [state.health, state.timeLeft]);

  useEffect(() => {
    if (lost) {
      setState((s) => ({ ...s, playing: false }))
      setDialog("lost");
    }
  }, [lost]);

  useEffect(() => {
    if (state.items.length === 0) {
      setState((s) => ({ ...s, playing: false }))
      setDialog("won");
    }
  }, [state.items]);

  const restart = () => {
    setDialog(null)
    setState({ playing: true, health: difficulty.maxHealth, score: 0, timeLeft: difficulty.maxTime, items: shuffle([...items]) })
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (!over || !active || lost || won) return;
    const draggedItem = state.items.find((item) => item.id === Number(active.id));
    if (draggedItem) {
      if (draggedItem.type === over.id) {
        setState((s) => ({ ...s, score: s.score + 1, items: s.items.filter((item) => item.id !== draggedItem.id) }));
        toast("Good job! Correct recycling!");
      } else {
        setState((s) => ({ ...s, health: s.health - 1 }));
        toast("Oops! Try again.");
      }
    }
  };

  const getMessage = () => {
    if (won) return "You're good at this!";
    if (lost) return "You might need to play again...";
    if (state.score > items.length * 0.7) return "You're doing amazing! Keep going!";
    if (state.score > items.length * 0.4) return "Nice work! Stay focused!";
    if (state.health <= 1) return "Careful! You're almost out of health!";
    if (state.timeLeft <= 5) return "Hurry! Time is almost up!";
    return "Hello, let's recycle!";
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <motion.div
        className={`fixed inset-0 pointer-events-none z-50 
    ${state.health != difficulty.maxHealth && state.health <= Math.max(1, difficulty.maxHealth * 0.3) ? "opacity-100 animate-pulse" : "opacity-0"}
    transition-opacity duration-1000
  `}
        style={{
          background: "radial-gradient(ellipse at center, rgba(255, 0, 0, 0) 50%, rgba(255, 0, 0, 0.5) 90%)",
        }}
      />

      <Toaster />
      <AlertDialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog === "won" ? "You won!" : "Game Over"}</AlertDialogTitle>
            <AlertDialogDescription>Would you like to play again?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={restart}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={settingsDialog} onOpenChange={setSettingsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>If you leave now, your progress will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={changeSettings}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <div className="fixed z-[1] top-10 md:top-[unset] md:bottom-10 left-4 right-4 md:left-10 flex flex-row items-center justify-between md:justify-center bg-yellow-500 p-3 md:p-4 rounded-3xl shadow-lg md:flex-col md:w-48 gap-2">
        <img src={`./character/character-${lost ? "angry" : "good"}.png`} alt="Character" className="w-16 h-16 md:w-3/4 md:h-3/4" />
        <p className="text-center font-bold text-gray-800">{getMessage()}</p>
        {!state.playing && <Button variant="secondary" onClick={restart}>Play again</Button>}
      </div>

      <div className="pb-16 md:pb-0 md:flex md:items-center md:justify-center md:min-h-screen md:flex-col">
        <div className="justify-center p-4 md:p-6 items-center w-full mt-32 md:mt-0 flex flex-wrap md:justify-around gap-4 md:gap-8 mt-24">
          {bins.map((bin) => <DroppableBin key={bin.type} bin={bin} />)}
        </div>
        <div className="flex flex-col items-center justify-between w-full p-4 md:p-6 gap-6">


          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20">
            {state.items.map((item) => <DraggableItem key={item.id} item={item} />)}
          </div>
        </div>
      </div>

      <div className="fixed pt-[10px] left-1/2 bg-background -translate-x-1/2 bottom-0 h-[135px] flex flex-col gap-2 items-center w-full text-center">
        <div className="flex gap-2">
          {Array.from({ length: difficulty.maxHealth }).map((_, i) => {
            const Icon = lost ? HeartCrack : Heart;
            return (<motion.div
              key={i}
              {...(i === state.health ? shakeAnimation : {})} // Solo anima el último corazón perdido
            >
              <Icon fill={i < state.health ? "red" : "gray"} className="stroke-background" size={30} />
            </motion.div>);
          })}
        </div>
        <h3 className="text-xl font-bold">Score: {state.score}</h3>
        <p className="text-lg">Time Left: {state.timeLeft}s</p>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button size="icon" variant="ghost" onClick={() => {
          if (!won && !lost)
            setSettingsDialog(true)
          else changeSettings()
        }}><Cog size={18} /></Button>
      </div>
    </DndContext>
  );
}

export default GameUI;