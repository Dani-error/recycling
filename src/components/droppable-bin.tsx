import { Bin } from "@/typings";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";

export function DroppableBin({ bin }: { bin: Bin }) {
    const { setNodeRef } = useDroppable({ id: bin.type });
  
    const color = useMemo(() => bin.color, [bin])
  
    return (
      <div
        ref={setNodeRef}
        className={`flex flex-col justify-self-center items-center justify-evenly py-5 ${color} w-24 h-40 rounded-xl text-white font-bold text-lg cursor-pointer`}
      >
        <img src={bin.image} alt={`${bin.displayName} Bin`} className="w-2/3 h-auto" />
        {bin.displayName}
      </div>
    );
  }