"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithHeader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
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
        <SidebarWithHeader>{children}</SidebarWithHeader>
      </Box>
    </ChakraProvider>
  );
}
