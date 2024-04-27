"use client";
import React, { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";

export default function Mdeditor() {
    const [markdownInput, setMarkdownInput] = useState();
    function getCaretStartOfLine() {
        const textarea = document.getElementById("whereitallis");
        const caretPosition = textarea.selectionStart;
        const text = textarea.value;

        // Adjust to find the start of the line
        let startOfLine = 0;
        if (caretPosition === 0 || text.length === 0) {
            // If the caret is at the beginning or the textarea is empty,
            // return 0 as the start of the line
            return startOfLine;
        }

        // Find the position of the nearest newline character preceding the caret
        for (let i = caretPosition - 1; i >= 0; i--) {
            if (text[i] === "\n") {
                startOfLine = i + 1;
                break;
            }
        }
        console.log("Start of line:", startOfLine);
        return startOfLine;
    }

    function getCaretEndOfLine() {
        const textarea = document.getElementById("whereitallis");
        const caretPosition = textarea.selectionStart;
        const text = textarea.value;

        // End of line is assumed to be the position of the nearest newline character
        let endOfLine = text.length;
        for (let i = caretPosition; i <= text.length; i++) {
            if (text[i] === "\n") {
                endOfLine = i;
                break;
            }
        }

        console.log("End of line:", endOfLine);
        return endOfLine;
    }
    var selectedText;
    function getSelectedPortion() {
        try {
            const textarea = document.getElementById("whereitallis");
            selectedText = textarea.value.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            );
            console.log("Selected text:", selectedText);
            return selectedText;
        } catch {
            return null;
        }
    }

    function boldSelected() {
        const textarea = document.getElementById("whereitallis");
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const beforeSelection = markdownInput.substring(0, selectionStart);
        const selectedText = markdownInput.substring(
            selectionStart,
            selectionEnd
        );
        const afterSelection = markdownInput.substring(selectionEnd);

        // Check if the selected text is already bold
        if (selectedText.startsWith("**") && selectedText.endsWith("**")) {
            // Unbold the text by removing the first and last two characters
            const unboldText = selectedText.substring(
                2,
                selectedText.length - 2
            );
            setMarkdownInput(beforeSelection + unboldText + afterSelection);
        } else {
            // Bold the text by adding "**" at the beginning and end
            const boldText = `**${selectedText}**`;
            setMarkdownInput(beforeSelection + boldText + afterSelection);
        }
    }
    function addBulletPoints() {
        const textarea = document.getElementById("whereitallis");
        const startOfLine = getCaretStartOfLine();
        const endOfLine = getCaretEndOfLine();
        const textBeforeLine = markdownInput.substring(0, startOfLine);
        const lineText = markdownInput.substring(startOfLine, endOfLine);
        const textAfterLine = markdownInput.substring(endOfLine);

        // Check if the line already starts with a bullet point
        if (lineText.startsWith("- ")) {
            // Remove the bullet point
            const newText = lineText.substring(2);
            setMarkdownInput(textBeforeLine + newText + textAfterLine);
        } else {
            // Add a bullet point
            const newText = `- ${lineText}`;
            setMarkdownInput(textBeforeLine + newText + textAfterLine);
        }
    }
    function addHeading() {
        const textarea = document.getElementById("whereitallis");
        const startOfLine = getCaretStartOfLine();
        const endOfLine = getCaretEndOfLine();
        const textBeforeLine = markdownInput.substring(0, startOfLine);
        const lineText = markdownInput.substring(startOfLine, endOfLine);
        const textAfterLine = markdownInput.substring(endOfLine);
        var hashtags = "#";
        if (document.getElementById("headingamt").value != undefined) {
            hashtags = hashtags.repeat(
                parseInt(document.getElementById("headingamt").value)
            );
        }

        // Check if the line already starts with a bullet point
        if (lineText.startsWith(hashtags)) {
            // Remove the bullet point
            const newText = lineText.substring(
                parseInt(document.getElementById("headingamt").value) + 1
            );
            setMarkdownInput(textBeforeLine + newText + textAfterLine);
        } else {
            // Add a bullet point
            const newText = `${hashtags} ${lineText}`;
            setMarkdownInput(textBeforeLine + newText + textAfterLine);
        }
    }
    function toggleItalics() {
        const textarea = document.getElementById("whereitallis");
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const beforeSelection = markdownInput.substring(0, selectionStart);
        const selectedText = markdownInput.substring(
            selectionStart,
            selectionEnd
        );
        const afterSelection = markdownInput.substring(selectionEnd);

        if (selectedText.startsWith("_") && selectedText.endsWith("_")) {
            const unitalicText = selectedText.substring(
                1,
                selectedText.length - 1
            );
            setMarkdownInput(beforeSelection + unitalicText + afterSelection);
        } else {
            const italicText = `_${selectedText}_`;
            setMarkdownInput(beforeSelection + italicText + afterSelection);
        }
    }
    function toggleUnderline() {
        const textarea = document.getElementById("whereitallis");
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const beforeSelection = markdownInput.substring(0, selectionStart);
        const selectedText = markdownInput.substring(
            selectionStart,
            selectionEnd
        );
        const afterSelection = markdownInput.substring(selectionEnd);

        if (selectedText.startsWith("<u>") && selectedText.endsWith("</u>")) {
            const ununderlineText = selectedText.substring(
                3,
                selectedText.length - 4
            );
            setMarkdownInput(
                beforeSelection + ununderlineText + afterSelection
            );
        } else {
            const underlineText = `<u>${selectedText}</u>`;
            setMarkdownInput(beforeSelection + underlineText + afterSelection);
        }
    }
    function insertImage() {
        const imageUrl = prompt("Enter image URL");
        const imageMarkdown = `![alt text](${imageUrl})`;
        const textarea = document.getElementById("whereitallis");
        const caretPos = textarea.selectionStart;
        const textBeforeCaret = markdownInput.substring(0, caretPos);
        const textAfterCaret = markdownInput.substring(caretPos);

        setMarkdownInput(textBeforeCaret + imageMarkdown + textAfterCaret);
    }

    return (
        <div className="App">
            <div>
                <h1>Editing note Placeholder</h1>
            </div>
            <div className="wrapperer">
                <div className="wrapper">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <FiEye></FiEye>

                        <div className="head">&nbsp;MARKDOWN</div>
                    </div>
                    <div>
                        <button
                            style={{
                                border: " 2px solid gray",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                            onClick={() => {
                                boldSelected();
                            }}>
                            Bold
                        </button>

                        <button
                            style={{
                                border: "2px solid gray",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                            onClick={toggleItalics}>
                            Italics
                        </button>
                        <button>
                            <button
                                style={{
                                    border: " 2px solid gray",
                                    padding: "10px",
                                    borderRadius: "10px",
                                }}
                                onClick={() => {
                                    addHeading();
                                }}>
                                Heading &nbsp;
                            </button>
                            &nbsp; 1 &nbsp;
                            <input
                                min={1}
                                max={6}
                                style={{
                                    border: "2px solid gray",
                                    width: "120px",
                                    borderRadius: "10px",
                                }}
                                placeholder="Header size"
                                type="range"
                                id="headingamt"></input>
                            &nbsp; 6 &nbsp;
                        </button>

                        <button
                            style={{
                                border: "2px solid gray",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                            onClick={addBulletPoints}>
                            Bullet Points
                        </button>
                        <button
                            style={{
                                border: "2px solid gray",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                            onClick={toggleUnderline}>
                            Underline
                        </button>
                        <button
                            style={{
                                border: "2px solid gray",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                            onClick={insertImage}>
                            Insert Image
                        </button>
                    </div>
                    <textarea
                        onSelect={() => getSelectedPortion()}
                        onMouseUp={() => getSelectedPortion()}
                        id="whereitallis"
                        autoFocus
                        className="textarea"
                        value={markdownInput}
                        onChange={(e) =>
                            setMarkdownInput(e.target.value)
                        }></textarea>
                    <button
                        style={{
                            border: " 2px solid gray",
                            padding: "10px",
                            borderRadius: "10px",
                        }}
                        onClick={() => {
                            console.log(
                                document.getElementById("whereitallis").value
                            );
                        }}>
                        Save
                    </button>
                </div>
                <div className="wrapper">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <FiEye></FiEye>

                        <div className="head">&nbsp;PREIVEW</div>
                    </div>
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            code: MarkComponent,
                        }}>
                        {markdownInput}
                    </ReactMarkdown>
                </div>
            </div>
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
