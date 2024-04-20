"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
export default function Mdeditor() {
  const [markdownInput, setMarkdownInput] = useState();
  return (
    <div className="App">
      <div>
        <h1>Editing note Placeholder</h1>
      </div>
      <div className="wrapperer">
        <div className="wrapper">
          <div className="head">
            <VisibilityIcon />
            &nbsp;MARKDOWN
          </div>
          <textarea
            id="whereitallis"
            autoFocus
            className="textarea"
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
          ></textarea>
        </div>
        <div className="wrapper">
          <div className="head">
            <VisibilityIcon />
            &nbsp;PREIVEW
          </div>
          <ReactMarkdown
            children={markdownInput}
            components={{
              code: MarkComponent,
            }}
          />
        </div>
      </div>
      <button
        style={{
          border: " 2px solid gray",
          padding: "10px",
          borderRadius: "10px",
        }}
        onClick={() => {
          console.log(document.getElementById("whereitallis").value);
        }}
      >
        Save
      </button>
    </div>
  );
}
const MarkComponent = ({ value, language }) => {
  return (
    <SyntaxHighlighter language={language ?? null} style={docco}>
      {value ?? ""}
    </SyntaxHighlighter>
  );
};
