"use client";
import React, { useEffect, useState } from "react";
import { Box, Skeleton, Text } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/sidebar";
import Recordingcard from "@/components/recordingcard";
import NoteCard from "@/components/noteCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);

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
  

  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/api/notes/get");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
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
            {notes.map((note) => (
              <NoteCard
                id={note.id}
                title={note.title}
                content={note.content}
                subject={subjectFullNames[note.subject] || note.subject}
                createdAt={note.createdAt}
                author={{
                  name: note.author.name,
                }}
              />
            ))}
          </Box>
        </SidebarWithHeader>
      </Box>
    </>
  );
}
