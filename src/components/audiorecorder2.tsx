import React, { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
let autoclick = 0;
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
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);

  // dropdown
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("MA"); // Default to Mathematics
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
    const fetchClasses = async () => {
      const response = await fetch("/api/classes");
      const data = await response.json();
      setClasses(data);
    };

    fetchClasses();
  }, []);

  // Dropdown for selecting class
  const classOptions = classes.map((cls) => (
    <option key={cls.id} value={cls.id}>
      {cls.name}
    </option>
  ));

  // Dropdown for selecting subject
  const subjectDropdown = Object.entries(subjectOptions).map(([key, value]) => (
    <option key={key} value={key}>
      {value}
    </option>
  ));

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

        // Simulate click on the save button
        console.log(autoclick);

        if (autoclick == 0) {
          autoclick = 1;
          setTimeout(function () {
            console.log(autoclick);
            saveButtonRef.current!.click();
          }, 100);
          setTimeout(function () {
            saveButtonRef.current!.click();
          }, 200);
        } else if (autoclick == 1) {
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

  const toggleRecording = () => {
    if (recording) {
      if (paused) {
        mediaRecorder?.resume();
        setPaused(false);
      } else {
        mediaRecorder?.stop(); // This will trigger 'stop' event and reset the state
      }
    } else {
      startRecording();
    }
  };

  const pauseRecording = () => {
    if (recording && !paused) {
      mediaRecorder?.pause();
      setPaused(true);
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
    if (!audioFile || !selectedClass || !selectedSubject) {
      console.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("classId", selectedClass);
    formData.append("subject", selectedSubject);

    try {
      const response = await fetch("/api/allatoncenow", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const recordingColor = useColorModeValue("#e74c3c", "#ff0000");
  const pauseColor = useColorModeValue("#3498db", "#2980b9");
  const saveColor = useColorModeValue("#2ecc71", "#27ae60");

  return (
    <Center mt="50px">
      <VStack spacing={4}>
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
          {recording
            ? paused
              ? "Resume Recording"
              : "Stop Recording"
            : "Start Recording"}
        </Button>

        {recording && !paused && (
          <Button
            onClick={pauseRecording}
            colorScheme="blue"
            size="md"
            borderRadius="md"
            fontWeight="bold"
            mr="2"
          >
            Pause
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

        <FormControl isRequired>
          <FormLabel htmlFor="class-select">Class</FormLabel>
          <Select
            id="class-select"
            placeholder="Select a Class"
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

        <FormControl isRequired>
          <FormLabel htmlFor="subject-select">Subject</FormLabel>
          <Select
            id="subject-select"
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
      </VStack>
    </Center>
  );
}

export default AudioRecorder;
