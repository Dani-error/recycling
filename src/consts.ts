import { Bin, Difficulty, Item } from "./typings";

export const items: Item[] = [
    // Plastic Items
    { id: 1, type: "plastic", image: "./item/plastic-bottle.png" },
    { id: 2, type: "plastic", image: "/item/plastic-bag.png" },
    { id: 3, type: "plastic", image: "/item/plastic-cup.png" },
    { id: 4, type: "plastic", image: "/item/metal-can.png" },

    // Glass Items
    { id: 5, type: "glass", image: "/item/glass-bottle.png" },
    { id: 6, type: "glass", image: "/item/glass-jar.png" },
    { id: 7, type: "glass", image: "/item/wine-bottle.png" },
    { id: 8, type: "glass", image: "/item/jam-jar.png" },

    // Paper Items
    { id: 9, type: "paper", image: "/item/paper-bag.png" },
    { id: 10, type: "paper", image: "/item/newspaper.png" },
    { id: 11, type: "paper", image: "/item/cardboard-box.png" },
    { id: 12, type: "paper", image: "/item/paper-ball.png" },
];

export const bins: Bin[] = [
    { type: "plastic", displayName: "Plastic", image: "./bin/plastic-bin.png", color: "bg-yellow-600" },
    { type: "glass", displayName: "Glass", image: "./bin/glass-bin.png", color: "bg-green-600" },
    { type: "paper", displayName: "Paper", image: "./bin/paper-bin.png", color: "bg-blue-600" }
]

export const difficulties: Difficulty[] = [
    { name: "Easy", maxHealth: 3, maxTime: 30, maxItems: 12 },
    { name: "Medium", maxHealth: 2, maxTime: 20, maxItems: 12 },
    { name: "Hard", maxHealth: 1, maxTime: 15, maxItems: 12 }
]