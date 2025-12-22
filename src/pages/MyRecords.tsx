import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Badge,
  Button,
} from "@chakra-ui/react";

export default function MyRecords() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      const res = await api.get("/records", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data);
    }

    load();
  }, []);

  function getScoreColor(score: number) {
    if (score >= 8) return "green";
    if (score >= 5) return "purple";
    return "pink";
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.50, pink.50, purple.100)"
      py={10}
      px={4}
    >
      <Box maxW="1200px" mx="auto">
        <Button
          onClick={() => navigate("/dashboard")}
          mb={6}
          variant="ghost"
          colorScheme="purple"
        >
          ← Voltar ao Painel
        </Button>

        <Heading size="md" mb={4}>
          Meus Registros
        </Heading>

        {records.length === 0 ? (
          <Box
            bg="white"
            p={12}
            rounded="2xl"
            shadow="xl"
            textAlign="center"
            border="1px"
            borderColor="purple.100"
          >
            <Text fontSize="4xl" mb={4}>
              ✨
            </Text>
            <Text color="gray.500" fontSize="lg">
              Nenhum registro encontrado
            </Text>
            <Text color="gray.400" fontSize="sm" mt={2}>
              Comece registrando seu primeiro dia!
            </Text>
          </Box>
        ) : (
          <Stack>
            {records.map((r) => (
              <Box
                key={r.id}
                bg="white"
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
                <Box mb={5}>
                  <Heading size="md" mb={2} color="purple.700">
                    {r.modulo}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Data não disponível"}
                  </Text>
                </Box>

                <SimpleGrid columns={{ base: 2, md: 4 }} mb={5}>
                  <Box>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      mb={2}
                      fontWeight="medium"
                    >
                      Presença
                    </Text>
                    <Badge
                      colorScheme={getScoreColor(r.presenca)}
                      fontSize="lg"
                      px={3}
                      py={2}
                      rounded="lg"
                    >
                      {r.presenca}/10
                    </Badge>
                  </Box>

                  <Box>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      mb={2}
                      fontWeight="medium"
                    >
                      Energia
                    </Text>
                    <Badge
                      colorScheme={getScoreColor(r.energia)}
                      fontSize="lg"
                      px={3}
                      py={2}
                      rounded="lg"
                    >
                      {r.energia}/10
                    </Badge>
                  </Box>

                  <Box>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      mb={2}
                      fontWeight="medium"
                    >
                      Clareza
                    </Text>
                    <Badge
                      colorScheme={getScoreColor(r.clareza)}
                      fontSize="lg"
                      px={3}
                      py={2}
                      rounded="lg"
                    >
                      {r.clareza}/10
                    </Badge>
                  </Box>

                  <Box>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      mb={2}
                      fontWeight="medium"
                    >
                      Compromisso
                    </Text>
                    <Badge
                      colorScheme={getScoreColor(r.compromisso)}
                      fontSize="lg"
                      px={3}
                      py={2}
                      rounded="lg"
                    >
                      {r.compromisso}/10
                    </Badge>
                  </Box>
                </SimpleGrid>

                {r.emocao && (
                  <Box mb={4} p={4} bg="purple.50" rounded="xl">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="purple.700"
                      mb={1}
                    >
                      Emoção predominante
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      {r.emocao}
                    </Text>
                  </Box>
                )}

                {r.insight && (
                  <Box
                    bgGradient="linear(to-r, purple.50, pink.50)"
                    p={4}
                    rounded="xl"
                    borderLeft="4px"
                    borderColor="purple.400"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="purple.800"
                      mb={2}
                    >
                      💡 Insight do dia
                    </Text>
                    <Text fontSize="sm" color="gray.700" fontStyle="italic">
                      "{r.insight}"
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
