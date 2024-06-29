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
import { useRouter } from "next/navigation";

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

const MarkdownEditorPage = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<User | null>(null);
  const [creatingNote, setCreatingNote] = useState(false);
  const [description, setDescription] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [noteId, setNoteId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const content = localStorage.getItem("noteContent");
    if (content) {
      setNoteContent(content);
    }
  }, []);

  useEffect(() => {
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

    fetchClassesAndSubjects();

    fetch(`/api/notes/get/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          const content = localStorage.getItem("markdownContent");
          if (content) {
            setCreatingNote(true);
            setNoteContent(content);
          } else {
            alert("No note of ID found and no note to create!");
          }
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.note);
        setTitle(data.note.title);
        setSelectedClass(data.note.class.id);
        setSelectedSubject(data.note.subject.id); // Use subjectId
        setNoteContent(data.note.content);
        setDescription(data.note.description);
        setNoteId(data.note.id);
      })
      .catch((error) => {
        console.log(`Everything is perfectly fine: ${error}`);
      });
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
        if (creatingNote) {
          return fetch("/api/notes/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              content: noteContent,
              subjectId: Number(selectedSubject), // Use subjectId
              classId: Number(selectedClass),
              authorId: data.id, // Use the fetched user ID
              description: description,
            }),
          });
        } else {
          return fetch("/api/notes/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              content: noteContent,
              subjectId: Number(selectedSubject), // Use subjectId
              classId: Number(selectedClass),
              noteId: Number(noteId), // Use the fetched user ID
              description: description,
            }),
          });
        }
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
          title: "Note saved successfully.",
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

  const handleDelete = () => {
    onClose(); // Close the dialog
    setIsLoading(true); // Show loading indicator

    fetch(`/api/notes/delete/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the note");
        }
        return response.json();
      })
      .then(() => {
        toast({
          title: "Note deleted successfully.",
          description: "The note has been removed from your records.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Deletion error:", error);
        toast({
          title: "Error deleting note.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false); // Hide loading indicator
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
          <Heading mb={4}>Edit Note</Heading>
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
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
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
                onChange={(e) => setSelectedClass(e.target.value)}
              >
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
              renderHTML={(text) => <Markdown>{text}</Markdown>}
              onChange={handleEditorChange}
              value={noteContent}
            />
          </Box>
          <Button mt={4} colorScheme="blue" onClick={saveNote}>
            Save Note
          </Button>
          <Button ml={4} mt={4} colorScheme="red" onClick={onOpen}>
            Delete Note
          </Button>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Note
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can&lsquo;t undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={handleDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </Container>
  );
};

export default MarkdownEditorPage;
