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
} from "@chakra-ui/react";
import { Slider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

/* ---------- Componente reutilizável do slider ---------- */
function SliderField({
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
  return (
    <Box w="100%" color="purple.700">
      <Text mb={2} fontWeight="medium">
        {label}: {value}
      </Text>

      <Slider.Root
        min={0}
        max={10}
        step={1}
        
        value={[value]}
        onValueChange={(details) => onChange(name, details.value[0])}
        width="100%"
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} />
        </Slider.Control>
      </Slider.Root>
    </Box>
  );
}

/* ---------- Página ---------- */
export default function RegisterRecord() {
  const [form, setForm] = useState({
    modulo: "",
    presenca: 5,
    energia: 5,
    clareza: 5,
    compromisso: 5,
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
        presenca: 5,
        energia: 5,
        clareza: 5,
        compromisso: 5,
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
          <SliderField
            label="Presença"
            name="presenca"
            value={form.presenca}
            onChange={handleSliderChange}
          />

          <SliderField
            label="Energia"
            name="energia"
            value={form.energia}
            onChange={handleSliderChange}
          />

          <SliderField
            label="Clareza"
            name="clareza"
            value={form.clareza}
            onChange={handleSliderChange}
          />

          <SliderField
            label="Compromisso"
            name="compromisso"
            value={form.compromisso}
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
