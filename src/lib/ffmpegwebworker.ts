import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let ffmpeg = createFFmpeg({
    log: true,
    corePath:
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  });
self.onmessage = async (e) => {
  const { file, segmentTime } = e.data;
  
  try {
    await ffmpeg.load();
    await ffmpeg.FS("writeFile", "input.wav", await fetchFile(file));

    await ffmpeg.run(
      "-i", "input.wav",
      "-codec:a", "libmp3lame",
      "-qscale:a", "5",
      "-f", "segment",
      `-segment_time`, segmentTime,
      "-c", "copy",
      "out%03d.mp3"
    );

    const chunkFiles = ffmpeg.FS("readdir", "/").filter((file) => file.startsWith("out"));
    const chunkData = chunkFiles.map((file) => ({
      name: file,
      data: ffmpeg.FS("readFile", file).buffer,
    }));

    self.postMessage({ success: true, chunkData });
  } catch (error: any) {
    console.error(error);
    self.postMessage({ success: false, error: error.message });
  }
};
