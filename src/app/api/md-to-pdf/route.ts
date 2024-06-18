import { NextApiRequest, NextApiResponse } from 'next';
import mdToPdf from 'md-to-pdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Markdown content is required' });
      }

      // Generate PDF from Markdown
      const pdfBuffer = await mdToPdf({ content }).catch((error) => {
        throw error;
      });

      // Respond with the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error converting Markdown to PDF:', error);
      res.status(500).json({ error: 'Failed to convert Markdown to PDF' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
