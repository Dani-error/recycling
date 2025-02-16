import { motion } from "motion/react"
import { Earth, Heart, Timer } from "lucide-react"
import type { GameState, Difficulty } from "@/typings"
import { useMemo } from "react"

interface GameHUDProps {
  state: GameState
  difficulty: Difficulty
}

export function GameHUD({ state, difficulty }: GameHUDProps) {

  const won = useMemo(() => state.score >= difficulty.maxItems, [state.score, difficulty.maxItems])
  const lost = useMemo(() => state.health === 0 || state.timeLeft <= 0, [state.health, state.timeLeft])


  const getMessage = () => {
    if (won) return "You're good at this!";
    if (lost) return "You might need to play again...";
    if (state.score > difficulty.maxItems * 0.7) return "You're doing amazing! Keep going!";
    if (state.score > difficulty.maxItems * 0.4) return "Nice work! Stay focused!";
    if (state.health <= 1) return "Careful! You're almost out of health!";
    if (state.timeLeft <= 5) return "Hurry! Time is almost up!";
    return "Hello, let's recycle!";
  };

  return (
    <>
      <motion.div
        className="absolute top-4 left-4 right-4 flex flex-col gap-4 justify-between items-center bg-black bg-opacity-50 text-white p-4 rounded-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            {Array.from({ length: difficulty.maxHealth }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: i < state.health ? 1 : 0.5, opacity: i < state.health ? 1 : 0.5 }}
              >
                <Heart fill={i < state.health ? "red" : "gray"} size={24} />
              </motion.div>
            ))}
          </div>
          <div className="text-2xl font-bold flex justify-center items-center gap-2"><Earth size={20} /> {state.score}</div>
          <div className="text-xl flex justify-center items-center gap-2"><Timer size={20} /> {state.timeLeft}s</div>
        </div>
        <div className="flex gap-2 justify-center items-center md:hidden">
          <img src={`./character/character-${lost ? "angry" : "good"}.png`} alt="Character" className="w-16 h-16" />
          {getMessage()}
        </div>
      </motion.div >
      <motion.div initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }} className="hidden md:flex fixed z-[1] top-10 md:top-[unset] md:bottom-10 left-4 right-4 md:left-10 flex-row items-center justify-between md:justify-center bg-black bg-opacity-50 p-3 md:p-4 rounded-3xl shadow-lg md:flex-col md:w-48 gap-2">
        <img src={`./character/character-${lost ? "angry" : "good"}.png`} alt="Character" className="w-16 h-16 md:w-3/4 md:h-3/4" />
        <p className="text-center font-bold text-white">{getMessage()}</p>
      </motion.div >
    </>
  )
}

