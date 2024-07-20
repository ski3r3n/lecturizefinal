import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    console.log("Whispering");
    // Transcribe using OpenAI Whisper API
    const whisperResponse = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    const transcription = whisperResponse.text;

    return NextResponse.json({ transcription }, { status: 200 });
  } catch (error: any) {
    console.log("Error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
