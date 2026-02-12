import { useState } from "react";
import { api } from "../services/api";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-BUYNVaTL.png";

type FlowState = "idle" | "not-found" | "first-access" | "login";

export default function Login({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [flow, setFlow] = useState<FlowState>("idle");

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkEmail() {
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/auth/check-email", {
        params: { email },
      });

      if (!data.exists) {
        setFlow("not-found");
      } else if (data.firstAccess) {
        setFlow("first-access");
      } else {
        setFlow("login");
      }
    } catch {
      setError("Erro ao verificar email");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userName", data.user.nome);

      onLogin(data.token);
      navigate("/dashboard");
    } catch {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  async function handleFirstAccess() {
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // cria senha + completa cadastro
      await api.post("/auth/first-access", {
        email,
        nome,
        cpf,
        dataNascimento,
        password,
        confirmPassword,
      });

      // login automático após primeiro acesso
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userName", data.user.nome);

      onLogin(data.token);
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Erro ao finalizar cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(129, 90, 213, 0.09)"
    >
      <Box bg="white" p={8} rounded="md" shadow="md" w="100%" maxW="360px">
        <VStack>
          <img src={logo} alt="Logo" style={{ height: 48 }} />

          <Heading size="md">Modulando com Frequência</Heading>

          <Input
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmail}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkEmail();
              }
            }}
          />

          {flow === "not-found" && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              Este email não foi encontrado em nossa base de dados.
              <br /><br />
              Em caso de dúvidas, entre em contato com o suporte do programa
              pelo contato modulacaoquantica@gmail.com
            </Text>
          )}

          {flow === "login" && (
            <>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                colorScheme="purple"
                variant="outline"
                w="100%"
                color="purple.700"
                borderColor={"purple"}
                bg={"white"}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Entrar"}
              </Button>
            </>
          )}

          {flow === "first-access" && (
            
            <>
            
              <Input
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <Input
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />

              <Input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                placeholder="Data de Nascimento"
              />

              <Input
                type="password"
                placeholder="Crie sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                colorScheme="purple"
                variant="outline"
                w="100%"
                color="purple.700"
                borderColor={"purple"}
                bg={"white"}
                onClick={handleFirstAccess}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Finalizar cadastro"}
              </Button>
            </>
          )}

          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}

          {flow === "idle" && (
            <Text color="gray.500" fontSize="sm">
              Informe seu email para continuar
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
