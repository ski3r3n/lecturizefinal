"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import NoteCard from "@/components/NoteCard";

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
  subject: keyof typeof subjectFullNames; // Ensures subject keys match your defined subjects
  createdAt: string; // Adjust based on your actual date format, possibly Date
  author: {
    name: string;
  };
}

export default function Dashboard() {
  // Use the Note interface to type the state
  const [notes, setNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/api/notes/get");
      if (response.ok) {
        const data = await response.json();
        setNotes(data); // Make sure the returned data matches the Note interface
      } else {
        console.error("Failed to fetch notes");
      }
    }

    fetchNotes();
  }, []);

  return (
    <>
      <Box
        zIndex="1"
        display="flex"
        flexDir="column"
        position="fixed"
        height="100vh"
        width="100vw"
        overflow="scroll"
        bgColor="#f3f5f8"
      >
        <SidebarWithHeader>
          <Box display="flex" flexWrap="wrap" ml="0">
            {notes.map((note, index) => (
              <NoteCard
                key={index}
                id={note.id}
                title={note.title}
                content={note.content}
                subject={subjectFullNames[note.subject] || note.subject}
                createdAt={note.createdAt}
                author={note.author}
              />
            ))}
          </Box>
        </SidebarWithHeader>
      </Box>
    </>
  );
}
