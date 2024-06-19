import { NextResponse } from 'next/server';
import markdownpdf from 'markdown-pdf';

export async function POST(req: Request) {
    try {
        const {markdown} = await req.json(); // Assuming the markdown text is sent as plain text in the body
        const buffers = [];

        console.log(markdown)

        markdownpdf().from.string(markdown).to.buffer({}, (err, buffer) => {
            if (err) {
                return NextResponse.json({ error: 'Failed to create PDF' }, { status: 500 });
            }

            const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Create a response that the client can use to trigger a download
            return NextResponse.json({ pdfUrl }, { status: 200 });
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

