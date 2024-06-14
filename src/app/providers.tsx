"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current pathname starts with /dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <ChakraProvider>
      {isDashboard ? (
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
      ) : (
        children
      )}
    </ChakraProvider>
  );
}
