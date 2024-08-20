import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import prisma from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT = "Using the transcription provided below, generate highly detailed, bullet-pointed markdown notes suitable for high school revision. Ensure the notes are structured to aid easy skimming, memorization, and review, focusing on thoroughly capturing all main points, essential concepts, and pertinent examples relevant to the topics discussed in the lecture. Include brief definitions and explanations only as necessary, directly tied to the lecture content, without introducing extraneous information. Ignore any teacher comments or scolding directed at students, and exclude any content related to homework or irrelevant discussions. Ensure that all lesson content is covered comprehensively and accurately, making the notes as detailed and complete as possible, regardless of length. If the transcription contains inaccuracies, especially in languages like Chinese, correct them using accurate and reliable information. For mathematical expressions, use LaTeX formatting enclosed within double dollar signs $$, without additional spacing at the beginning or end (e.g., $$\frac{d}{dx}(\cos x) = -\sin x$$). Here is the lecture transcription"

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

export const POST = async (req: NextRequest) => {
  const transcription = await req.text();

  if (!transcription) {
    console.log(transcription)
    return NextResponse.json({ error: "No transcription provided." }, { status: 400 });
    
  }

  try {
    console.log("Summarizing");
    // Summarize using OpenAI ChatGPT API
    const gptResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${PROMPT}${transcription}`,
        },
      ],
      model: "gpt-4o-mini",
    });

    const summary = gptResponse.choices[0].message.content;
    const highestId = await getHighestNoteId();
    const newNoteId = highestId ? highestId + 1 : 1;

    return NextResponse.json({ summary, id: newNoteId }, { status: 200 });
  } catch (error: any) {
    console.log("Error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
