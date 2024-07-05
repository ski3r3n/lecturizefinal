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
  Card,
  Stack,
  StackDivider,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Lecturize</title>
      </Head>
      <Box bgColor="#f3f5f8" w="100vw" h="100vh" position="fixed"></Box>
      <Navbar loggedin={0}></Navbar>
      <br></br>
      <br></br>
      <br></br>

      <br></br>
      <br></br>
      <br></br>
      <Box margin="auto" w="fit-content" display="flex">
        <Heading color="red">Lecturise:&nbsp;</Heading>
        <Heading> Your lectures,&nbsp;</Heading>
        <Heading color="ForestGreen">noted.</Heading>
      </Box>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Card variant="filled" margin="auto" bgColor="white" w="50%">
        <CardHeader>
          <Heading size="xl">Lecturise is:</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="md" textTransform="uppercase">
                Effective
              </Heading>
              <Text pt="2" fontSize="sm">
                Lecturize takes notes well and does not miss a thing.
              </Text>
            </Box>
            <Box>
              <Heading size="md" textTransform="uppercase">
                Fast
              </Heading>
              <Text pt="2" fontSize="sm">
                Generate notes, and fast. It takes less than a minute.
              </Text>
            </Box>
            <Box>
              <Heading size="md" textTransform="uppercase">
                Detailed
              </Heading>
              <Text pt="2" fontSize="sm">
                Every detail gets captured in your notes.
              </Text>
            </Box>
            <Link href="/login" margin="auto" w="fit-content">
              <Button bgColor="#2b63d9" color="#ffffff">
                Log In
              </Button>
            </Link>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
