import { useState } from "react";
import { api } from "../services/api";
import { Box, Button, Input, Heading, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-BUYNVaTL.png";

export default function Login({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkEmail() {
    if (!email) return;

    setLoading(true);
    const response = await api.get("/auth/check-email", {
      params: { email },
    });

    setUserExists(response.data.exists);
    setLoading(false);
  }

  async function handleSubmit() {
    setLoading(true);

    const response = await api.post("/auth/login", {
      email,
      cpf,
      nome,
      dataNascimento,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("email", user.email);
    localStorage.setItem("userName", user.nome);

    onLogin(token);
    navigate("/dashboard");
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(129, 90, 213, 0.09)"
      shadow="xl"
      rounded="2xl"
      border="1px"
    >
      <Box bg="white" p={8} rounded="md" shadow="md" w="100%" maxW="360px">
        <VStack>
          <img
            src={logo}
            alt="Logo do sistema"
            style={{ height: "48px", objectFit: "contain" }}
          />
          <Heading size="md">Modulando com Frequência</Heading>

          <Input
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmail}
          />

          {userExists === true && (
            <>
              <Input
                placeholder="Senha (CPF)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                type="password"
              />

              <Button
                colorScheme="purple"
                variant="outline"
                w="100%"
                color="purple.700"
                borderColor={"purple"}
                onClick={handleSubmit}
                loading={loading}
                bg={"white"}
              >
                Entrar
              </Button>
            </>
          )}

          {userExists === false && (
            <>
              <Input
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <Input
                placeholder="CPF (somente números)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />

              <Input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />

              <Button
                colorScheme="purple"
                w="100%"
                onClick={handleSubmit}
                loading={loading}
              >
                Criar conta
              </Button>
            </>
          )}

          {userExists === null && (
            <Text color="gray.500" fontSize="sm">
              Informe seu email para continuar
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
