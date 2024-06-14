"use client";
import { useEffect, useState } from 'react';
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
  SkeletonText
} from '@chakra-ui/react';
import { MdDownload } from 'react-icons/md';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

const NoteViewer = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/notes/get/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNote(data.note);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching note:', error);
        setLoading(false);
      });
  }, [id]);

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
            <Heading as="h1" size="xl">{note.title}</Heading>
            <Badge colorScheme="green" ml={4}>{subjectFullNames[note.subject] || note.subject}</Badge>
          </HStack>
          <Button leftIcon={<MdDownload />} colorScheme="blue" onClick={() => alert('PDF download not implemented yet')}>
            Download PDF
          </Button>
        </HStack>
        <Divider />
        <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
          <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
        </Text>
        <HStack justify="left" mt={4}>
          <Avatar name={note.author?.name || "Anonymous"} />
          <VStack align="start" spacing="0px">
            <Text fontWeight="bold">{note.author.name}</Text>
            <Text fontSize="sm" color="gray.500">Posted on {new Date(note.createdAt).toLocaleDateString()}</Text>
          </VStack>
        </HStack>
      </VStack>
    </Container>
  );
};

export default NoteViewer;
