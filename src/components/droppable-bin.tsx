import { useDroppable } from "@dnd-kit/core"
import { motion } from "framer-motion"
import type { Bin } from "@/typings"

export function DroppableBin({ bin }: { bin: Bin }) {
  const { setNodeRef, isOver } = useDroppable({ id: bin.type })

  return (
    <motion.div
      ref={setNodeRef}
      className={`flex flex-col items-center justify p-2 w-24 h-44 justify-start ${bin.color} rounded-t-2xl cursor-pointer transition-all duration-300 ease-in-out overflow-hidden`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.img
        src={bin.image}
        alt={`${bin.displayName} Bin`}
        className="w-16 h-16 object-contain mb-2"
        animate={{
          y: isOver ? [0, -10, 0] : 0,
          scale: isOver ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div className="text-center text-white font-bold text-sm" animate={{ opacity: isOver ? 1 : 0.8 }}>
        {bin.displayName}
      </motion.div>
    </motion.div>
  )
}

