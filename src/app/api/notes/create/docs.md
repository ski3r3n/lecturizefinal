# Create Note API

## Endpoint

POST `/api/notes`

## Description

This endpoint is used for creating a new note in the database. It accepts details about the note including title, content, author ID, and class ID, and stores them.

## Request Body

| Field     | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `title`   | String | The title of the note.               |
| `content` | String | The content of the note.             |
| `authorId`| Number | The ID of the user creating the note.|
| `classId` | Number | The ID of the class associated with the note.|

### Example

```json
{
  "title": "Study Notes on Ecology",
  "content": "Detailed study notes on the topic of Ecology covering various aspects.",
  "authorId": 1,
  "classId": 101
}
