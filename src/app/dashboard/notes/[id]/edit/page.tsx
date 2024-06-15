"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

// Dynamically import the markdown editor
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
import "react-markdown-editor-lite/lib/index.css";
import Markdown from "react-markdown";

interface Class {
  id: number;
  name: string;
}

const MarkdownEditorPage = () => {
  const [noteContent, setNoteContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
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

  useEffect(() => {
    const content = localStorage.getItem("noteContent");
    if (content) {
      setNoteContent(content);
    }
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await fetch("/api/classes");
      const data = await response.json();
      setClasses(data);
    };

    fetchClasses();

    const content = localStorage.getItem('markdownContent');
    if (content) {
      setNoteContent(content);
      console.log(content)
    } else {
      console.log("No note found!")
    }
  }, []);


  const handleEditorChange = ({ text }) => {
    setNoteContent(text);
  };

  const saveNote = async () => {
    const response = await fetch("/api/notes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content: noteContent,
        selectedSubject,
        selectedClass,
      }),
    });

    if (response.ok) {
      toast({
        title: "Note saved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Error saving note.",
        description: "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
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
            {Object.entries(subjectOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="class">Class</FormLabel>
          <Select
            id="class"
            placeholder="Select class"
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
    </Container>
  );
};

export default MarkdownEditorPage;
