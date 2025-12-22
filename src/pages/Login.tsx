import { useState } from "react";
import { api } from "../services/api";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";

export default function Login({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
  const [email, setEmail] = useState("");

  async function handleLogin() {
    if (!email) return;

    const response = await api.post("/auth/login", { email });
    onLogin(response.data.token);
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box bg="white" p={8} rounded="md" shadow="md" w="100%" maxW="360px">
        <VStack >
          <Heading size="md">Modulando com Frequência</Heading>
          <Text color="gray.500">Entre com seu email</Text>

          <Input
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button colorScheme="purple" w="100%" onClick={handleLogin}>
            Entrar
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
