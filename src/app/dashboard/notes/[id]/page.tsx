"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Text,
  VStack,
  Container,
  useColorModeValue,
  Avatar,
  HStack,
  Badge,
  IconButton,
  Tooltip,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Code,
  Image,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import { MdDownload, MdEdit } from "react-icons/md";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import markdownToPDF from "@/app/utils/MarkdownToPDF";

import "./styles.css";

interface Note {
  id: number;
  title: string;
  content: string;
  subject: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  class: {
    name: string;
  };
}

interface User {
  name: string;
  role: string;
  id: number;
}

interface Subject {
  id: string;
  name: string;
}

const NoteViewer = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/notes/get/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNote(data.note);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching note:", error);
        setLoading(false);
      });

    const fetchUser = async () => {
      const response = await fetch("/api/userInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
      }
    };

    const fetchSubjects = async () => {
      const response = await fetch("/api/subjects");
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        console.error("Failed to fetch subjects");
      }
    };

    fetchUser();
    fetchSubjects();
  }, [id]);

  const getSubjectFullName = (subjectId: string) => {
    const subject = subjects.find((sub) => sub.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={10}>
        <VStack spacing={4} align="stretch">
          <Skeleton height="40px" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
          <HStack justify="left" mt="4">
            <SkeletonCircle size="10" />
            <Skeleton height="20px" width="150px" />
          </HStack>
        </VStack>
      </Container>
    );
  }

  if (!note) return <Text>No note found or loading failed.</Text>;

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={4} align="stretch">
        <HStack justifyContent="space-between" alignItems="center" wrap="wrap">
          <HStack>
            <Heading as="h1" size="xl">
              {note.title}
            </Heading>
            <Badge colorScheme="green" ml={4}>
              {getSubjectFullName(note.subject.name)}
            </Badge>
            <Badge colorScheme="purple" ml={0.5}>
              {note.class.name}
            </Badge>
          </HStack>
          <HStack>
            <Tooltip label="Download PDF">
              <IconButton
                icon={<MdDownload />}
                colorScheme="blue"
                onClick={() => markdownToPDF(note.content)}
                aria-label="Download PDF"
              />
            </Tooltip>
            {user && user.role === "TEACHER" && (
              <Link href={`/dashboard/notes/${params.id}/edit`}>
                <Tooltip label="Edit Note">
                  <IconButton
                    icon={<MdEdit />}
                    colorScheme="teal"
                    aria-label="Edit Note"
                  />
                </Tooltip>
              </Link>
            )}
          </HStack>
        </HStack>
        <Divider />
        <Text fontSize="lg" color={"gray.800"} className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
        </Text>
        <HStack justify="left" mt={4}>
          <Avatar name={note.author?.name || "Anonymous"} />
          <VStack align="start" spacing="0px">
            <Text fontWeight="bold">{note.author.name}</Text>
            <Text fontSize="sm" color="gray.500">
              Posted on {new Date(note.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Container>
  );
};

export default NoteViewer;