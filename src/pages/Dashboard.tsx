import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-BUYNVaTL.png";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  HStack,
  Avatar,
  Spinner,
  Popover,
  VStack,
  Portal,
} from "@chakra-ui/react";
import { api } from "../services/api";

type ModuloAtual = {
  id: string;
  nome: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [modulo, setModulo] = useState<ModuloAtual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModulo() {
      try {
        const res = await api.get<ModuloAtual>("/modules/atual");
        setModulo(res.data);
      } catch (err) {
        console.error("Erro ao carregar módulo atual", err);
      } finally {
        setLoading(false);
      }
    }

    loadModulo();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  }

  const userName =
    localStorage.getItem("userName") ??
    localStorage.getItem("email") ??
    "Usuário";

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.50, pink.50, purple.100)"
      py={10}
      px={4}
    >
      <Box maxW="1200px" mx="auto">
        {/* Header */}
        <HStack justify="space-between" mb={10}>
          <img
            src={logo}
            alt="Logo do sistema"
            style={{ height: "48px", objectFit: "contain" }}
          />
          {/* Título + módulo */}
          <Box>
            <Heading size="lg">DIÁRIO DE BORDO</Heading>

            {loading ? (
              <Spinner size="sm" mt={2} />
            ) : (
              <Text color="gray.600" mt={1}>
                Módulo atual:{" "}
                <Text as="span" fontWeight="medium" color="purple.600">
                  {modulo?.nome ?? "—"}
                </Text>
              </Text>
            )}
          </Box>
          <Popover.Root positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger>
              <Avatar.Root
                size="sm"
                bg="purple.500"
                color="white"
                cursor="pointer"
              >
                <Avatar.Fallback>
                  {userName.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content
                  w="200px"
                  bg="white"
                  border="1px solid"
                  borderColor="purple.100"
                  rounded="xl"
                  shadow="lg"
                  zIndex="popover"
                >
                  <Popover.Body>
                    <VStack align="stretch">
                      <Text fontWeight="medium" color="purple.700">
                        Olá, {userName}
                      </Text>

                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="purple"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </VStack>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </HStack>

        {/* Cards */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {/* Novo Registro */}
          <Box
            bg="rgba(129, 90, 213, 0.09)"
            p={6}
            shadow="xl"
            rounded="2xl"
            border="1px"
            borderColor="purple.100"
            _hover={{
              shadow: "2xl",
              transform: "translateY(-2px)",
              borderColor: "purple.200",
            }}
            transition="all 0.3s"
          >
            <Heading size="md" mb={3} color="purple.700">
              Como está a sua Postura de Saúde 5D hoje?
            </Heading>

            <Text color="gray.600" mb={6}>
              Registre como foi o seu dia dentro do módulo atual.
            </Text>

            <Button
              colorScheme="purple"
              variant="outline"
              w="100%"
              color="purple.700"
              borderColor={"purple"}
              onClick={() => navigate("/register")}
              bg={"white"}
            >
              Registrar agora
            </Button>
          </Box>

          {/* Meus Registros */}
          <Box
            bg="rgba(129, 90, 213, 0.09)"
            p={6}
            shadow="xl"
            rounded="2xl"
            border="1px"
            borderColor="purple.100"
            _hover={{
              shadow: "2xl",
              transform: "translateY(-2px)",
              borderColor: "purple.200",
            }}
            transition="all 0.3s"
          >
            <Heading size="md" mb={3} color="purple.700">
              Meus Registros
            </Heading>

            <Text color="gray.600" mb={6}>
              Visualize e acompanhe sua evolução ao longo do tempo.
            </Text>

            <Button
              colorScheme="purple"
              variant="outline"
              w="100%"
              color="purple.700"
              borderColor={"purple"}
              onClick={() => navigate("/records")}
              bg={"white"}
            >
              Ver histórico
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
