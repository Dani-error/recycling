import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";
import { cn } from "@/lib/utils";
import { Item } from "@/typings";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

export function DraggableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id.toString(),
  });

  const darkMode = usePrefersDarkMode()
  const [backgroundColor, setBackgroundColor] = useState("bg-zinc-300")

  useEffect(() => {
    if (darkMode) {
      setBackgroundColor("bg-zinc-800")
    } else {
      setBackgroundColor("bg-zinc-300")
    }
  }, [darkMode])

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn("touch-none flex justify-center items-center w-24 h-24 rounded-3xl cursor-pointer", backgroundColor)}
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
    >
      <img src={item.image} alt={item.type} className="w-auto h-4/5" />
    </div>
  );
}