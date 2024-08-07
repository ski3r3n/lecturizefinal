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
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let ffmpeg = createFFmpeg({
  log: true,
  corePath:
    "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
});

async function initFFmpeg() {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
}

function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number>(0);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [cancelProcessing, setCancelProcessing] = useState<boolean>(false);

  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  useEffect(() => {
    return () => {
      // Cleanup function to reset states
      setMediaRecorder(null)
      setRecording(false);
      setPaused(false);
      setAudioChunks([]);
      setAudioURL(null);
      setAudioFile(null);
      setTimer(0);
      setIsLoading(false);
      setError(null);
      setProgress("");
      setTotalTime(0);
      setCancelProcessing(false);
    };
  }, []);
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

  useEffect(() => {
    const loadFfmpeg = async () => {
      await initFFmpeg();
      setFfmpegReady(true);
    };
    loadFfmpeg();
  }, []);

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
      // Stop previous media recorder if still running
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]); // Reset audio chunks for a new recording
      setTimer(0);

      const localChunks: Blob[] = [];

      recorder.addEventListener("dataavailable", (event) => {
        localChunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        setRecording(false);
        setPaused(false);
        setTimer(0);

        const audioBlob = new Blob(localChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        const audioFile = new File(localChunks, "recording.wav", {
          type: "audio/wav",
        });
        setAudioFile(audioFile);

        const audio = new Audio(audioUrl);
        audio.addEventListener("loadedmetadata", () => {
          setTotalTime(Math.floor(audio.duration));
        });
      });

      recorder.start();
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError(
        "Error accessing microphone. Please check your device settings."
      );
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

      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener("loadedmetadata", () => {
        setTotalTime(Math.floor(audio.duration));
      });
    }
  };

  const parseFfmpegLog = (message: string) => {
    const timeRegex = /time=(\d+):(\d+):(\d+)/;
    const match = message.match(timeRegex);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const currentTime = hours * 3600 + minutes * 60 + seconds;
      setProgress(
        `Converting to MP3: ${formatTime(currentTime)} / ${formatTime(
          totalTime
        )}`
      );
    }
  };

  const splitAndUpload = async (file: File) => {
    if (!ffmpegReady) {
      console.error("ffmpeg is not ready");
      return;
    }

    setProgress("Preparing to process the file...");

    try {
      ffmpeg.FS("writeFile", "input.wav", await fetchFile(file));
      setProgress("File loaded successfully. Converting to MP3...");

      ffmpeg.setLogger(({ message }) => {
        parseFfmpegLog(message);
      });

      await ffmpeg.run(
        "-i",
        "input.wav",
        "-codec:a",
        "libmp3lame",
        "-qscale:a",
        "2",
        "input.mp3"
      );

      setProgress("Conversion to MP3 completed. Splitting the MP3...");

      await ffmpeg.run(
        "-i",
        "input.mp3",
        "-f",
        "segment",
        "-segment_time",
        "180",
        "-c",
        "copy",
        "out%03d.mp3"
      );

      setProgress("Splitting completed. Uploading chunks...");

      const chunkFiles = ffmpeg
        .FS("readdir", "/")
        .filter((file) => file.startsWith("out"));
      let transcription = "";

      for (let i = 0; i < chunkFiles.length; i++) {
        if (cancelProcessing) {
          setProgress("Processing canceled.");
          setIsLoading(false);
          return;
        }

        const file = chunkFiles[i];
        setProgress(`Uploading chunk ${i + 1} of ${chunkFiles.length}...`);

        const data = ffmpeg.FS("readFile", file);
        const blob = new Blob([data.buffer], { type: "audio/mp3" });
        const chunkFile = new File([blob], file, { type: "audio/mp3" });

        const formData = new FormData();
        formData.append("file", chunkFile);

        try {
          const response = await fetch("/api/transform/whisper", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload chunk");
          }

          const result = await response.json();
          transcription += result.transcription;
        } catch (error) {
          console.error("Error during chunk upload:", error);
          if (cancelProcessing) {
            setProgress("Processing canceled.");
            setIsLoading(false);
            return;
          }
        }
      }

      setProgress(
        "All chunks uploaded. Sending combined transcription to ChatGPT..."
      );

      const chatResponse = await fetch("/api/transform/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });

      const chatData = await chatResponse.json();
      localStorage.setItem("markdownContent", chatData.summary);
      localStorage.setItem("newNoteId", chatData.id);
      router.push(`/dashboard/notes/${chatData.id}/edit`);
    } catch (error: any) {
      console.error("Error during processing:", error);
      if (error.message === "ffmpeg has exited") {
        console.log("The operation was canceled!");
      } else {
        console.log("Some other error happened!", error);
      }
      if (!cancelProcessing) {
        setProgress("An error occurred during processing.");
      }
    } finally {
      if (cancelProcessing) {
        // Ensure ffmpeg is reinitialized properly
        await initFFmpeg();
        setFfmpegReady(true);
      }
      setIsLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!audioFile) {
      console.error("Audio file missing!");
      return;
    }

    if (!ffmpegReady) {
      console.error("ffmpeg is not ready");
      return;
    }

    setIsLoading(true);
    setCancelProcessing(false);

    try {
      await splitAndUpload(audioFile);
    } catch (error) {
      console.error("There was a problem with the upload operation:", error);
      if (cancelProcessing) {
        setProgress("Processing canceled.");
      } else {
        setProgress("An error occurred during processing.");
      }
    }
  };

  const cancelUpload = async () => {
    console.log("Cancelling...");
    setCancelProcessing(true);
    setProgress("Canceling the process...");

    try {
      ffmpeg.exit();
    } catch (error) {
      console.error("Error during ffmpeg exit:", error);
    }

    // Ensure ffmpeg is reinitialized for future use
    await initFFmpeg();
    setFfmpegReady(true);

    // Clear the file system
    // ffmpeg.FS("unlink", "input.wav");
    ffmpeg.FS("unlink", "input.mp3");
    const chunkFiles = ffmpeg
      .FS("readdir", "/")
      .filter((file) => file.startsWith("out"));
    chunkFiles.forEach((file) => ffmpeg.FS("unlink", file));

    console.log("ffmpeg ready after cancel");

    // Reset states
    setAudioFile(null);
    setAudioURL(null);
    setError(null);
    setTimer(0);
    setProgress("");
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
            <Text mt={5}>{progress}</Text>
            <Button colorScheme="red" onClick={cancelUpload}>
              Cancel
            </Button>
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
                colorScheme="red"
                isRound
                boxSize="80px"
                fontSize="40px"
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
                  isRound
                  boxSize="80px"
                  fontSize="40px"
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
              src={audioURL!}>
              Your browser does not support the audio element.
            </audio>

            {audioURL && (
              <Button
                onClick={uploadFile}
                colorScheme="teal"
                size="md"
                borderRadius="md"
                fontWeight="bold"
                mt="4">
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
