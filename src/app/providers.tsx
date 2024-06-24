"use client";

import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";
import { useLoading, LoadingProvider } from "@/app/hooks/LoadingContext";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { NavigationEvents } from "@/app/utils/NavigationEvents";
import { UserProvider } from "@/app/hooks/UserContext";
import NewNavbar from "@/components/NewNavbar";
import Footer from "@/components/Footer";
import { theme } from "@/app/theme";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <Box
        zIndex="1"
        display="flex"
        flexDir="column"
        position="relative"
        minHeight="100vh"
        width="100%"
        bgColor="#f3f5f8"
      >
        <NewNavbar />
        <Box flex="1" p={4} pb={"30px"} overflowY="auto">
          {children}
        </Box>
        <Footer />
        <Suspense fallback={<div>Loading...</div>}>
          <NavigationEvents />
        </Suspense>
      </Box>
    </UserProvider>
  );
}

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box flex="1" overflowX="hidden">
        {children}
      </Box>
      <Footer />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useLoading();
  console.log(isLoading);

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <ChakraProvider theme={theme}>
      <LoadingProvider>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          width="100%"
        >
          {isDashboard ? (
            <DashboardLayout>{children}</DashboardLayout>
          ) : (
            <DefaultLayout>{children}</DefaultLayout>
          )}
        </Box>
      </LoadingProvider>
    </ChakraProvider>
  );
}
