import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req:NextRequest, res:any) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // const buffer = Buffer.from(await file.arrayBuffer());
  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);
  console.log("AUDIO UPLOAD SUCCESS")

  // const filename = file.name.replaceAll(" ", "_");
  // const filePath = path.join(process.cwd(), "public/assets/" + filename);

  try {
  
    // Transcribe using OpenAI Whisper API
    console.log("TRANSSCRIBING AWAIT")

    const whisperResponse = await openai.audio.transcriptions.create({
      file: fs.createReadStream("./public/harvard.wav"), // EDIT THIS
      model: "whisper-1",
    });

    const transcription = whisperResponse.text;
    console.log(transcription)
    console.log("TRANSSCRIPTION SUCCESS")

    // Summarize using OpenAI ChatGPT API
    const gptResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Make concise, to-the-point markdown notes on this data: ${transcription}` }],
      model: "gpt-3.5-turbo-16k",
    });

    const summary = gptResponse.choices[0].message.content;

    return NextResponse.json({ summary: summary }, { status: 200 });
  } catch (error:any) {
    console.log("Error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
