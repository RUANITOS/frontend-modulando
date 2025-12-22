import { useNavigate } from "react-router-dom";
import { Box, Heading, SimpleGrid, Text, Button } from "@chakra-ui/react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      <Heading mb={6} >
        Meu Painel
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Box
          bg="white"
          p={6}
          rounded="md"
          shadow="sm"
          border="1px"
          color="purple.700"
          borderColor="gray.200"
          _hover={{ shadow: "md", borderColor: "purple.300" }}
          transition="all 0.2s"
        >
          <Heading size="md" mb={3}>
            Registrar Dia
          </Heading>
          <Text color="gray.600" mb={4}>
            Registre suas métricas diárias de presença, energia, clareza e
            compromisso.
          </Text>
          <Button
            colorScheme="purple"
            w="100%"
            onClick={() => navigate("/register")}
          >
            Ir para Registro
          </Button>
        </Box>

        <Box
          bg="white"
          p={6}
          rounded="md"
          shadow="sm"
          border="1px"
          borderColor="gray.200"
          _hover={{ shadow: "md", borderColor: "purple.300" }}
          transition="all 0.2s"
        >
          <Heading size="md" mb={3} color="purple.700">
            Meus Registros
          </Heading>
          <Text color="gray.600" mb={4}>
            Visualize e acompanhe todo o histórico dos seus registros diários.
          </Text>
          <Button
            colorScheme="purple"
            w="100%"
            onClick={() => navigate("/records")}
          >
            Ver Registros
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
