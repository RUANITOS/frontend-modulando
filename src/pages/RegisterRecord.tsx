import { useState } from "react";
import { api } from "../services/api";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  HStack,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

/* ---------- Componente reutilizável do slider ---------- */
function StarRatingField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <Box w="100%">
      <Text mb={2} fontWeight="medium" color="purple.700">
        {label}: {value}
      </Text>

      <HStack>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive =
            hoverValue !== null ? star <= hoverValue : star <= value;

          return (
            <FaStar
              key={star}
              size={22}
              cursor="pointer"
              color={isActive ? "#6B46C1" : "#D6BCFA"} // purple.600 / purple.200
              style={{ transition: "color 0.2s ease" }}
              onClick={() => onChange(name, star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
            />
          );
        })}
      </HStack>
    </Box>
  );
}

/* ---------- Página ---------- */
export default function RegisterRecord() {
  const [form, setForm] = useState({
    modulo: "",
    fisico: 3,
    energetico: 3,
    emocional5d: 3,
    mental: 3,
    espiritual: 3,
    emocao: "",
    insight: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSliderChange(name: string, value: number) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    try {
      const token = localStorage.getItem("token");

      await api.post("/records", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Registro salvo 🚀");

      // Limpar formulário após salvar
      setForm({
        modulo: "",
        fisico: 3,
        energetico: 3,
        emocional5d: 3,
        mental: 3,
        espiritual: 3,
        emocao: "",
        insight: "",
      });
    } catch (error) {
      alert("Erro ao salvar registro ❌");
      console.error(error);
    }
  }
  const navigate = useNavigate();
  return (
    <Box bg="white" p={6} rounded="md" shadow="sm">
      <Button
        onClick={() => navigate("/dashboard")}
        mb={6}
        variant="ghost"
        colorScheme="purple"
      >
        ← Voltar ao Painel
      </Button>
      <Heading size="md" mb={4} color="purple.700">
        Registrar meu dia
      </Heading>

      <VStack>
        <Input
          name="modulo"
          placeholder="Módulo"
          value={form.modulo}
          onChange={handleChange}
        />

        <SimpleGrid columns={2} w="100%">
          <StarRatingField
            label="Físico (atividade física de qualidade – 1h/dia)"
            name="fisico"
            value={form.fisico}
            onChange={handleSliderChange}
          />

          <StarRatingField
            label="Energético (3 pausas diárias de qualidade)"
            name="energetico"
            value={form.energetico}
            onChange={handleSliderChange}
          />

          <StarRatingField
            label="Emocional (equilíbrio diante do que vivi hoje)"
            name="emocional5d"
            value={form.emocional5d}
            onChange={handleSliderChange}
          />

          <StarRatingField
            label="Mental (clareza e decisões conscientes)"
            name="mental"
            value={form.mental}
            onChange={handleSliderChange}
          />

          <StarRatingField
            label="Espiritual (3 conexões realizadas)"
            name="espiritual"
            value={form.espiritual}
            onChange={handleSliderChange}
          />
        </SimpleGrid>

        <Input
          name="emocao"
          placeholder="Emoção predominante"
          value={form.emocao}
          onChange={handleChange}
        />

        <Textarea
          name="insight"
          placeholder="Insight do dia"
          value={form.insight}
          onChange={handleChange}
        />

        <Button colorScheme="purple" w="100%" onClick={handleSubmit}>
          Salvar
        </Button>
      </VStack>
    </Box>
  );
}
