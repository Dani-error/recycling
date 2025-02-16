export interface Item {
    id: number;
    type: string;
    image: string;
}

export interface Bin {
    type: string,
    displayName: string
    image: string
    color: string
}

export interface GameState {
  playing: boolean
  health: number;
  score: number;
  timeLeft: number;
  items: Item[];
}

export interface Difficulty {
    name: string
    maxHealth: number
    maxTime: number
    maxItems: number
}