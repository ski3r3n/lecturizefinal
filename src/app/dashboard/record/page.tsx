import { Box, Container, Flex, VStack, Heading } from "@chakra-ui/react";
import AudioRecorder from "@/components/AudioRecorder";

export default function Dashboard() {
  return (
    <Flex bgColor="#f3f5f8" ml="0">
      <Container maxW="container.xl" flex="1" py={5}>
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">Record</Heading>
          <AudioRecorder />
        </VStack>
      </Container>
    </Flex>
  );
}
