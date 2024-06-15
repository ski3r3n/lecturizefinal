"use client";
import React, { useEffect, useState } from "react";
import { Flex, Select, Box, Text, Grid, Divider } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithHeader";
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
  subject: keyof typeof subjectFullNames;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

    fetchNotes();
  }, []);

  useEffect(() => {
    let sortedFilteredNotes = notes.filter((note) =>
      filterSubject ? note.subject === filterSubject : true
    );

    sortedFilteredNotes.sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

    setFilteredNotes(sortedFilteredNotes);
  }, [notes, sortOrder, filterSubject]);

  return (
    <>
      <Box padding="4">
        <Text fontSize="lg" mb="4" fontWeight="bold">Manage Your Notes</Text>
        <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
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
            {Object.entries(subjectFullNames).map(([key, name]) => (
              <option value={key} key={key}>{name}</option>
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
              subject={subjectFullNames[note.subject] || note.subject}
              createdAt={note.createdAt}
              author={note.author}
              description={note.description}
            />
          ))
        ) : (
          <Text>No notes found for the selected criteria.</Text>
        )}
      </Flex>
    </>
  );
  
}
