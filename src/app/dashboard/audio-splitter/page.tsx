"use client"
import React, { useEffect, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ffmpeg = createFFmpeg({ log: true });

function audioSplitter() {
  const [ready, setReady] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertAndSplit = async (file:File) => {
    // Read the file
    ffmpeg.FS('writeFile', 'test.m4b', await fetchFile(file));

    // Convert to MP3
    await ffmpeg.run('-i', 'test.m4b', '-codec:a', 'libmp3lame', '-qscale:a', '2', 'input.mp3');

    // Split the MP3
    await ffmpeg.run('-i', 'input.mp3', '-f', 'segment', '-segment_time', '180', '-c', 'copy', 'out%03d.mp3');

    // Create a new JSZip instance
    const zip = new JSZip();

    // Iterate over the chunks
    const chunkFiles = ffmpeg.FS('readdir', '/').filter(file => file.startsWith('out'));
    for (let file of chunkFiles) {
      // Read the chunk
      const data = ffmpeg.FS('readFile', file);

      // Add the chunk to the ZIP
      zip.file(file, data);
    }

    // Generate the ZIP file
    const zipFile = await zip.generateAsync({ type: 'blob' });

    // Download the ZIP file
    saveAs(zipFile, 'chunks.zip');
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Audio Chunker</h1>
      <input type="file" onChange={(e) => {
        if (!e.target.files) return;
        convertAndSplit(e.target.files[0])}} />
    </div>
  );
}

export default audioSplitter;