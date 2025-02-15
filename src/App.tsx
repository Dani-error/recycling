import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { Button } from './components/ui/button';

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

  const [currentItems, setCurrentItems] = useState<Item[]>(items)
  const [score, setScore] = useState<number>(0);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [wonDialog, setWonDialog] = useState(false)

  const won = useMemo(() => score == items.length, [score])

  // Function to handle when item starts being dragged
  const handleDragStart = (item: Item) => {
    setDraggedItem(item);
  };

  useEffect(() => {
    if (currentItems.length == 0) {
      setWonDialog(true)
    }
  }, [currentItems])

  // Function to handle drop into the bins
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, binType: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === binType) {
      setScore(score + 1);
      setCurrentItems((prev) => (prev.filter(item => item.id != draggedItem.id)))
      toast('Good job! Correct recycling!');
    } else {
      toast('Oops! Try again.');
    }
    setDraggedItem(null); // Reset dragged item
  };

  // Allow dropping on the bins
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const restart = () => {
    setScore(0)
    setCurrentItems(items)
  }

  return (
    <>
      <Toaster />
      <AlertDialog open={wonDialog} onOpenChange={setWonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You won!</AlertDialogTitle>
            <AlertDialogDescription>
              You passed the game! Would you like to start a new game?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={restart}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="game-container">
        <div className="background"></div>
        <div className="character">
          <img src="./character.png" alt="Character" />
          <p>{ won ? "I think you should play again! You're good at this." : "Hello, let's recycle the plastics!"}</p>
          { won && <Button variant={"secondary"} onClick={restart}>Play again</Button>}
        </div>

        <div className="bins">
          <div
            className="bin bg-yellow-600 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'plastic')}
          >
            <img src="plastic-bin.png" alt={"Plastic Bin"} />
            Plastic
          </div>
          <div
            className="bin bg-green-600 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'glass')}
          >
            <img src="glass-bin.png" alt={"Glass Bin"} />
            Glass
          </div>
        </div>

        <div className="items">
          {currentItems.map((item) => (
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
    </>
  )
}

export default App
