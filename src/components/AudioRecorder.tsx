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
  Input,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { IoIosMic, IoIosSquare, IoIosPause, IoIosPlay } from "react-icons/io";

function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  const [error, setError] = useState<string | null>(null); // State to manage errors
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

      const localChunks: Blob[] = [];

      recorder.addEventListener("dataavailable", (event) => {
        localChunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        setRecording(false);
        setPaused(false);
        setTimer(0); // Reset timer

        const audioBlob = new Blob(localChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        const audioFile = new File(localChunks, "recording.wav", {
          type: "audio/wav",
        });
        setAudioFile(audioFile);
      });

      recorder.start();
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Error accessing microphone. Please check your device settings.");
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
        router.push(`/dashboard/notes/${data.id}/edit`);
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

            <Box display="flex" alignItems="center" justifyContent="center">
              <IconButton
                aria-label={recording ? "Stop Recording" : "Start Recording"}
                icon={recording ? <IoIosSquare /> : <IoIosMic />}
                onClick={toggleRecording}
                ref={saveButtonRef}
                size="lg"
                boxSize="80px"
                colorScheme="red"
                isRound
                _hover={{ transform: "scale(1.1)" }}
              />
              {recording && (
                <IconButton
                  aria-label={paused ? "Resume" : "Pause"}
                  icon={paused ? <IoIosPlay /> : <IoIosPause />}
                  onClick={togglePause}
                  size="lg"
                  colorScheme="red"
                  ml={4}
                  boxSize="80px"
                  isRound
                  _hover={{ transform: "scale(1.1)" }}
                />
              )}
            </Box>

            <Text fontSize="xl" fontWeight="bold">
              {formatTime(timer)}
            </Text>

            {error && (
              <Text color="red.500" fontSize="md">
                {error}
              </Text>
            )}

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
