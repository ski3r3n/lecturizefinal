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
        bgColor="#f3f5f8"
      >
        <SidebarWithHeader> </SidebarWithHeader>
        <Box display="flex" flexWrap="wrap" flexDirection="column" ml="250px">
          <Heading margin="auto" mt="20vh" mb="20px">
            Record
          </Heading>
          <Button
            onClick={() => {
              if (recording == 0) {
                document.getElementById("recordingButton").src =
                  "/soundwaves.gif";
                recording = 1;
              } else {
                document.getElementById("recordingButton").src =
                  "/voice-recording-svgrepo-com.svg";
                recording = 0;
              }
            }}
            bg="red"
            margin="auto"
            height="200px"
            width="200px"
            borderRadius="300px"
          >
            <Image
              alt="Record"
              src="/voice-recording-svgrepo-com.svg"
              id="recordingButton"
              width="100"
              height="100"
            ></Image>
          </Button>
          <Input
            margin="auto"
            mt="20px"
            w="20vw"
            placeholder="Enter note name here"
          ></Input>
        </Box>
      </Box>
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}
