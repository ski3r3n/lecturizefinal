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
} from "@chakra-ui/react";
import { MdDownload, MdEdit } from "react-icons/md";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { jsPDF } from "jspdf";

const subjectFullNames = {
  MA: "Mathematics",
  ELL: "English Language & Literature",
  TP: "Thinking Programme",
  HC: "Higher Chinese",
  PE: "Physical Education",
  ACC: "Appreciation of Chinese Culture",
  LSS: "Lower Secondary Science",
  HI: "History",
  GE: "Geography",
  ART: "Art",
  IF: "Infocomm",
};

interface Note {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
}

interface User {
  name: string;
  role: string;
  id: number;
}

const NoteViewer = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/get/${id}`);
        const data = await res.json();
        setNote(data.note);
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/userInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchNote();
    fetchUser();
  }, [id]);

const generatePdf = async () => {
  if (!note) return; // Ensure the note is loaded before generating the PDF

  const markdownContent = `
# ${note.title}

**Subject:** ${subjectFullNames[note.subject] || note.subject}  
**Author:** ${note.author.name}  
**Posted on:** ${new Date(note.createdAt).toLocaleDateString()}

${note.content}
  `;

  const pdf = await toPdf({ content: markdownContent }).catch(console.error);

  if (pdf) {
    saveAs(new Blob([pdf.content], { type: "application/pdf" }), `${note.title}.pdf`);
  }
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
              {subjectFullNames[note.subject] || note.subject}
            </Badge>
          </HStack>
          <HStack>
            <Tooltip label="Download PDF">
              <IconButton
                icon={<MdDownload />}
                colorScheme="blue"
                onClick={generatePdf}
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
        <Text fontSize="lg" color={"gray.600"}>
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
