"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { motion } from "framer-motion"
import type { Item } from "@/typings"

export function DraggableItem({ item }: { item: Item }) {
  const [isDragging, setIsDragging] = useState(false)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id.toString(),
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      style={style}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <motion.div
        className="touch-none flex justify-center items-center w-20 h-20 cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, scale: 0, rotate: 180 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: isDragging ? 0 : 360,
        }}
        exit={{ opacity: 0, scale: 0, rotate: -180 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          rotate: { duration: isDragging ? 0.2 : 20, ease: "linear" },
        }}
      >
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95, rotate: -5 }}
        >
          <motion.img draggable={false} src={item.image} alt={item.type} className="w-full h-full object-contain drop-shadow-lg" />
        </motion.div>
      </motion.div>
    </div>
  )
}

