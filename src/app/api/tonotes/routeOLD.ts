import { OpenAI } from "openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,11
  },
};

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      await upload.single("audio")(req, res, async (err) => {
        if (err) {
          console.error("File upload error:", err);
          return NextResponse.json({ error: "Failed to upload file." }, {status:500});
        }

        const filePath = req.file.path;

        try {
          // Transcribe audio using OpenAI Whisper
          const transcriptionResponse = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: fs.createReadStream(filePath),
          });

          const transcriptionText = transcriptionResponse.text;

          // Summarize the transcription using ChatGPT
          const summaryResponse = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Please summarize the following text:\n\n${transcriptionText}`,
            max_tokens: 100,
          });

          const summaryText = summaryResponse.choices[0].text.trim();

          // Clean up uploaded file
          fs.unlinkSync(filePath);

          res
            .status(200)
            .json({ transcription: transcriptionText, summary: summaryText });
        } catch (transcriptionError) {
          console.error(
            "Transcription/Summarization error:",
            transcriptionError,
          );
          fs.unlinkSync(filePath);
          res.status(200).json({
            error: "Failed to transcribe and summarize the audio file.",
          });
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(200).json({ error: error.message });
    }
  } else {
    res.status(200).json({ x: `Method not allowed ${req.method}` });
  }
}