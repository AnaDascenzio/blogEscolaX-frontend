import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getRoleFromToken, getRoleRedirectPath } from "../../routes/redirects";
import { getUserByEmail, signIn as signInRequest } from "../../services/users.service";
import * as S from "./Login.styles";

const schema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

type FormValues = z.infer<typeof schema>;

interface LocationState {
  from?: { pathname: string };
}

export function Login() {
  const { isAuthenticated, user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (isAuthenticated) {
    const requestedPath = (location.state as LocationState | null)?.from?.pathname;
    const redirectTo = requestedPath && requestedPath !== "/" ? requestedPath : getRoleRedirectPath(user?.role);
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { token } = await signInRequest(values);
      const tokenRole = getRoleFromToken(token);
      signIn(token, tokenRole ? { role: tokenRole } : undefined);

      let role = tokenRole;
      try {
        const authenticatedUser = await getUserByEmail(values.email);
        signIn(token, authenticatedUser);
        role = authenticatedUser.role;
      } catch {
        role = tokenRole;
      }

      const requestedPath = (location.state as LocationState | null)?.from?.pathname;
      const redirectTo = requestedPath && requestedPath !== "/" ? requestedPath : getRoleRedirectPath(role);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error("E-mail ou senha inválidos.");
      } else {
        toast.error("Não foi possível entrar. Tente novamente em instantes.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.Page>
      <S.Card>
        <S.Brand>
          <S.BrandLogo>
            <GraduationCap size={22} />
          </S.BrandLogo>
          <S.BrandText>
            <h1>Portal Escolar</h1>
            <p>Entre com sua conta para acessar o Blog Escola X</p>
          </S.BrandText>
        </S.Brand>

        <S.Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <S.Field>
            <label htmlFor="email">E-mail</label>
            <S.FieldInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@escola.com"
              $hasError={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && <S.ErrorMsg>{errors.email.message}</S.ErrorMsg>}
          </S.Field>

          <S.Field>
            <label htmlFor="password">Senha</label>
            <S.FieldInput
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              $hasError={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && <S.ErrorMsg>{errors.password.message}</S.ErrorMsg>}
          </S.Field>

          <S.BtnSubmit type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </S.BtnSubmit>
        </S.Form>
      </S.Card>
    </S.Page>
  );
}
