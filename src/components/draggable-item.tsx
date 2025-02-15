import { Item } from "@/typings";
import { useDraggable } from "@dnd-kit/core";

export function DraggableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="touch-none flex justify-center items-center w-24 h-24 bg-red-500 rounded-3xl cursor-pointer"
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
    >
      <img src={item.image} alt={item.type} className="w-auto h-4/5" />
    </div>
  );
}