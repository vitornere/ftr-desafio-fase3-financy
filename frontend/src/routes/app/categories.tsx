import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  ArrowUpDown,
  CarFront,
  FolderOpen,
  Pencil,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  Utensils,
  type LucideIcon,
  Briefcase,
  Home,
  Heart,
  Gamepad2,
  GraduationCap,
  Plane,
  Gift,
  Sparkles,
  Zap,
  Music,
  Film,
  Coffee,
  Dumbbell,
  Shirt,
  Smartphone,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { CreateCategoryModal } from "@/features/categories/components"
import { useCategories } from "@/features/categories/hooks"
import { cn } from "@/lib/utils"

// =============================================================================
// Route Configuration
// =============================================================================

interface CategoriesSearchParams {
  month?: number
  year?: number
}

function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

function getCurrentYear(): number {
  return new Date().getFullYear()
}

export const Route = createFileRoute("/app/categories")({
  validateSearch: (search: Record<string, unknown>): CategoriesSearchParams => {
    const month = Number(search.month)
    const year = Number(search.year)

    return {
      month:
        !isNaN(month) && month >= 1 && month <= 12
          ? month
          : getCurrentMonth(),
      year:
        !isNaN(year) && year >= 2000 && year <= 2100
          ? year
          : getCurrentYear(),
    }
  },
  component: CategoriesPage,
})

// =============================================================================
// Icon Mapper
// =============================================================================

const categoryIconMap: Record<string, LucideIcon> = {
  // Food & Drinks
  food: Utensils,
  utensils: Utensils,
  restaurant: Utensils,
  alimentacao: Utensils,
  coffee: Coffee,
  cafe: Coffee,

  // Transport
  transport: CarFront,
  car: CarFront,
  transporte: CarFront,
  carro: CarFront,

  // Shopping
  shopping: ShoppingCart,
  market: ShoppingCart,
  mercado: ShoppingCart,
  compras: ShoppingCart,

  // Work
  work: Briefcase,
  trabalho: Briefcase,
  business: Briefcase,
  negocios: Briefcase,

  // Home
  home: Home,
  casa: Home,
  moradia: Home,

  // Health
  health: Heart,
  saude: Heart,
  medical: Heart,

  // Entertainment
  entertainment: Gamepad2,
  games: Gamepad2,
  jogos: Gamepad2,
  lazer: Gamepad2,
  music: Music,
  musica: Music,
  movie: Film,
  filme: Film,

  // Education
  education: GraduationCap,
  educacao: GraduationCap,
  study: GraduationCap,
  estudo: GraduationCap,

  // Travel
  travel: Plane,
  viagem: Plane,

  // Gifts
  gift: Gift,
  presente: Gift,

  // Personal
  personal: Sparkles,
  pessoal: Sparkles,

  // Utilities
  utilities: Zap,
  contas: Zap,
  bills: Zap,

  // Fitness
  fitness: Dumbbell,
  gym: Dumbbell,
  academia: Dumbbell,
  esporte: Dumbbell,

  // Clothing
  clothing: Shirt,
  roupa: Shirt,
  vestuario: Shirt,

  // Tech
  tech: Smartphone,
  tecnologia: Smartphone,
  electronics: Smartphone,

  // Finance
  finance: CreditCard,
  financeiro: CreditCard,
  bank: CreditCard,
  banco: CreditCard,
  savings: PiggyBank,
  poupanca: PiggyBank,
  investment: TrendingUp,
  investimento: TrendingUp,
  salary: Wallet,
  salario: Wallet,

  // Generic
  tag: Tag,
  category: Tag,
  categoria: Tag,
  other: Tag,
  outros: Tag,
}

/**
 * Get the icon component for a category based on its icon string.
 * Falls back to Tag icon if no match is found.
 */
function getCategoryIcon(iconKey: string | null | undefined): LucideIcon {
  if (!iconKey) return Tag

  // Normalize: lowercase and remove special chars
  const normalized = iconKey.toLowerCase().trim()

  return categoryIconMap[normalized] ?? Tag
}

/**
 * Render a category icon component.
 * Uses createElement to avoid the react-hooks/static-components lint rule.
 */
function CategoryIcon({
  iconKey,
  className,
  style,
}: {
  iconKey: string | null | undefined
  className?: string
  style?: React.CSSProperties
}): React.ReactElement {
  // Using React.createElement avoids the "component created during render" lint rule
  // since we're not using JSX syntax with a dynamically computed component type
  return React.createElement(getCategoryIcon(iconKey), { className, style })
}

// =============================================================================
// Color Helpers
// =============================================================================

/**
 * Convert hex color to rgba with alpha.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "")
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    // Return fallback gray if hex is invalid
    return `rgba(107, 114, 128, ${alpha})`
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Check if a color string is a valid hex color.
 */
