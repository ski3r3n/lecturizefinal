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
  TabPanel,
  Link,
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

export default function Navbar(props) {
  if (props.loggedin == "1") {
    return (
      <Tabs
        zIndex={100}
        pos="fixed"
        w="100%"
        background="white"
        colorScheme="blue"
        variant="line"
      >
        <TabList>
          <Link href="/dashboard">
            <Tab aria-selected="true">
              <Image
                height="50"
                width="50"
                alt="Oh no! The icon isn't loading!"
                src="/audionotesbgless.png"
              ></Image>
              Lecturise
            </Tab>
          </Link>
          <Link marginLeft="auto" display="fex" href="/dashboard/recordings">
            <Tab marginLeft="auto">Recordings</Tab>
          </Link>
          <Link display="fex" href="/">
            <Tab marginLeft="auto">Logout</Tab>
          </Link>
        </TabList>
      </Tabs>
    );
  } else {
    return (
      <Tabs
        zIndex={100}
        pos="fixed"
        w="100%"
        background="white"
        colorScheme="blue"
        variant="line"
      >
        <TabList>
          <Link href="/">
            <Tab aria-selected="true">
              <Image
                height="50"
                width="50"
                alt="Oh no! The icon isn't loading!"
                src="/audionotesbgless.png"
              ></Image>
              Lecturise
            </Tab>
          </Link>
          <Link marginLeft="auto" display="fex" href="/about">
            <Tab marginLeft="auto">About</Tab>
          </Link>
          <Link display="fex" href="/login">
            <Tab marginLeft="auto">Login</Tab>
          </Link>
        </TabList>
      </Tabs>
    );
  }
}
