"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Container,
  Grid,
  Heading,
  Text,
  Spinner,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation"; // Corrected from 'next/navigation' to 'next/router'
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
// Dynamically import the markdown editor
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
import "react-markdown-editor-lite/lib/index.css";
import Markdown from "react-markdown";

interface User {
  id: number;
}

interface Class {
  id: number;
  name: string;
  description: string;
}

interface Subject {
  id: string;
  name: string;
}

const CreateNote = () => {
  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const subjectOptions = {
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

  const fetchClassesAndSubjects = async () => {
    const [classesResponse, subjectsResponse] = await Promise.all([
      fetch("/api/classes"),
      fetch("/api/db/subjects"),
    ]);

    const classesData = await classesResponse.json();
    const subjectsData = await subjectsResponse.json();

    setClasses(classesData);
    setSubjects(subjectsData);
  };

  useEffect(() => {
    fetchClassesAndSubjects();
  }, []);

  const handleEditorChange = ({ text }) => {
    setNoteContent(text);
  };

  const saveNote = async () => {
    setIsLoading(true);
    fetch("/api/userInfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user information");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        return fetch("/api/notes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: noteContent,
            subjectId: Number(selectedSubject), // Use the mapped subject ID
            classId: Number(selectedClass),
            authorId: data.id, // Use the fetched user ID
            description: description,
          }),
        });
      })
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("Failed to save note");
        }
        return response.json();
      })
      .then((noteData) => {
        toast({
          title: "Note created successfully.",
          description: "Your note has been successfully saved to the database",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error.message);
        toast({
          title: "Error",
          description: error.message || "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Container maxW="container.xl" py={8}>
      {isLoading ? (
        <Center mt={"50px"}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text mt={5}>Loading...</Text>
          </VStack>
        </Center>
      ) : (
        <>
          <Heading mb={4}>Create New Note</Heading>
          <Grid templateColumns={{ md: "3fr 2fr 2fr" }} gap={6}>
            <FormControl isRequired>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <Select
                id="subject"
                placeholder="Select subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="class">Class</FormLabel>
              <Select
                id="class"
                placeholder={"Select class"}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <FormControl isRequired mt={4}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </FormControl>
          <Box mt={6} border="1px" borderColor="gray.200" bg="white">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => (
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}>
                  {text}
                </Markdown>
              )}
              onChange={handleEditorChange}
              value={noteContent}
            />
          </Box>
          <Button mt={4} colorScheme="blue" onClick={saveNote}>
            Save Note
          </Button>
        </>
      )}
    </Container>
  );
};

export default CreateNote;
