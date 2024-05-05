"use client"
import React, { useState, useEffect } from 'react';

function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval:any;

    if (recording && !paused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [recording, paused]);

  const formatTime = (timeInSeconds:any) => {
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
        setRecording(false);
        setPaused(false);
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
      <audio controls style={{ width: '100%', marginTop: '20px' }} src={audioChunks.length > 0 ? URL.createObjectURL(new Blob(audioChunks)) : undefined}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioRecorder;
