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

const generatePdf = () => {
  if (!note) return; // Ensure the note is loaded before generating the PDF

  const doc = new jsPDF();
  const lineHeight = 10;
  let yOffset = 20;

  doc.setFontSize(20);
  doc.text(note.title, 10, yOffset);
  yOffset += lineHeight;

  doc.setFontSize(12);
  doc.text(`Subject: ${subjectFullNames[note.subject] || note.subject}`, 10, yOffset);
  yOffset += lineHeight;
  doc.text(`Author: ${note.author.name}`, 10, yOffset);
  yOffset += lineHeight;
  doc.text(`Posted on: ${new Date(note.createdAt).toLocaleDateString()}`, 10, yOffset);
  yOffset += lineHeight * 2;

  const renderMarkdown = (text, size = 12, fontStyle = 'normal') => {
    doc.setFontSize(size);
    doc.setFont('Helvetica', fontStyle);

    const lines = doc.splitTextToSize(text, 180); // Split text to fit within the page width
    lines.forEach((line) => {
      if (yOffset + lineHeight > doc.internal.pageSize.height - 20) { // Check if a new page is needed
        doc.addPage();
        yOffset = 20;
      }
      doc.text(line, 10, yOffset);
      yOffset += lineHeight;
    });
  };

  const lines = note.content.split('\n');
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      renderMarkdown(line.substring(2), 18, 'bold'); // H1
    } else if (line.startsWith('## ')) {
      renderMarkdown(line.substring(3), 16, 'bold'); // H2
    } else if (line.startsWith('### ')) {
      renderMarkdown(line.substring(4), 14, 'bold'); // H3
    } else if (line.startsWith('- ')) {
      renderMarkdown(`• ${line.substring(2)}`);
    } else {
      // Handle inline Markdown for bold and italic
      const parts = line.split(/(\*\*|\*)/g);
      let isBold = false;
      let isItalic = false;
      parts.forEach((part) => {
        if (part === '**') {
          isBold = !isBold;
        } else if (part === '*') {
          isItalic = !isItalic;
        } else {
          renderMarkdown(part, 12, `${isBold ? 'bold' : ''}${isItalic ? 'italic' : ''}`);
        }
      });
    }
  });

  doc.save(`${note.title}.pdf`);
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
