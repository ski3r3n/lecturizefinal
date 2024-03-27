"use client";

import Image from "next/image";
import {
    Box,
    Center,
    Heading,
    Text,
    Stack,
    Avatar,
    useColorModeValue,
} from "@chakra-ui/react";

export default function Recordingcard(props) {
    return (
        <Center py={6}>
            <Box
                margin="10px"
                zIndex="1"
                maxW={"295px"}
                maxH="385px"
                w={"full"}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                rounded={"md"}
                textOverflow="ellipsis"
                p={6}
                overflow={"hidden"}>
                <Box
                    h={"210px"}
                    bg={"gray.100"}
                    mt={-6}
                    mx={-6}
                    mb={6}
                    pos={"relative"}>
                    <Image
                        src={
                            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fphotos%2Fstudy-notes&psig=AOvVaw1jCvDxqB1OLwD-h9bguxfz&ust=1711617467294000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNi70ouOlIUDFQAAAAAdAAAAABAn"
                        }
                        fill
                        alt="Example"
                    />
                </Box>
                <Stack>
                    <Heading
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        color={useColorModeValue("gray.700", "white")}
                        fontSize={"2xl"}
                        fontFamily={"body"}>
                        {props.title}
                    </Heading>
                    <Text
                        overflow="hidden"
                        textOverflow="ellipsis"
                        maxH="50px"
                        color={"gray.500"}>
                        {props.preview}
                    </Text>
                </Stack>
                <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
                    <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                        <Text fontWeight={600}>{props.creator}</Text>
                    </Stack>
                </Stack>
            </Box>
        </Center>
    );
}
