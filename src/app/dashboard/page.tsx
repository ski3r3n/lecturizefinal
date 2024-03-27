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
    return (
        <>
            <Box zIndex="1"
                display="flex"
                flexDir="column"
                position="fixed"
                height="100vh"
                width="100vw"
                bgColor="#f3f5f8">
                <SidebarWithHeader>
                    <Box display="flex" flexWrap="wrap" ml="250px">
                        <Recordingcard
                            title="Lorem Ipsum"
                            preview="Dolor sit amet, consectetur adipiscing elit. Phasellus quis libero mauris. Integer at nisl sed lectus congue posuere. Etiam et sodales risus. Aliquam scelerisque tempor suscipit. Pellentesque feugiat quam ac pretium tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tempor, massa eget sollicitudin placerat, massa sapien ornare diam, sed cursus lorem purus sed tellus."
                            creator="Richard McClintock"></Recordingcard>
                        <Recordingcard
                            title="Lorem Ipsum"
                            preview="Dolor sit amet, consectetur adipiscing elit. Phasellus quis libero mauris. Integer at nisl sed lectus congue posuere. Etiam et sodales risus. Aliquam scelerisque tempor suscipit. Pellentesque feugiat quam ac pretium tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tempor, massa eget sollicitudin placerat, massa sapien ornare diam, sed cursus lorem purus sed tellus."
                            creator="Richard McClintock"></Recordingcard>
                        <Recordingcard
                            title="Lorem Ipsum"
                            preview="Dolor sit amet, consectetur adipiscing elit. Phasellus quis libero mauris. Integer at nisl sed lectus congue posuere. Etiam et sodales risus. Aliquam scelerisque tempor suscipit. Pellentesque feugiat quam ac pretium tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tempor, massa eget sollicitudin placerat, massa sapien ornare diam, sed cursus lorem purus sed tellus."
                            creator="Richard McClintock"></Recordingcard>
                        <Recordingcard
                            title="Lorem Ipsum"
                            preview="Dolor sit amet, consectetur adipiscing elit. Phasellus quis libero mauris. Integer at nisl sed lectus congue posuere. Etiam et sodales risus. Aliquam scelerisque tempor suscipit. Pellentesque feugiat quam ac pretium tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tempor, massa eget sollicitudin placerat, massa sapien ornare diam, sed cursus lorem purus sed tellus."
                            creator="Richard McClintock"></Recordingcard>
                        <Recordingcard
                            title="Lorem Ipsum"
                            preview="Dolor sit amet, consectetur adipiscing elit. Phasellus quis libero mauris. Integer at nisl sed lectus congue posuere. Etiam et sodales risus. Aliquam scelerisque tempor suscipit. Pellentesque feugiat quam ac pretium tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tempor, massa eget sollicitudin placerat, massa sapien ornare diam, sed cursus lorem purus sed tellus."
                            creator="Richard McClintock"></Recordingcard>
                    </Box>
                </SidebarWithHeader>
            </Box>
            <br></br>
            <br></br>
            <br></br>
            
        </>
    );
}
