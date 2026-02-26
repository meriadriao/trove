type PlantItem = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  price: number;
};

export const AVAILABLE_PLANTS: PlantItem[] = [
  {
    id: "small-plant-1",
    name: "Pink flowers",
    price: 30,
    width: 41,
    height: 55,
    src: "/src/assets/plants/small plant 1.svg"
  },
  {
    id: "small-plant-2",
    name: "Dwarf Saplera",
    price: 30,
    width: 63,
    height: 53,
    src: "/src/assets/plants/small plant 2.svg"
  },
  {
    id: "small-plant-3",
    name: "Echeveria Red Velvet",
    price: 20,
    width: 55,
    height: 55,
    src: "/src/assets/plants/small plant 3.svg"
  },
  {
    id: "small-plant-4",
    name: "Small cactus",
    price: 20,
    width: 31,
    height: 63,
    src: "/src/assets/plants/small plant 4.svg"
  },
  {
    id: "small-plant-5",
    name: "Pilea peperomioides",
    price: 30,
    width: 85,
    height: 71,
    src: "/src/assets/plants/small plant 5.svg"
  },
  {
    id: "tall-plant-1",
    name: "Lavander",
    price: 50,
    width: 43,
    height: 97,
    src: "/src/assets/plants/tall plant 1.svg"
  },
  {
    id: "tall-plant-2",
    name: "Zamioculca",
    price: 50,
    width: 55,
    height: 109,
    src: "/src/assets/plants/tall plant 2.svg"
  },
  {
    id: "tall-plant-3",
    name: "Snake plant",
    price: 40,
    width: 55,
    height: 109,
    src: "/src/assets/plants/tall plant 3.svg"
  },
  {
    id: "tall-plant-4",
    name: "Calendula",
    price: 50,
    width: 51,
    height: 115,
    src: "/src/assets/plants/tall plant 4.svg"
  },
  {
    id: "trinket-1",
    name: "Totoro figurine",
    price: 50,
    width: 31,
    height: 35,
    src: "/src/assets/plants/trinket 1.svg"
  },
  {
    id: "trinket-2",
    name: "Green candle",
    price: 20,
    width: 19,
    height: 29,
    src: "/src/assets/plants/trinket 2.svg"
  }
];