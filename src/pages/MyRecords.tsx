/* eslint-disable @typescript-eslint/no-explicit-any */
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

  function getScoreColor(score: number, max: number) {
    const ratio = score / max;

    if (ratio >= 0.75) return "green";
    if (ratio >= 0.5) return "purple";
    return "pink";
  }
  function formatLabel(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  type Causa = {
    causaId: string;
    nota: number;
    subcausas?: string[];
  };


  function getMetrics(record: any) {
    const causas: Causa[] = record.causas ?? [];

    if (causas.length > 0) {
      return causas.map((c) => ({
        label: formatLabel(c.causaId),
        value: c.nota,
        max: 5,
        subcausas: c.subcausas ?? [],
      }));
    }

    // 🔙 fallback de segurança (caso algum registro antigo exista)
    return [];
  }

  return (
    <Box minH="100vh" py={10} px={4}>
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
                key={r.registroId}
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
                <Box mb={5}>
                  <Heading size="md" mb={2} color="purple.700">
                    {r.moduloId}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {r.data
                      ? new Date(r.data).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Data não disponível"}
                  </Text>
                </Box>

                <SimpleGrid columns={{ base: 2, md: 5 }} mb={5}>
                  {getMetrics(r).map((metric) => (
                    <Box key={metric.label}>
                      <Text
                        fontSize="xs"
                        color="gray.600"
                        mb={1}
                        fontWeight="medium"
                      >
                        {metric.label}
                      </Text>

                      <Badge
                        colorScheme={getScoreColor(metric.value, metric.max)}
                        fontSize="lg"
                        px={3}
                        py={2}
                        rounded="lg"
                        bg={"white"}
                      >
                        {metric.value}/{metric.max}
                      </Badge>
                    </Box>
                  ))}
                </SimpleGrid>

                {r.emocao && (
                  <Box mb={4} p={4} bg="white" rounded="xl">
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
                    bg={"white"}
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