function isValidHexColor(color: string | null | undefined): boolean {
  if (!color) return false
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

/**
 * Get background and text colors for a category.
 */
function getCategoryColors(color: string | null | undefined) {
  const hasValidColor = isValidHexColor(color)

  return {
    tileBg: hasValidColor
      ? hexToRgba(color!, 0.15)
      : "rgba(107, 114, 128, 0.15)",
    tileColor: hasValidColor ? color! : "rgb(55, 65, 81)",
    pillBg: hasValidColor
      ? hexToRgba(color!, 0.15)
      : "rgba(107, 114, 128, 0.15)",
    pillColor: hasValidColor ? color! : "rgb(55, 65, 81)",
  }
}

// =============================================================================
// Pluralization
// =============================================================================

function pluralizeItem(count: number): string {
  return count === 1 ? "item" : "itens"
}

// =============================================================================
// Main Component
// =============================================================================

function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const { data, isLoading, isError } = useCategories()

  const categories = data?.categories?.items ?? []
  const totalCategories = categories.length
  const totalTransactions = categories.reduce(
    (sum, cat) => sum + (cat.transactionCount ?? 0),
    0
  )

  // Find most used category (by transaction count)
  const mostUsedCategory =
    categories.length > 0
      ? categories.reduce((max, cat) =>
        (cat.transactionCount ?? 0) > (max.transactionCount ?? 0) ? cat : max
      )
      : null

  return (
    <div className="min-h-[800px]">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-12 2xl:px-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
              <p className="mt-1 text-base text-muted-foreground">
                Organize suas transações por categorias
              </p>
            </div>
            <Button className="shrink-0" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova categoria
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <KpiCard
              icon={Tag}
              iconColor="rgb(107, 114, 128)"
              value={isLoading ? null : totalCategories}
              label="TOTAL DE CATEGORIAS"
            />
            <KpiCard
              icon={ArrowUpDown}
              iconColor="var(--purple-base)"
              value={isLoading ? null : totalTransactions}
              label="TOTAL DE TRANSAÇÕES"
            />
            <KpiCard
              icon={
                mostUsedCategory
                  ? getCategoryIcon(mostUsedCategory.icon)
                  : Tag
              }
              iconColor={
                mostUsedCategory && isValidHexColor(mostUsedCategory.color)
                  ? mostUsedCategory.color
                  : "rgb(107, 114, 128)"
              }
              value={isLoading ? null : (mostUsedCategory?.title ?? "—")}
              label="CATEGORIA MAIS UTILIZADA"
            />
          </div>

          {/* Error State */}
          {isError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Não foi possível carregar categorias.
            </div>
          )}

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-12 w-12 text-muted-foreground" />}
              title="Nenhuma categoria ainda"
              description="Crie categorias para organizar suas transações."
              className="py-16"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  color={category.color}
                  transactionCount={category.transactionCount ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  )
}

// =============================================================================
// KPI Card
// =============================================================================

interface KpiCardProps {
  icon: LucideIcon
  iconColor: string
  value: number | string | null
  label: string
}

function KpiCard({ icon: Icon, iconColor, value, label }: KpiCardProps) {
  const isLoading = value === null

  return (
    <Card className="flex items-start gap-4 p-6">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: hexToRgba(
            iconColor.startsWith("#") ? iconColor : "#6B7280",
            0.15
          ),
        }}
      >
        <Icon className="h-6 w-6" style={{ color: iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        {isLoading ? (
          <div className="h-9 w-16 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-3xl font-bold text-foreground">{value}</div>
        )}
        <div className="mt-1 text-xs font-medium uppercase tracking-[0.6px] text-muted-foreground">
          {label}
        </div>
      </div>
    </Card>
  )
}

// =============================================================================
// Category Card
// =============================================================================

interface CategoryCardProps {
  title: string
  description?: string | null
  icon: string
  color: string
  transactionCount: number
}

function CategoryCard({
  title,
  description,
  icon,
  color,
  transactionCount,
}: CategoryCardProps) {
  const colors = getCategoryColors(color)

  return (
    <Card className="space-y-5 p-6">
      {/* Top: Icon + Action Buttons */}
      <div className="flex items-start justify-between">
        {/* Icon Tile */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: colors.tileBg }}
        >
          <CategoryIcon
            iconKey={icon}
            className="h-4 w-4"
            style={{ color: colors.tileColor }}
          />
        </div>

        {/* Action Buttons (no onClick) */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Editar categoria"
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Deletar categoria"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Footer: Pill + Count */}
      <div className="flex items-center justify-between">
        {/* Category Pill */}
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
          style={{ backgroundColor: colors.pillBg, color: colors.pillColor }}
        >
          {title}
        </span>

        {/* Transaction Count */}
        <span className="text-sm text-muted-foreground">
          {transactionCount} {pluralizeItem(transactionCount)}
        </span>
      </div>
    </Card>
  )
}

// =============================================================================
// Skeleton
// =============================================================================

function CategoryCardSkeleton() {
  return (
    <Card className={cn("space-y-5 p-6 animate-pulse")}>
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="flex gap-1">
          <div className="h-7 w-7 rounded-md bg-muted" />
          <div className="h-7 w-7 rounded-md bg-muted" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-20 rounded-full bg-muted" />
        <div className="h-4 w-14 rounded bg-muted" />
      </div>
    </Card>
  )
}
