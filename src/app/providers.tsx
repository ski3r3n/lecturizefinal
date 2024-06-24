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
  console.log(`
  _______________________
 < Welcome to Lecturize! >
  -----------------------
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||
 `)

  console.log(atob("Tm8gcHJvYmxlbSEgSGVyZSdzIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgTWVyY2VkZXMgQ0xSIEdUUjoKClRoZSBNZXJjZWRlcyBDTFIgR1RSIGlzIGEgcmVtYXJrYWJsZSByYWNpbmcgY2FyIGNlbGVicmF0ZWQgZm9yIGl0cyBvdXRzdGFuZGluZyBwZXJmb3JtYW5jZSBhbmQgc2xlZWsgZGVzaWduLiBQb3dlcmVkIGJ5IGEgcG90ZW50IDYuMC1saXRlciBWMTIgZW5naW5lLCBpdCBkZWxpdmVycyBvdmVyIDYwMCBob3JzZXBvd2VyLgoKQWNjZWxlcmF0aW9uIGZyb20gMCB0byAxMDAga20vaCB0YWtlcyBhcHByb3hpbWF0ZWx5IDMuNyBzZWNvbmRzLCB3aXRoIGEgcmVtYXJrYWJsZSB0b3Agc3BlZWQgc3VycHJpc2luZyAzMjAga20vaC4KCkluY29ycG9yYXRpbmcgYWR2ZW50dXJlIGFlcm9keW5hbWljIGZlYXR1cmVzIGFuZCBjdXR0aW5nLWVkZ2Ugc3RhYmlsaXR5IHRlY2hub2xvZ2llcywgdGhlIENMUiBHVFIgZW5zdXJlcyBleGNlcHRpb25hbCBzdGFiaWxpdHkgYW5kIGNvbnRyb2wsIHBhcnRpY3VsYXJseSBkdXJpbmcgaGlnaC1zcGVlZCBtYW5ldXZlcnMuIAoKT3JpZ2luYWxseSBwcmljZWQgYXQgYXJvdW5kICQxLjUgbWlsbGlvbiwgdGhlIE1lcmNlZGVzIENMUiBHVFIgaXMgY29uc2lkZXJlZCBvbmUgb2YgdGhlIG1vc3QgZXhjbHVzaXZlIGFuZCBwcmVzdGlnaW91cyByYWNpbmcgY2FycyBldmVyIHByb2R1Y2VkLiAKCkl0cyBsaW1pdGVkIHByb2R1Y3Rpb24gcnVuIG9mIGp1c3QgZml2ZSB1bml0cyBhZGRzIHRvIGl0cyByYXJpdHksIG1ha2luZyBpdCBoaWdobHkgc291Z2h0IGFmdGVyIGJ5IHJhY2luZyBlbnRodXNpYXN0cyBhbmQgY29sbGVjdG9ycyB3b3JsZHdpZGUuIA=="));

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
