import { NextResponse } from "next/server";
import markdownpdf from "markdown-pdf";

// Define the type for the incoming request body
interface PdfRequestBody {
  title: string;
  content: string;
  subject: string;
  author: string;
  createdAt: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the incoming request body
    const body: PdfRequestBody = await req.json();

    // Construct the markdown string from the provided data
    const markdown = `
# ${body.title}

**Subject:** ${body.subject}

**Author:** ${body.author}

**Created At:** ${new Date(body.createdAt).toLocaleDateString()}

---

${body.content}
    `;

    // Create a new promise to handle the PDF generation asynchronously
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      markdownpdf().from.string(markdown).to.buffer((err, buffer) => {
        if (err) {
          // Handle any errors during PDF generation
          console.error("Error generating PDF:", err);
          reject(err);
        } else {
          // Resolve the promise with the PDF buffer
          resolve(buffer);
        }
      });
    });

    // Create headers for the PDF response
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${body.title}.pdf"`,
      "Content-Length": buffer.length.toString(),
    });

    // Return the PDF buffer as a response
    return new Response(buffer, { headers, status: 200 });
  } catch (error) {
    // Handle any other errors
    console.error("Internal Server Error:", error);
    return new Response(null, { status: 500, statusText: "Internal Server Error" });
  }
}

