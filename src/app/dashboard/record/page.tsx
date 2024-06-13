import { Box, Container, Flex, VStack, Heading } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import AudioRecorder from "@/components/AudioRecorder";

export default function Dashboard() {
  return (
    <Box
      zIndex="1"
      display="flex"
      flexDir="column"
      position="fixed"
      height="100vh"
      width="100vw"
      overflow="scroll"
      bgColor="#f3f5f8"
    >
      <SidebarWithHeader>
        <Flex minHeight="100vh" bgColor="#f3f5f8" ml="0">
          <Container maxW="container.xl" flex="1" py={5}>
            <VStack spacing={4} align="stretch">
              <Heading textAlign="center">Record</Heading>
              <AudioRecorder />
            </VStack>
          </Container>
        </Flex>
      </SidebarWithHeader>
    </Box>
  );
}
