import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { LogIn, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"

import { AuthCard, AuthDivider, AuthLayout } from "@/components/auth"
import { PasswordField, TextField } from "@/components/form-fields"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRegister } from "@/features/auth/hooks"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/forms/schemas"
import { isAuthenticated } from "@/lib/auth"

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/app" })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const register = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    register.mutate(values)
  }

  const isPending = register.isPending

  return (
    <AuthLayout>
      <AuthCard
        title="Criar conta"
        subtitle="Comece a controlar suas finanças ainda hoje"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <TextField
                      icon={<User className="size-4" />}
                      type="text"
                      placeholder="Seu nome completo"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <TextField
                      icon={<Mail className="size-4" />}
                      type="email"
                      placeholder="mail@exemplo.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordField
                      placeholder="Digite sua senha"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A senha deve ter no mínimo 8 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <AuthDivider />

            <p className="text-muted-foreground text-center text-sm">
              Já tem uma conta?
            </p>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">
                <LogIn className="size-4" />
                Fazer login
              </Link>
            </Button>
          </form>
        </Form>
      </AuthCard>
    </AuthLayout>
  )
}
