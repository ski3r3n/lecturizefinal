"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Progress,
  FlexProps,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { GrMicrophone } from "react-icons/gr";
import { useCookies } from "next-client-cookies";
import { useUser } from "@/app/hooks/UserContext";
import { useLoading } from "@/app/hooks/LoadingContext";
import { useRouter } from "next/navigation";
import { Image } from "@chakra-ui/react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

interface LinkItemProps {
  name: string;
  link: string;
}

interface NavLinkProps extends FlexProps {
  children: React.ReactNode;
  link: string;
}

// const Links = ["Dashboard", "Projects", "Team"];
const LinkItems: Array<LinkItemProps> = [{ name: "Notes", link: "/dashboard" }];

const NavLink = ({ children, link, ...rest }: NavLinkProps) => {
  return (
    <Link href={link}>
      <Box
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        {children}
      </Box>
    </Link>
  );
};

export default function NewNavbar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();
  const toast = useToast();
  console.log(isLoading);

  // Ensure the object structure with type assertion
  const { user, userIsLoading } = (useUser() || {
    user: null,
    userIsLoading: false,
  }) as { user: any; userIsLoading: boolean };

  const handleLogout = async () => {
    setIsLoading(true);
    toast.promise(
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      }),
      {
        loading: { title: "Signing out..." },
        success: (data) => {
          router.push("/");
          return { title: "Signed out successfully!" };
        },
        error: (data) => {
          return {
            title: "Oops! An unexpected error occurred during logout.",
            description: data.message,
          };
        },
      }
    );
  };

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="fixed" // Added fixed position
        top={0} // Stick to the top
        left={0} // Align to the left
        right={0} // Stretch across the right
        zIndex={1} // Ensure it stays on top of other content
        width="full"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Link href="/dashboard">
                <Image
                  boxSize="35px"
                  src="/assets/logo.png"
                  alt="Lecturize Logo"
                />
              </Link>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {LinkItems.map((link) => (
                <NavLink
                  key={link.name}
                  link={link.link}
                  onClick={() => setIsLoading(true)}
                >
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {user && user.role === "TEACHER" ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                  leftIcon={<AddIcon />}
                >
                  New Note
                </MenuButton>
                <MenuList>
                  <Link href="/dashboard/record">
                    <MenuItem
                      onClick={() => setIsLoading(true)}
                      icon={<GrMicrophone />}
                    >
                      Record
                    </MenuItem>
                  </Link>
                  <Link href="/dashboard/notes/create">
                    <MenuItem
                      onClick={() => setIsLoading(true)}
                      icon={<EditIcon />}
                    >
                      Custom
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            ) : (
              ""
            )}

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} name={user ? user.name : ""} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {LinkItems.map((link) => (
                <NavLink
                  key={link.name}
                  link={link.link}
                  onClick={() => setIsLoading(true)}
                >
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box mt={"64px"}>
        {isLoading ? <Progress size="xs" isIndeterminate /> : ""}
        <Box p={4}>{children}</Box>
      </Box>
    </>
  );
}
