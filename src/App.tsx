import { useState } from 'react'
import './App.css'

// Item type interface
interface Item {
  id: number;
  type: string;
  image: string;
}

const items: Item[] = [
  { id: 1, type: 'plastic', image: './plastic-bottle.png' },
  { id: 2, type: 'plastic', image: '/plastic-bag.png' },
  { id: 3, type: 'plastic', image: '/plastic-cup.png' },
  { id: 4, type: 'glass', image: '/glass-bottle.png' },
  { id: 5, type: 'glass', image: '/glass-jar.png' },
  { id: 6, type: 'plastic', image: '/plastic-tube.png' },
  { id: 7, type: 'glass', image: '/glass-cup.png' },
  { id: 8, type: 'plastic', image: '/plastic-box.png' }
];

function App() {

  const [score, setScore] = useState<number>(0);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);

  // Function to handle when item starts being dragged
  const handleDragStart = (item: Item) => {
    setDraggedItem(item);
  };

  // Function to handle drop into the bins
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, binType: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === binType) {
      setScore(score + 1);
      alert('Good job! Correct recycling!');
    } else {
      alert('Oops! Try again.');
    }
    setDraggedItem(null); // Reset dragged item
  };

  // Allow dropping on the bins
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="game-container">
      <div className="background"></div>
      <div className="character">
        <img src="./character.png" alt="Character" />
        <p>Hello, let's recycle the plastics!</p>
      </div>

      <div className="bins">
        <div
          className="bin plastic"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'plastic')}
        >
          Plastic
        </div>
        <div
          className="bin glass"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'glass')}
        >
          Glass
        </div>
      </div>

      <div className="items">
        {items.map((item) => (
          <div
            key={item.id}
            className="item"
            draggable
            onDragStart={() => handleDragStart(item)}
          >
            <img src={item.image} alt={item.type} />
          </div>
        ))}
      </div>

      <div className="score">
        <h3>Score: {score}</h3>
      </div>
    </div>
  )
}

export default App
