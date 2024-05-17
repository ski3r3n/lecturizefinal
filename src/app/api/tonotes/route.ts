import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req:NextRequest, res:any) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  const filePath = path.join(process.cwd(), "public/assets/" + filename);

  try {
    await writeFile(filePath, buffer);

    // Transcribe using OpenAI Whisper API
    const whisperResponse = await openai.audio.createTranscription({
      file: buffer,
      model: 'whisper-1'
    });

    const transcription = whisperResponse.text;

    // Summarize using OpenAI ChatGPT API
    const gptResponse = await openai.chat.completions.create({
        messages: [{ role: "user", content: `Summarize the following text: ${transcription}` }],
        model: "gpt-3.5-turbo-16k",
    });

    const summary = gptResponse.choices[0].message.content;

    return NextResponse.json({ summary: summary }, { status: 200 });
  } catch (error) {
    console.log("Error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
