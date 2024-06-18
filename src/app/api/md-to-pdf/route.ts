
import { NextApiRequest, NextApiResponse } from 'next';
import { toPdf } from 'md-to-pdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, content, subject, author, createdAt } = req.body;

    const markdownContent = `
# ${title}

**Subject:** ${subject}  
**Author:** ${author}  
**Posted on:** ${new Date(createdAt).toLocaleDateString()}

${content}
    `;

    try {
      const pdf = await toPdf({ content: markdownContent });

      if (pdf) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
        res.status(200).send(pdf.content);
      } else {
        res.status(500).json({ error: 'Failed to generate PDF' });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Error generating PDF' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
