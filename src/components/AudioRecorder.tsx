"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Text,
  Center,
  VStack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Select,
  Input,
  Spinner,
} from "@chakra-ui/react";

interface Class {
  id: number;
  name: string;
}

let autoclick = 0;

function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (recording && !paused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording, paused]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]); // Reset audio chunks
      setTimer(0);

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      });

      recorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        const audioFile = new File(audioChunks, "recording.wav", {
          type: "audio/wav",
        });
        setAudioFile(audioFile);
        setRecording(false);
        setPaused(false);
        setTimer(0); // Reset timer

        if (autoclick === 0) {
          autoclick = 1;
          setTimeout(function () {
            saveButtonRef.current!.click();
          }, 100);
          setTimeout(function () {
            saveButtonRef.current!.click();
          }, 200);
        } else if (autoclick === 1) {
          autoclick = 0;
        }
      });

      recorder.start();
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const togglePause = () => {
    if (paused) {
      mediaRecorder?.resume();
      setPaused(false);
    } else {
      mediaRecorder?.pause();
      setPaused(true);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      mediaRecorder?.stop();
    } else {
      startRecording();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const uploadFile = async () => {
    if (!audioFile) {
      console.error("Audio file missing!");
      return;
    }

    setIsLoading(true); // Set loading true when upload starts

    const formData = new FormData();
    formData.append("file", audioFile);

    fetch("/api/transform", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("markdownContent", data.summary);
        localStorage.setItem("newNoteId", data.id);
        setIsLoading(false); // Update loading state
        router.push(`/dashboard/notes/${data.id}/edit`)
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsLoading(false); // Update loading state
      });
  };

  const recordingColor = useColorModeValue("#e74c3c", "#ff0000");
  const pauseColor = useColorModeValue("#3498db", "#2980b9");
  const saveColor = useColorModeValue("#2ecc71", "#27ae60");

  return (
    <Center mt="50px">
      <VStack spacing={4}>
        {isLoading ? (
          <>
            <Spinner size="xl" />
            <Text mt={5}>Your recording is being processed...</Text>
          </>
        ) : (
          <>
            <FormControl>
              <FormLabel>Upload an Audio File</FormLabel>
              <Input type="file" accept="audio/*" onChange={handleFileChange} />
            </FormControl>
            <Button
              colorScheme={recording ? "red" : "green"}
              onClick={toggleRecording}
              ref={saveButtonRef}
              size="lg"
              borderRadius="lg"
              px="8"
              fontWeight="bold"
            >
              {recording ? "Stop Recording" : "Start Recording"}
            </Button>

            {recording && (
              <Button
                onClick={togglePause}
                colorScheme="blue"
                size="md"
                borderRadius="md"
                fontWeight="bold"
                mr="2"
              >
                {paused ? "Resume" : "Pause"}
              </Button>
            )}

            <Text fontSize="xl" fontWeight="bold">
              {formatTime(timer)}
            </Text>

            <audio
              controls
              style={{ width: "100%", marginTop: "20px" }}
              src={audioURL!}
            >
              Your browser does not support the audio element.
            </audio>

            {audioURL && (
              <Button
                onClick={uploadFile}
                colorScheme="teal"
                size="md"
                borderRadius="md"
                fontWeight="bold"
                mt="4"
              >
                Save Recording
              </Button>
            )}
          </>
        )}
      </VStack>
    </Center>
  );
}

export default AudioRecorder;
