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
import { useLoading } from '@/app/hooks/LoadingContext';

// Function to truncate text
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

// NoteCard Component
export default function NoteCard({
  id,
  title,
  content,
  subject,
  createdAt,
  author,
  assignedClass,
  description,
  color
}) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const notesLink = `/dashboard/notes/${id}`;
  const { setIsLoading } = useLoading();

  return (
    <Center py={6}>
      <Box
        maxW={"280px"}
        minW={"280px"}
        minH={"380px"}
        margin={"10px"}
        maxH={"380px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        transition="transform 0.3s ease-in-out"
        _hover={{ transform: "scale(1.05)" }}
      >
        <Link href={notesLink}>
          <Box
            h={"120px"}
            bg={"gray.100"}
            mt={-6}
            mx={-6}
            mb={6}
            pos={"relative"}
            onClick={() => setIsLoading(true)}
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
          <Box>
            <Badge variant="solid" colorScheme={color} w={"fit-content"} px={2}>
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
              onClick={() => setIsLoading(true)}
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
