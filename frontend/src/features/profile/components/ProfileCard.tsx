import { useState } from "react"
import { LogOut, Mail, User } from "lucide-react"

import { TextField } from "@/components/form-fields"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useLogout } from "@/features/auth/hooks"

import { useUserMe, useUpdateUserName } from "../hooks"
import { getInitials } from "../utils"

/**
 * ProfileCard - User profile card with editable name field.
 * Matches the design from the Figma screenshot.
 */
function ProfileCard() {
  const { data: user, isLoading: isLoadingUser } = useUserMe()
  const updateUserName = useUpdateUserName()
  const logout = useLogout()

  // Use key to reset form when user changes
  const userName = user?.name ?? ""

  return (
    <ProfileCardForm
      key={userName}
      userName={userName}
      userEmail={user?.email ?? ""}
      isLoadingUser={isLoadingUser && !user}
      updateUserName={updateUserName}
      logout={logout}
    />
  )
}

interface ProfileCardFormProps {
  userName: string
  userEmail: string
  isLoadingUser: boolean
  updateUserName: ReturnType<typeof useUpdateUserName>
  logout: ReturnType<typeof useLogout>
}

/**
 * Inner form component with controlled state.
 * Uses key prop on parent to reset when user changes.
 */
function ProfileCardForm({
  userName,
  userEmail,
  isLoadingUser,
  updateUserName,
  logout,
}: ProfileCardFormProps) {
  // Local form state - initialized from props
  const [name, setName] = useState(userName)

  const initials = userName ? getInitials(userName) : ""

  // Validation
  const trimmedName = name.trim()
  const isNameValid = trimmedName.length >= 2
  const hasChanges = userName !== trimmedName
  const canSave = isNameValid && hasChanges && !updateUserName.isPending

  const handleSave = () => {
    if (!canSave) return
    updateUserName.mutate(trimmedName)
  }

  const handleLogout = () => {
    logout.mutate()
  }

  // Loading state
  if (isLoadingUser) {
    return (
      <Card className="w-full max-w-[448px] p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Skeleton avatar */}
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
          {/* Skeleton text */}
          <div className="space-y-2 text-center">
            <div className="mx-auto h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-[448px] p-8">
      <div className="flex flex-col space-y-8">
        {/* Header: Avatar + Name + Email */}
        <div className="flex flex-col items-center space-y-3">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl font-medium leading-10 text-gray-800">
            {initials}
          </div>
          {/* Name */}
          <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
          {/* Email */}
          <p className="text-base font-normal text-gray-500">{userEmail}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Nome completo */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-700">
              Nome completo
            </Label>
            <TextField
              icon={<User className="size-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              disabled={updateUserName.isPending}
            />
          </div>

          {/* E-mail (disabled) */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-700">E-mail</Label>
            <TextField
              icon={<Mail className="size-4" />}
              value={userEmail}
              disabled
              readOnly
              className="opacity-50"
            />
            <p className="text-xs text-gray-500">
              O e-mail não pode ser alterado
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Save Button */}
          <Button
            className="h-12 w-full rounded-lg"
            onClick={handleSave}
            disabled={!canSave}
          >
            {updateUserName.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="h-12 w-full rounded-lg text-red-600 hover:text-red-700"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="size-4 text-red-600" />
            {logout.isPending ? "Saindo..." : "Sair da conta"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export { ProfileCard }
