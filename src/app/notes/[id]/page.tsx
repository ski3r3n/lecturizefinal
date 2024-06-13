// pages/note/[id].js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export default function NotePage({ params }: { params: { id: string } }) {
  async function loader(id) {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });
  
    if (!note) {
      throw new Response("Not Found", { status: 404 });
    }
  
    console.log(note)
    console.log("loaded")
  
    return note;
  }
  const note = loader(params.id);

  return (
    <div>
      <h1>Note Details</h1>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <small>Author ID: {note.authorId}</small><br/>
      <small>Class ID: {note.classId}</small>
    </div>
  );
};
