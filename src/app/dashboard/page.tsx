"use client";
import React, { useEffect, useState } from "react";
import { Heading, Flex, Select, Box, Text, Grid, Divider, Progress } from "@chakra-ui/react";
import NoteCard from "@/components/NoteCard";
import NoteCardSkeleton from "@/components/skeletons/NoteCardSkeleton";

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
  description: string;
  subject: {
    name: string;
    code: string; // Added this line
  };
  createdAt: string;
  author: {
    name: string;
  };
  class: {
    name: string;
  }
}

interface Class {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterClass, setFilterClass] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const subjectColors = {
    MA: "blue",
    ELL: "green",
    TP: "purple",
    HC: "red",
    PE: "orange",
    ACC: "yellow",
    LSS: "teal",
    HI: "cyan",
    GE: "pink",
    ART: "gray",
    IF: "blackAlpha",
  };
  

  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/api/notes/get");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setFilteredNotes(data);
        setIsLoading(false)
      } else {
        console.error("Failed to fetch notes");
      }
    }

    async function fetchClasses() {
      const response = await fetch("/api/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    }

    async function fetchSubjects() {
      const response = await fetch("/api/db/subjects");
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    }

    fetchNotes();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Filter notes based on selected subject and class
    let sortedFilteredNotes = notes.filter((note) =>
      (filterSubject ? note.subject.code === filterSubject : true) &&
      (filterClass ? note.class.name === filterClass : true)
    );

    // Sort notes based on selected sort order
    sortedFilteredNotes.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    // Update the filteredNotes state
    setFilteredNotes(sortedFilteredNotes);
  }, [notes, sortOrder, filterSubject, filterClass]);

  return (
    <>
      <Box padding="4">
        <Heading as="h1" size="md" mb="4" fontWeight="bold">Manage Your Notes</Heading>
        <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
          <Select
            placeholder="Sort by"
            onChange={(e) => setSortOrder(e.target.value)}
            shadow="base"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select>
          <Select
            placeholder="Filter by Subject"
            onChange={(e) => setFilterSubject(e.target.value)}
            shadow="base"
          >
            <option value="" key="">All (default)</option>
            {subjects.map((subject) => (
              <option value={subject.code} key={subject.id}>{subject.name}</option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Class"
            onChange={(e) => setFilterClass(e.target.value)}
            shadow="base"
          >
            <option value="" key="">All Classes</option>
            {classes.map((classItem) => (
              <option value={classItem.name} key={classItem.id}>{classItem.name}</option>
            ))}
          </Select>
        </Grid>
      </Box>
      <Divider />
      <Flex wrap="wrap" justifyContent="space-around" mt="2">
        {isLoading ? (
          new Array(3).fill(null).map((_, index) => <NoteCardSkeleton key={index} />)
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <NoteCard
              key={index}
              id={note.id}
              title={note.title}
              content={note.content}
              subject={note.subject?.code}
              assignedClass={note.class.name}
              createdAt={note.createdAt}
              author={note.author}
              description={note.description}
              color={subjectColors[note.subject?.code] || "gray"}
            />
          ))
        ) : (
          <Text>No notes found for the selected criteria.</Text>
        )}
      </Flex>
    </>
  );
}
