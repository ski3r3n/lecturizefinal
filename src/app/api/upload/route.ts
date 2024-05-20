// https://medium.com/@xhowais/next-js-file-upload-api-tutorial-local-directroy-7ec039efbd66

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextRequest, res: any) => {
  const formData = await req.formData();
  const file = formData.get("file");
  console.log("I have been summoned");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/assets/" + filename),
      buffer
    );
    console.log("AUDIO UPLOAD SUCCESS");  
    return NextResponse.json({ Message: "sigma" }, { status: 200 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: error, status: 500 });
  }

  // const buffer = Buffer.from(await file.arrayBuffer()
  const audio = new Uint8Array(buffer);
};
