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
  type Metric = {
    label: string;
    value: number;
    max: number;
    description?: string;
  };
  function getMetrics(record: any): Metric[] {
    // Novo modelo: POSTURA 5D
    if (
      record.fisico !== undefined ||
      record.energetico !== undefined ||
      record.mental !== undefined
    ) {
      return [
        {
          label: "Físico",
          description: "Atividade física de qualidade",
          value: record.fisico,
          max: 5,
        },
        {
          label: "Energético",
          description: "Pausas diárias de qualidade",
          value: record.energetico,
          max: 5,
        },
        {
          label: "Emocional",
          description: "Equilíbrio emocional",
          value: record.emocional5d,
          max: 5,
        },
        {
          label: "Mental",
          description: "Clareza e decisões conscientes",
          value: record.mental,
          max: 5,
        },
        {
          label: "Espiritual",
          description: "Conexões realizadas",
          value: record.espiritual,
          max: 5,
        },
      ].filter((m) => m.value !== undefined);
    }

    // Modelo antigo
    return [
      {
        label: "Presença",
        value: record.presenca,
        description: undefined,
        max: 10,
      },
      {
        label: "Energia",
        value: record.energia,
        max: 10,
      },
      {
        label: "Clareza",
        value: record.clareza,
        max: 10,
      },
      {
        label: "Compromisso",
        value: record.compromisso,
        max: 10,
      },
    ];
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

                      {metric.description && (
                        <Text fontSize="10px" color="gray.400" mb={2}>
                          {metric.description}
                        </Text>
                      )}

                      <Badge
                        colorScheme={getScoreColor(metric.value, metric.max)}
                        fontSize="lg"
                        px={3}
                        py={2}
                        rounded="lg"
                      >
                        {metric.value}/{metric.max}
                      </Badge>
                    </Box>
                  ))}
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
