import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

type ResponseData = {
  message: string;
};

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  return NextResponse.json({ message: "Hello, Next.js!" });
}
