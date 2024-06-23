"use client";

import { ChakraProvider, Box, Progress } from "@chakra-ui/react";
import { useLoading, LoadingProvider } from "@/app/hooks/LoadingContext"; // Ensure path is correct
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { NavigationEvents } from "@/app/utils/NavigationEvents"; // Ensure path is correct
import { UserProvider } from "@/app/hooks/UserContext";
import NewNavbar from "@/components/NewNavbar";
import Footer from "@/components/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useLoading();
  console.log(isLoading);

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
              <NewNavbar />
              <Box p={4}>{children}</Box>
              <Footer />

              <Suspense fallback={<div>Loading...</div>}>
                <NavigationEvents />
              </Suspense>
            </Box>
          </UserProvider>
        ) : (
          <>
            {children}
            <Footer />
          </>
        )}
      </LoadingProvider>
    </ChakraProvider>
  );
}
