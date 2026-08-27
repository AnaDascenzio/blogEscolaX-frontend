import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { signIn as signInRequest } from "../../services/users.service";
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
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
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
    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { token } = await signInRequest(values);
      signIn(token);
      const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/";
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
          <S.Logo>
            <GraduationCap size={24} />
          </S.Logo>
          <S.Title>Portal Escolar</S.Title>
          <S.Subtitle>Entre com sua conta para acessar o Blog Escola X</S.Subtitle>
        </S.Brand>

        <S.Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <S.Field>
            <label htmlFor="email">E-mail</label>
            <S.InputWrap>
              <S.InputIcon>
                <Mail size={16} />
              </S.InputIcon>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@escola.com"
                {...register("email")}
              />
            </S.InputWrap>
            {errors.email && <S.ErrorMsg>{errors.email.message}</S.ErrorMsg>}
          </S.Field>

          <S.Field>
            <label htmlFor="password">Senha</label>
            <S.InputWrap>
              <S.InputIcon>
                <Lock size={16} />
              </S.InputIcon>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
              />
              <S.ToggleVisibility
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </S.ToggleVisibility>
            </S.InputWrap>
            {errors.password && <S.ErrorMsg>{errors.password.message}</S.ErrorMsg>}
          </S.Field>

          <S.SubmitBtn type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </S.SubmitBtn>
        </S.Form>

        <S.Footer>Use as credenciais fornecidas pela coordenação da escola.</S.Footer>
      </S.Card>
    </S.Page>
  );
}
