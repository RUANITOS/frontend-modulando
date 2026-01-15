import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  SimpleGrid,
  Text,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ---------- Tipos ---------- */
type Subcausa = {
  id: string;
  nome: string;
};

type Causa = {
  id: string;
  nome: string;
  descricao?: string;
  maxSubcausas: number;
  subcausas: Subcausa[];
};

type ModuloConfig = {
  id: string;
  nome: string;
  causas: Causa[];
};

/* ---------- Card de Causa (V3) ---------- */
function StarRatingField({
  causa,
  value,
  onChange,
}: {
  causa: Causa;
  value?: {
    nota: number;
    subcausas: string[];
    textoLivre?: string;
  };
  onChange: (data: {
    nota: number;
    subcausas: string[];
    textoLivre?: string;
  }) => void;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [showSubcauses, setShowSubcauses] = useState(false);

  const nota = value?.nota ?? 3;
  const subcausas = value?.subcausas ?? [];

  return (
    <Box
      p={5}
      rounded="2xl"
      bg="white"
      border="1px solid"
      borderColor="purple.100"
      transition="all 0.2s"
      _hover={{ boxShadow: "md", borderColor: "purple.300" }}
    >
      <Stack>
        <Box>
          <Text fontWeight="semibold" color="purple.700">
            {causa.nome}
          </Text>
          {causa.descricao && (
            <Text fontSize="sm" color="gray.500">
              {causa.descricao}
            </Text>
          )}
        </Box>

        {/* Stars */}
        <HStack>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={22}
              cursor="pointer"
              color={star <= (hoverValue ?? nota) ? "#6B46C1" : "#E9D8FD"}
              onClick={() =>
                onChange({
                  nota: star,
                  subcausas,
                  textoLivre: value?.textoLivre,
                })
              }
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
            />
          ))}
          <Text fontSize="sm" color="gray.600">
            {nota}/5
          </Text>
        </HStack>

        {/* Subcausas */}
        {causa.subcausas.length > 0 && (
          <>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="purple"
              alignSelf="flex-start"
              onClick={() => setShowSubcauses((v) => !v)}
            >
              {showSubcauses ? "Ocultar subcausas" : "Identificar subcausas"}
            </Button>

            {showSubcauses && (
              <SimpleGrid columns={2}>
                {causa.subcausas.map((sub) => (
                  <Button
                    key={sub.id}
                    size="sm"
                    variant={subcausas.includes(sub.id) ? "solid" : "outline"}
                    colorScheme="purple"
                    onClick={() => {
                      const updated = subcausas.includes(sub.id)
                        ? subcausas.filter((s) => s !== sub.id)
                        : [...subcausas, sub.id];

                      onChange({
                        nota,
                        subcausas: updated,
                        textoLivre: value?.textoLivre,
                      });
                    }}
                  >
                    {sub.nome}
                  </Button>
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}

/* ---------- Página ---------- */
export default function RegisterRecord() {
  const [moduloConfig, setModuloConfig] = useState<ModuloConfig | null>(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emocao: "",
    insight: "",
    causas: {} as Record<
      string,
      { nota: number; subcausas: string[]; textoLivre?: string }
    >,
  });

  useEffect(() => {
    async function loadModulo() {
      const token = localStorage.getItem("token");
      const { data } = await api.get<ModuloConfig>("/modules/atual", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModuloConfig(data);
    }
    loadModulo();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    const token = localStorage.getItem("token");

    await api.post(
      "/records",
      {
        emocao: form.emocao,
        insight: form.insight,
        causas: Object.entries(form.causas).map(([causaId, data]) => ({
          causaId,
          nota: data.nota,
          subcausas: data.subcausas,
          textoLivre: data.textoLivre,
        })),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Registro salvo 🚀");
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.50, pink.50, purple.100)"
      py={10}
      px={4}
    >
      <Box maxW="1200px" mx="auto">
        {/* Header */}
        <Stack mb={10}>
          <Button
            variant="ghost"
            colorScheme="purple"
            alignSelf="flex-start"
            onClick={() => navigate("/dashboard")}
          >
            ← Voltar ao Painel
          </Button>

          <Heading size="lg">Registrar meu dia</Heading>

          <Text color="gray.600" maxW="600px">
            Avalie como foi seu dia com base nas causas do módulo atual e
            registre seus sentimentos e aprendizados.
          </Text>
        </Stack>

        {/* Card principal */}
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
          <Stack>
            {/* Causas */}
            <Box mb={8}>
              <Heading size="md" mb={4} color="purple.700">
                Avaliação do dia
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }}>
                {moduloConfig?.causas.map((causa) => (
                  <StarRatingField
                    key={causa.id}
                    causa={causa}
                    value={form.causas[causa.id]}
                    onChange={(data) =>
                      setForm((prev) => ({
                        ...prev,
                        causas: { ...prev.causas, [causa.id]: data },
                      }))
                    }
                  />
                ))}
              </SimpleGrid>
            </Box>

            {/* Emoção + Insight */}
            <Box
              bg="white"
              p={6}
              rounded="2xl"
              border="1px"
              borderColor="purple.100"
              mb={6}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }}>
                {/* Emoção */}
                <Stack h="100%">
                  <Text fontWeight="semibold" color="purple.700" fontSize="sm">
                    Emoção predominante
                  </Text>

                  <Input
                    name="emocao"
                    placeholder="Ex: Calma, Ansiedade, Gratidão..."
                    value={form.emocao}
                    onChange={handleChange}
                    bg="gray.50"
                    h="48px"
                  />
                </Stack>

                {/* Insight */}
                <Stack h="100%">
                  <Text fontWeight="semibold" color="purple.700" fontSize="sm">
                    Insight do dia
                  </Text>

                  <Textarea
                    name="insight"
                    placeholder="O que você percebeu ou aprendeu hoje?"
                    value={form.insight}
                    onChange={handleChange}
                    bg="gray.50"
                    resize="none"
                    h="48px"
                  />
                </Stack>
              </SimpleGrid>
            </Box>

            {/* Botão */}
            <Button
              colorScheme="purple"
              variant="outline"
              w="100%"
              color="purple.700"
              borderColor={"purple"}
              onClick={handleSubmit}
              bg="white"
            >
              Salvar registro
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
