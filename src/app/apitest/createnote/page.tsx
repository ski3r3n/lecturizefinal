// pages/create-note.js
"use client"
import { useState } from 'react';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [classId, setClassId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/notes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        authorId: parseInt(authorId),  // Ensure authorId and classId are integers
        classId: parseInt(classId),
      }),
    });

    if (response.ok) {
      alert('Note created successfully');
      // Reset form or redirect user
      setTitle('');
      setContent('');
      setAuthorId('');
      setClassId('');
    } else {
      alert('Failed to create note');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a Note</h1>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div>
        <label>Author ID:</label>
        <input type="number" value={authorId} onChange={(e) => setAuthorId(e.target.value)} required />
      </div>
      <div>
        <label>Class ID:</label>
        <input type="number" value={classId} onChange={(e) => setClassId(e.target.value)} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
