export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  category: string;
  gender: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  new_arrival?: boolean;
  created_at?: string;
}

export const categories = [
  "All",
  "Dresses",
  "Gowns",
  "Costumes",
  "Traditional Wear",
  "Skirts & Tops",
  "Jumpsuits",
  "Accessories",
];

export const genders = ["All", "Womens", "Kids"];

export const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "4", "6", "8", "10", "12"];

export const colorSwatches: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  ivory: "#FFFFF0",
  navy: "#001f3f",
  "royal blue": "#1B3FA0",
  blue: "#0074D9",
  "blue print": "#2F5C9E",
  "dusty rose": "#C18E96",
  blush: "#E8B4BC",
  pink: "#F4A6C6",
  "floral pink": "#F19EBE",
  "floral blue": "#7FB3D5",
  "floral yellow": "#F1D27A",
  lilac: "#C8A2D8",
  sage: "#9CAF88",
  emerald: "#0F6E4F",
  green: "#2ECC40",
  "green print": "#3A8C5C",
  wine: "#5E1B2E",
  burgundy: "#85144b",
  maroon: "#5C1A21",
  red: "#D7263D",
  "red print": "#C13B4A",
  champagne: "#F1DDB9",
  gold: "#C9A227",
  camel: "#C19A6B",
  orange: "#FF7A00",
  "orange print": "#E07A3A",
  purple: "#7A3E9D",
  "purple print": "#8A4FA0",
  multicolor: "linear-gradient(45deg, #E8B4BC, #C9836B, #5B2C49)",
};

export function getColorSwatch(color: string): string {
  return colorSwatches[color.toLowerCase()] || "#cccccc";
}
