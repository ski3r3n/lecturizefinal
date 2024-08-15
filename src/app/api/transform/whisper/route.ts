import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const keyChoice = req.headers.get("x-groq-key") || "GROQ_API_KEY"; // or use a query param like req.nextUrl.searchParams.get('key')

  const apiKey =
    keyChoice === "GROQ_API_KEY_2"
      ? process.env.GROQ_API_KEY_2
      : process.env.GROQ_API_KEY;
  
  console.log(apiKey)

  const groq = new Groq({ apiKey });

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    console.log("Whispering");

    const whisperResponse = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
    });

    const transcription = whisperResponse.text;

    return NextResponse.json({ transcription }, { status: 200 });
  } catch (error: any) {
    console.log("Error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
