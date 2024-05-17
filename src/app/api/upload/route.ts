// https://medium.com/@xhowais/next-js-file-upload-api-tutorial-local-directroy-7ec039efbd66

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req:NextRequest, res:any) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/assets/" + filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: error, status: 500 });
  }
};
