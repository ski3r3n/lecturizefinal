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
export default function Dashboard() {
    return (
        <>
            <Box display="flex" height="100vh" width="100vw" bgColor="#f3f5f8">
                <Navbar loggedin="1"></Navbar>
                <br></br>
                <br></br>
                <br></br>
                <Button
                    bgColor="red"
                    _hover={{
                        background: "#E99995",
                    }}
                    _active={{
                        background: "#F6D4D2",
                    }}
                    color="#ffffff"
                    margin="auto"
                    height="150px"
                    width="150px"
                    borderRadius="190px">
                    <Image
                        src="/voice-recording-svgrepo-com.svg"
                        alt="Record"
                        width="100"
                        height="100"></Image>
                </Button>
            </Box>
        </>
    );
}
