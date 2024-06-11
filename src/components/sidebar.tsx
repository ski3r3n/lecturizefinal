"use client";

import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiPaperclip,
    FiStar,
    FiSettings,
    FiMic,
    FiMenu,
    FiBell,
    FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { useRouter } from 'next/navigation'
import { PrismaClient } from '@prisma/client';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


function getUserIdFromToken() {
    const token = Cookies.get('auth');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log(decoded.userId)
            return decoded.userId;  // Ensure your token has a 'userId' claim
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    }
    console.log("no token")
    console.log(Cookies.get())
    return null;
}

interface LinkItemProps {
    name: string;
    icon: IconType;
    link: string;
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: React.ReactNode;
    link: string;
}

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Notes", icon: FiPaperclip, link: "/dashboard" },
    { name: "Record", icon: FiMic, link: "/dashboard/record" },
    { name: "Favourites", icon: FiStar, link: "/dashboard" },
    { name: "Settings", icon: FiSettings, link: "/dashboard" },
];

const SidebarContent = ({ onClose, isTeacher, ...rest }: SidebarProps & { isTeacher: boolean }) => {
    // Filter link items based on the isTeacher flag
    const filteredLinkItems = LinkItems.filter(link => isTeacher || link.name !== "Record");

    return (
        <Box
            zIndex="2"
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text>
                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            {filteredLinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} link={link.link}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};


const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
    return (
        <Box
            as="a"
            href={link}
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "#2b63d9",
                    color: "white",
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const router = useRouter()

    const handleLogout = async () => {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: ""
        });
    
        if (response.ok) {
          router.push('/')
        } else {
          alert('An error has occured');
        }
      };
    return (
        <Flex
            zIndex="2"
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}>
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: "flex", md: "none" }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{ base: "0", md: "6" }}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Flex alignItems={"center"}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: "none" }}>
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    src={
                                        "https://yt3.googleusercontent.com/t8Wibx4YUK0HJaHeHhD4PR0ZQPVXB0aDqErETbONITYnnjlgJ9B9zSzFSXLwczJeyDU4EN8iXw=s176-c-k-c0x00ffffff-no-rj"
                                    }
                                />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">Kie Ren Siew</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue("white", "gray.900")}
                            borderColor={useColorModeValue(
                                "gray.200",
                                "gray.700"
                            )}>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => {handleLogout()}}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};

const SidebarWithHeader = ({ children } : any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    getUserIdFromToken()

    return (
        <>
            <Box zIndex="" bg="rgba(0,0,0,0)">
                <SidebarContent
                    onClose={() => onClose}
                    display={{ base: "none", md: "block" }}
                    isTeacher={false}
                />
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full">
                    <DrawerContent>
                        <SidebarContent onClose={onClose} isTeacher={false} />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav onOpen={onOpen} />
                <Box ml={{ base: 0, md: 60 }} p="4">
                    {children}
                </Box>
            </Box>
        </>
    );
};

export default SidebarWithHeader;
