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
import SidebarWithHeader from "@/components/sidebar";
import Navbar from "@/components/navbar";
import Recordingcard from "@/components/recordingcard";
import AudioRecorder from "@/components/audiorecorder";
import AudioRecorder2 from "@/components/audiorecorder2";
export default function Dashboard() {
    var recording = 0;
    return (
        <>
            <Box
                zIndex="1"
                display="flex"
                flexDir="column"
                position="fixed"
                height="100vh"
                width="100vw"
                bgColor="#f3f5f8">
                <SidebarWithHeader> </SidebarWithHeader>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    flexDirection="column"
                    ml="250px">
                    <Heading margin="auto" mt="20vh" mb="20px">
                        Record
                    </Heading>
                    <AudioRecorder2></AudioRecorder2>
                </Box>
                <br></br>
                <br></br>
                <br></br>
            </Box>
        </>
    );
}
