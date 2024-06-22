"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { LoadingProvider } from "@/app/hooks/LoadingContext"; // Ensure path is correct
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { NavigationEvents } from "@/app/utils/NavigationEvents"; // Ensure path is correct
import { UserProvider } from "@/app/hooks/UserContext";
import NewNavbar from "@/components/NewNavbar";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current pathname starts with /dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <ChakraProvider>
      <LoadingProvider>
        {isDashboard ? (
          <UserProvider>
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
              <NewNavbar>{children}</NewNavbar>
              <Suspense fallback={<div>Loading...</div>}>
                <NavigationEvents />
              </Suspense>
            </Box>
          </UserProvider>
        ) : (
          children
        )}
      </LoadingProvider>
    </ChakraProvider>
  );
}
