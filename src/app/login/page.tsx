"use client";
import Image from "next/image";
import {
    Button,
    ButtonGroup,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabIndicator,
    Link,
    TabPanel,
    Checkbox,
    Card,
    Stack,
    StackDivider,
    CardHeader,
    CardBody,
    CardFooter,
    Box,
    Input,
    Heading,
    Text,
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
export default function Login() {
    return (
        <>
            <Box display="flex" h="100vh" w="100vw" bg="#f3f5f8">
                <Card variant="filled" margin="auto" bgColor="white" w="30%">
                    <CardHeader display="flex">
                        <Image
                            height="50"
                            width="50"
                            alt="Oh no! The icon isn't loading!"
                            src="/audionotesbgless.png"></Image>
                        <Heading size="xl">Lecturise Login</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack divider={<StackDivider />} spacing="4">
                            <Box>
                                Username <br></br>
                                <Input
                                    mt="10px"
                                    size="sm"
                                    placeholder="Enter Username..."
                                    type="text"
                                    background="#f3f5f8"></Input>
                            </Box>
                            <Box>
                                Password <br></br>
                                <Input
                                    mt="10px"
                                    size="sm"
                                    placeholder="Enter Password..."
                                    type="password"
                                    background="#f3f5f8"></Input>
                            </Box>
                            <Box display="flex">
                                <Checkbox>Remember me</Checkbox>
                                <Link ml="auto" color={"blue.400"}>
                                    Forgot password?
                                </Link>
                            </Box>
                            <Link href="/dashboard">
                                <Button bg="#2b63d9" color="white">
                                    Login
                                </Button>
                            </Link>
                        </Stack>
                    </CardBody>
                </Card>
            </Box>
        </>
    );
}
