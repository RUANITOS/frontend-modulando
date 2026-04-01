import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPositioner,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPositioner,
  Portal,
  Icon,
  Box,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

export function HelpTooltip({ text }: { text: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const TriggerIcon = (
    <Box display="inline-flex" alignItems="center" cursor="help">
      <Icon
        as={FaQuestionCircle}
        color="purple.400"
        _hover={{ color: "purple.600" }}
      />
    </Box>
  );

  // 📱 MOBILE
  if (isMobile) {
    return (
      <PopoverRoot>
        <PopoverTrigger asChild>{TriggerIcon}</PopoverTrigger>

        <Portal>
          <PopoverPositioner>
            <PopoverContent
              bg="purple.600"
              color="white"
              fontSize="sm"
              p={3}
              borderRadius="md"
              maxW="250px"
            >
              {text}
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </PopoverRoot>
    );
  }

  // 💻 DESKTOP
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{TriggerIcon}</TooltipTrigger>

      <Portal>
        <TooltipPositioner>
          <TooltipContent
            bg="purple.600"
            color="white"
            fontSize="sm"
            p={3}
            borderRadius="md"
          >
            {text}
          </TooltipContent>
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
}
