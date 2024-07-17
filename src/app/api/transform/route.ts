import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getHighestNoteId() {
  const highestNote = await prisma.note.findFirst({
    orderBy: {
      id: "desc", // Order by 'id' in descending order
    },
    select: {
      id: true, // Select only the 'id' field
    },
  });

  return highestNote ? highestNote.id : null; // Return the highest ID, or null if no notes exist
}

export const POST = async (req: NextRequest, res: any) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    console.log("Whispering")
    // Transcribe using OpenAI Whisper API
    const whisperResponse = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    const transcription = whisperResponse.text;

    // Summarize using OpenAI ChatGPT API
    console.log("transcribing")
    const gptResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize this lecture into concise, bullet-pointed markdown notes suitable for high school revision, make it easy to skim through, remember, and revise, addressing the typical needs of a high school student preparing for exams or assessments. Do not add any additional information, only the main points of the lecture, brief explanations and definitions are acceptable, but do not make up content. The following is the lecture transcription:
          ${transcription}`,
        },
      ],
      model: "gpt-3.5-turbo-16k",
    });

    const summary = gptResponse.choices[0].message.content;
    const highestId = await getHighestNoteId();
    const newNoteId = highestId ? highestId + 1 : 1;

    return NextResponse.json(
      { summary: summary, id: newNoteId },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
