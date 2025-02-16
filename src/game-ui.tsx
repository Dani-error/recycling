"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { items } from "./consts"
import { shuffle } from "./lib/utils"
import { DraggableItem } from "./components/draggable-item"
import { DroppableBin } from "./components/droppable-bin"
import { GameHUD } from "./components/game-hud"
import { GameOverlay } from "./components/game-overlay"
import type { Bin, Difficulty, GameState } from "./typings"
import { Toaster } from "./components/ui/sonner"

interface GameUIProps {
  state: GameState
  difficulty: Difficulty
  setState: React.Dispatch<React.SetStateAction<GameState>>
  bins: Bin[]
  changeSettings: () => void
}

function GameUI({ state, difficulty, setState, bins, changeSettings }: GameUIProps) {
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")

  const won = useMemo(() => state.score >= difficulty.maxItems, [state.score, difficulty.maxItems])
  const lost = useMemo(() => state.health === 0 || state.timeLeft <= 0, [state.health, state.timeLeft])

  useEffect(() => {
    if (lost) {
      setState((s) => ({ ...s, playing: false }))
      setGameStatus("lost")
    } else if (won) {
      setState((s) => ({ ...s, playing: false }))
      setGameStatus("won")
    }
  }, [lost, won, setState])

  const restart = () => {
    setGameStatus("playing")
    setState({
      playing: true,
      health: difficulty.maxHealth,
      score: 0,
      timeLeft: difficulty.maxTime,
      items: shuffle([...items], difficulty.maxItems),
    })
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || !active || gameStatus !== "playing") return
    const draggedItem = state.items.find((item) => item.id === Number(active.id))
    if (draggedItem) {
      if (draggedItem.type === over.id) {
        setState((s) => ({ ...s, score: s.score + 1, items: s.items.filter((item) => item.id !== draggedItem.id) }))
        toast("Recycled correctly! +1 Earth Point", { icon: "🌍" })
      } else {
        over
        console.log(over.id)
        setState((s) => ({ ...s, health: s.health - 1 }))
        toast("Oops! Wrong bin. Try again!", { icon: "❌" })
      }
    }
  }

  return (
    <>
      <Toaster />
      <div className="relative w-full h-svh overflow-hidden bg-foreground">
        <div className="bg-fill blur-xl bg-center bg-[url(/background.jpg)] h-full w-full"></div>
        {/* Animated background elements */}
        <AnimatePresence>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{ y: -100 }}
              exit={{ y: -100 }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 20,
              }}
              style={{ width: `${Math.random() * 30 + 10}px`, height: `${Math.random() * 30 + 10}px` }}
            />
          ))}
        </AnimatePresence>

        {/* Game world */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full md:h-auto md:mx-4 rounded-none relative w-full max-w-4xl aspect-video md:rounded-3xl shadow-2xl overflow-hidden">
            {/* Sky */}
            <div className="absolute inset-0 bg-cover bg-center bg-[url(/background.jpg)]" />

            <DndContext onDragEnd={handleDragEnd}>
              {/* Bins */}
              <div className="absolute bottom-0 left-4 right-4 flex justify-around">
                {bins.map((bin) => (
                  <DroppableBin key={bin.type} bin={bin} />
                ))}
              </div>
            

            {/* Items */}
            <div className="absolute top-1/4 left-4 right-4 flex flex-wrap justify-center gap-4">
              <AnimatePresence>
                {state.items.map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
            </DndContext>
          </div>
        </div>

        {/* HUD */}
        <GameHUD state={state} difficulty={difficulty} />

        {/* Overlays */}
        <GameOverlay gameStatus={gameStatus} restart={restart} changeSettings={changeSettings} />
      </div>
    </>
  )
}

export default GameUI

