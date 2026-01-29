import {
  type LucideIcon,
  // Finance & Money
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  // Categories - Common
  ShoppingCart,
  ShoppingBag,
  Utensils,
  Coffee,
  Wine,
  Pizza,
  // Transport
  Car,
  Bus,
  Plane,
  Train,
  Bike,
  Fuel,
  // Home & Utilities
  Home,
  Lightbulb,
  Droplet,
  Flame,
  Wifi,
  Tv,
  Sofa,
  // Health & Wellness
  Heart,
  Pill,
  Stethoscope,
  Activity,
  Dumbbell,
  // Education & Work
  GraduationCap,
  Book,
  BookOpen,
  Briefcase,
  Laptop,
  // Entertainment & Leisure
  Gamepad2,
  Music,
  Film,
  Camera,
  Headphones,
  PartyPopper,
  // Personal
  User,
  Users,
  Baby,
  Dog,
  Cat,
  Gift,
  Shirt,
  Scissors,
  // Travel
  MapPin,
  Globe,
  Luggage,
  Palmtree,
  // Services
  Phone,
  Smartphone,
  Mail,
  FileText,
  // Other
  Tag,
  Star,
  Sparkles,
  CircleDollarSign,
  CircleHelp,
  Layers,
  FolderOpen,
} from "lucide-react"

/**
 * Icon registry mapping string keys to Lucide icon components.
 * Used for dynamic icon rendering based on Category.icon field.
 */
const iconRegistry: Record<string, LucideIcon> = {
  // Finance & Money
  wallet: Wallet,
  "credit-card": CreditCard,
  banknote: Banknote,
  "piggy-bank": PiggyBank,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  receipt: Receipt,

  // Categories - Shopping & Food
  "shopping-cart": ShoppingCart,
  "shopping-bag": ShoppingBag,
  utensils: Utensils,
  coffee: Coffee,
  wine: Wine,
  pizza: Pizza,

  // Transport
  car: Car,
  bus: Bus,
  plane: Plane,
  train: Train,
  bike: Bike,
  fuel: Fuel,

  // Home & Utilities
  home: Home,
  lightbulb: Lightbulb,
  droplet: Droplet,
  flame: Flame,
  wifi: Wifi,
  tv: Tv,
  sofa: Sofa,

  // Health & Wellness
  heart: Heart,
  pill: Pill,
  stethoscope: Stethoscope,
  activity: Activity,
  dumbbell: Dumbbell,

  // Education & Work
  "graduation-cap": GraduationCap,
  book: Book,
  "book-open": BookOpen,
  briefcase: Briefcase,
  laptop: Laptop,

  // Entertainment & Leisure
  gamepad: Gamepad2,
  music: Music,
  film: Film,
  camera: Camera,
  headphones: Headphones,
  "party-popper": PartyPopper,

  // Personal
  user: User,
  users: Users,
  baby: Baby,
  dog: Dog,
  cat: Cat,
  gift: Gift,
  shirt: Shirt,
  scissors: Scissors,

  // Travel
  "map-pin": MapPin,
  globe: Globe,
  luggage: Luggage,
  palmtree: Palmtree,

  // Services
  phone: Phone,
  smartphone: Smartphone,
  mail: Mail,
  "file-text": FileText,

  // Other
  tag: Tag,
  star: Star,
  sparkles: Sparkles,
  "circle-dollar-sign": CircleDollarSign,
  layers: Layers,
  "folder-open": FolderOpen,
}

/**
 * Default fallback icon when the requested key is not found
 */
const FallbackIcon: LucideIcon = CircleHelp

/**
 * Get an icon component by its string key.
 * Returns a fallback icon (CircleHelp) if the key is not found.
 *
 * @param key - The icon key (e.g., "wallet", "shopping-cart", "home")
 * @returns The corresponding Lucide icon component
 *
 * @example
 * ```tsx
 * import { getIcon } from "@/lib/iconRegistry"
 *
 * const category = { icon: "shopping-cart", title: "Compras" }
 * const Icon = getIcon(category.icon)
 *
 * return <Icon className="size-5 text-primary" />
 * ```
 */
export function getIcon(key: string | undefined | null): LucideIcon {
  if (!key) return FallbackIcon
  return iconRegistry[key.toLowerCase()] ?? FallbackIcon
}

/**
 * Check if an icon key exists in the registry
 *
 * @param key - The icon key to check
 * @returns true if the icon exists, false otherwise
 */
export function hasIcon(key: string): boolean {
  return key.toLowerCase() in iconRegistry
}

/**
 * Get all available icon keys
 *
 * @returns Array of all registered icon keys
 */
export function getIconKeys(): string[] {
  return Object.keys(iconRegistry)
}

export { iconRegistry, FallbackIcon }
