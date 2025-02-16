import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"

interface GameOverlayProps {
  gameStatus: "playing" | "won" | "lost"
  restart: () => void
  changeSettings: () => void
}

export function GameOverlay({ gameStatus, restart, changeSettings }: GameOverlayProps) {
  return (
    <AnimatePresence>
      {gameStatus !== "playing" && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center px-4 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background p-8 rounded-2xl text-center w-full md:w-auto"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              {gameStatus === "won" ? "You saved the planet!" : "Earth needs you!"}
            </h2>
            <p className="text-xl mb-6">
              {gameStatus === "won"
                ? "You're a true recycling hero! Want to save the planet again?"
                : "Our planet needs another chance. Will you help?"}
            </p>
            <div className="flex justify-center px-4 gap-2">
              <Button onClick={restart} size="lg">
                Play Again
              </Button>
              <Button onClick={changeSettings} variant="outline" size="lg">
                Change Settings
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

