"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Badge,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";

// Component accepts note details as props
function truncateText(text, maxLength) {
  // Check if the text length is greater than the maxLength,
  // if it is, truncate the string to the maxLength and append '...'
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  // If the text length is within the limit, return the text as it is.
  return text;
}

export default function NoteCard({
  id,
  title,
  content,
  subject,
  createdAt,
  author,
  assignedClass,
  description,
  
}) {
  // Formatting the createdAt date for display
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const notesLink = `/dashboard/notes/${id}`;

  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        minW={"280px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Link href={notesLink}>
          <Box
            h={"120px"}
            bg={"gray.100"}
            mt={-6}
            mx={-6}
            mb={6}
            pos={"relative"}
          >
            <Image
              src={
                "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              }
              layout={"fill"}
              alt={"Image"}
            />
          </Box>
        </Link>
        <Stack>
          {/* <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}>
            {subject}
          </Text> */}
          <Box>
          <Badge variant="solid" colorScheme="green" w={"fit-content"} px={2}>
            {subject}
          </Badge>
          <Badge variant="solid" colorScheme="purple" w={"fit-content"} px={2} ml={2}>
            {assignedClass}
          </Badge>
          </Box>
          
          <Link href={notesLink}>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
              my={2}
            >
              {title} {/* Note title */}
            </Heading>
          </Link>

          <Text color={"gray.500"}>
            {truncateText(description, 90)} {/* Short preview or full content */}
          </Text>
        </Stack>
        <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
          <Avatar name={author.name} />
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>{author.name}</Text>
            <Text color={"gray.500"}>
              {formattedDate} {/* Display the formatted date */}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
