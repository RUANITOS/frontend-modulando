import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  Icon,
  Box,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";

export function HelpTooltip({ text }: { text: string }) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <Box display="inline-flex" alignItems="center" cursor="help">
          <Icon
            as={FaQuestionCircle}
            color="purple.400"
            _hover={{ color: "purple.600" }}
          />
        </Box>
      </TooltipTrigger>

      <TooltipContent
        bg="purple.600"
        color="white"
        fontSize="sm"
        p={3}
        borderRadius="md"
        zIndex="tooltip"
        position="fixed"
        pointerEvents="none"
      >
        {text}
      </TooltipContent>
    </TooltipRoot>
  );
}
