import React, { useState, useEffect } from 'react';

function AudioRecorder() {  const [file, setFile] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (recording && !paused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording, paused]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]); // Reset audio chunks
      setTimer(0);

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      });

      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setRecording(false);
        setPaused(false);
        const audioFile = new File(audioChunks, 'recording.wav', { type: 'audio/wav' });
        setAudioFile(audioFile);
        setTimer(0);  // Reset timer
      });

      recorder.start();
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      if (paused) {
        mediaRecorder?.resume();
        setPaused(false);
      } else {
        mediaRecorder?.stop();  // This will trigger 'stop' event and reset the state
        

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

  const handleFileChange = (event:any) => {
    console.log("welp")
    setFile(event.target.files[0]); 
  };
  const handleSubmit = async (event: any) => {
    console.log("WELP")
    event.preventDefault();
    setFile(audioFile)
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

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
  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button
        onClick={toggleRecording}
        style={{
          padding: '20px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          borderRadius: '10px',
          backgroundColor: recording ? '#e74c3c' : '#ff0000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {recording ? (paused ? 'Resume Recording' : 'Stop Recording') : 'Start Recording'}
      </button>
      <div>
        {recording && !paused && (
          <button
            onClick={pauseRecording}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '5px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Pause
          </button>
        )}
        <div style={{ display: 'inline-block', fontSize: '20px', fontWeight: 'bold', marginLeft: 'auto' }}>
          {formatTime(timer)}
        </div>
      </div>
      <audio controls style={{ width: '100%', marginTop: '20px' }} src={audioChunks.length > 0 ? URL.createObjectURL(new Blob(audioChunks)) : undefined} onChange={handleFileChange}>
        Your browser does not support the audio element.
      </audio>
      {audioURL && (
        <div>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '5px',
              backgroundColor: '#2ecc71',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Save Recording
          </button>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
