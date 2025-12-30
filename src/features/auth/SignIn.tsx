import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string({ message: "Senha deve ter pelo menos 8 caracteres" })
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn } = useAuth();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await signIn(data.email, data.password);
      toast.success("Entrou com sucesso");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Erro ao entrar");
      }
    }
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Entre na sua conta</CardTitle>
              <CardDescription>
                Digite seu email abaixo para entrar na sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, formState }) => (
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Digite seu email"
                          value={field.value}
                          onChange={field.onChange}
                        />

                        <FieldError errors={[formState.errors.email]} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, formState }) => (
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Senha</FieldLabel>
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Esqueceu sua senha?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={field.value}
                          onChange={field.onChange}
                        />

                        <FieldError errors={[formState.errors.password]} />
                      </Field>
                    )}
                  />
                  <Field>
                    <Button
                      size="lg"
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          className="animate-spin"
                        />
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                    <FieldDescription className="text-center">
                      Não tem uma conta? <a href="#">Cadastre-se</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
