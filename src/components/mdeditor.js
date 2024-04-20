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

// export default function Mdeditor() {
//   return (
//     <div id="container">
//       <h1>Quill JS Editor</h1>
//       <hr />
//       <div id="editor-container"></div>

//       <h1>Rendered Markdown</h1>
//       <hr />
//       <div id="output-markdown"></div>

//       <h1>Rendered HTML</h1>
//       <hr />
//       <div id="output-quill"></div>

//       <h1>RAW HTML</h1>
//       <hr />
//       <div id="html"></div>

//       <h1>Markdown Code</h1>
//       <hr />
//       <div>
//         <pre id="markdown"></pre>
//       </div>
//     </div>
//   );
// }
// function init(raw_markdown) {
//   var options = {
//     modules: {
//       toolbar: [
//         [{ header: [1, 2, false] }],
//         ["bold", "italic", "underline"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["image", "code-block"],
//       ],
//     },
//     placeholder: "Compose an epic...",
//     theme: "snow", // or 'bubble'
//   };
//   var quilleditor = document.getElementById("editor-container");
//   var quill = new Quill(quilleditor, options);

//   var md = window.markdownit();
//   md.set({
//     html: true,
//   });

//   var result = md.render(raw_markdown);

//   quill.clipboard.dangerouslyPasteHTML(result + "\n");

//   // Need to do a first pass when we're passing in initial data.
//   var html = quill.container.firstChild.innerHTML;
//   $("#markdown").text(toMarkdown(html));
//   $("#html").text(html);
//   $("#output-quill").html(html);
//   $("#output-markdown").html(result);

//   // text-change might not be the right event hook. Works for now though.
//   quill.on("text-change", function (delta, source) {
//     var html = quill.container.firstChild.innerHTML;
//     var markdown = toMarkdown(html);
//     var rendered_markdown = md.render(markdown);
//     $("#markdown").text(markdown);
//     $("#html").text(html);
//     $("#output-quill").html(html);
//     $("#output-markdown").html(rendered_markdown);
//   });
// }

// // Just some fake markdown that would come from the server.

// var text = "";
// text += "# Dillinger" + "\n";
// text += " " + "\n";
// text +=
//   "[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)" +
//   "\n";
// text += " " + "\n";
// text +=
//   "Dillinger is a cloud-enabled, mobile-ready, offline-storage, AngularJS powered HTML5 Markdown editor." +
//   "\n";
// text += " " + "\n";
// text += "  - Type some Markdown on the left" + "\n";
// text += "  - See HTML in the right" + "\n";
// text += "  - Magic" + "\n";
// text += " " + "\n";
// text += "# New Features!" + "\n";
// text += " " + "\n";
// text +=
//   "  - Import a HTML file and watch it magically convert to Markdown" + "\n";
// text +=
//   "  - Drag and drop images (requires your Dropbox account be linked)" + "\n";
// text += " " + "\n";
// text += " " + "\n";
// text += "You can also:" + "\n";
// text +=
//   "  - Import and save files from GitHub, Dropbox, Google Drive and One Drive" +
//   "\n";
// text += "  - Drag and drop markdown and HTML files into Dillinger" + "\n";
// text += "  - Export documents as Markdown, HTML and PDF" + "\n";
// text += " " + "\n";
// text +=
//   "Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]" +
//   "\n";
// text += " " + "\n";
// text += "> The overriding design goal for Markdown's" + "\n";
// text += "> formatting syntax is to make it as readable" + "\n";
// text += "> as possible. The idea is that a" + "\n";
// text += "> Markdown-formatted document should be" + "\n";
// text += "> publishable as-is, as plain text, without" + "\n";
// text += "> looking like it's been marked up with tags" + "\n";
// text += "> or formatting instructions." + "\n";
// text += " " + "\n";
// text +=
//   "This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right." +
//   "\n";
// text += " " + "\n";
// text += "### Tech" + "\n";
// text += " " + "\n";
// text +=
//   "Dillinger uses a number of open source projects to work properly:" + "\n";
// text += " " + "\n";
// text += "* [AngularJS] - HTML enhanced for web apps!" + "\n";
// text += "* [Ace Editor] - awesome web-based text editor" + "\n";
// text +=
//   "* [markdown-it] - Markdown parser done right. Fast and easy to extend." +
//   "\n";
// text +=
//   "* [Twitter Bootstrap] - great UI boilerplate for modern web apps" + "\n";
// text += "* [node.js] - evented I/O for the backend" + "\n";
// text +=
//   "* [Express] - fast node.js network app framework [@tjholowaychuk]" + "\n";
// text += "* [Gulp] - the streaming build system" + "\n";
// text +=
//   "* [Breakdance](http://breakdance.io) - HTML to Markdown converter" + "\n";
// text += "* [jQuery] - duh" + "\n";
// text += " " + "\n";
// text +=
//   "And of course Dillinger itself is open source with a [public repository][dill]" +
//   "\n";
// text += " on GitHub." + "\n";
// text += " " + "\n";
// text += "### Installation" + "\n";
// text += " " + "\n";
// text += "Dillinger requires [Node.js](https://nodejs.org/) v4+ to run." + "\n";
// text += " " + "\n";
// text +=
//   "Install the dependencies and devDependencies and start the server." + "\n";
// text += " " + "\n";
// text += "```sh" + "\n";
// text += "$ cd dillinger" + "\n";
// text += "$ npm install -d" + "\n";
// text += "$ node app" + "\n";
// text += "```" + "\n";
// text += " " + "\n";
// text += "For production environments..." + "\n";
// text += " " + "\n";
// text += "```sh" + "\n";
// text += "$ npm install --production" + "\n";
// text += "$ npm run predeploy" + "\n";
// text += "$ NODE_ENV=production node app" + "\n";
// text += "```" + "\n";
// text += " " + "\n";
// text += "### Plugins" + "\n";
// text += " " + "\n";
// text +=
//   "Dillinger is currently extended with the following plugins. Instructions on how to use them in your own application are linked below." +
//   "\n";
// text += " " + "\n";
// text += "| Plugin | README |" + "\n";
// text += "| ------ | ------ |" + "\n";
// text += "| Dropbox | [plugins/dropbox/README.md] [PlDb] |" + "\n";
// text += "| Github | [plugins/github/README.md] [PlGh] |" + "\n";
// text += "| Google Drive | [plugins/googledrive/README.md] [PlGd] |" + "\n";
// text += "| OneDrive | [plugins/onedrive/README.md] [PlOd] |" + "\n";
// text += "| Medium | [plugins/medium/README.md] [PlMe] |" + "\n";
// text +=
//   "| Google Analytics | [plugins/googleanalytics/README.md] [PlGa] |" + "\n";
// text += " " + "\n";
// text += " " + "\n";
// text += "### Development" + "\n";
// text += " " + "\n";
// text += "Want to contribute? Great!" + "\n";
// text += " " + "\n";
// text += "Dillinger uses Gulp + Webpack for fast developing." + "\n";
// text +=
//   "Make a change in your file and instantanously see your updates!" + "\n";
// text += " " + "\n";
// text += "Open your favorite Terminal and run these commands." + "\n";
// text += " " + "\n";
// text += "First Tab:" + "\n";
// text += "```sh" + "\n";
// text += "$ node app" + "\n";
// text += "```" + "\n";
// text += " " + "\n";
// text += "Second Tab:" + "\n";
// text += "```sh" + "\n";
// text += "$ gulp watch" + "\n";
// text += "```" + "\n";
// text += " " + "\n";
// text += "(optional) Third:" + "\n";
// text += "```sh" + "\n";
// text += "$ karma test" + "\n";
// text += "```" + "\n";
// text += "#### Building for source" + "\n";
// text += "For production release:" + "\n";
// text += "```sh" + "\n";
// text += "$ gulp build --prod" + "\n";
// text += "```" + "\n";
// text += "Generating pre-built zip archives for distribution:" + "\n";
// text += "```sh" + "\n";
// text += "$ gulp build dist --prod" + "\n";
// text += "```" + "\n";
// text += "### Docker" + "\n";
// text +=
//   "Dillinger is very easy to install and deploy in a Docker container." + "\n";
// text += " " + "\n";
// text +=
//   "By default, the Docker will expose port 80, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image." +
//   "\n";
// text += " " + "\n";
// text += "```sh" + "\n";
// text += "cd dillinger" + "\n";
// text += "docker build -t joemccann/dillinger:${package.json.version}" + "\n";
// text += "```" + "\n";
// text +=
//   "This will create the dillinger image and pull in the necessary dependencies. Be sure to swap out `${package.json.version}` with the actual version of Dillinger." +
//   "\n";
// text += " " + "\n";
// text +=
//   "Once done, run the Docker image and map the port to whatever you wish on your host. In this example, we simply map port 8000 of the host to port 80 of the Docker (or whatever port was exposed in the Dockerfile):" +
//   "\n";
// text += " " + "\n";
// text += "```sh" + "\n";
// text +=
//   'docker run -d -p 8000:8080 --restart="always" <youruser>/dillinger:${package.json.version}' +
//   "\n";
// text += "```" + "\n";
// text += " " + "\n";
// text +=
//   "Verify the deployment by navigating to your server address in your preferred browser." +
//   "\n";
// text += " " + "\n";
// text += "```sh" + "\n";
// text += "127.0.0.1:8000" + "\n";
// text += "```" + "\n";
// text += " " + "\n";
// text += "#### Kubernetes + Google Cloud" + "\n";
// text += " " + "\n";
// text +=
//   "See [KUBERNETES.md](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md)" +
//   "\n";
// text += " " + "\n";
// text += " " + "\n";
// text += "### Todos" + "\n";
// text += " " + "\n";
// text += " - Write MOAR Tests" + "\n";
// text += " - Add Night Mode" + "\n";
// text += " " + "\n";
// text += "License" + "\n";
// text += "----" + "\n";
// text += " " + "\n";
// text += "MIT" + "\n";
// text += " " + "\n";
// text += " " + "\n";
// text += "**Free Software, Hell Yeah!**" + "\n";
// text += " " + "\n";
// text +=
//   "[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)" +
//   "\n";
// text += " " + "\n";
// text += " " + "\n";
// text += "   [dill]: <https://github.com/joemccann/dillinger>" + "\n";
// text +=
//   "   [git-repo-url]: <https://github.com/joemccann/dillinger.git>" + "\n";
// text += "   [john gruber]: <http://daringfireball.net>" + "\n";
// text += "   [df1]: <http://daringfireball.net/projects/markdown/>" + "\n";
// text += "   [markdown-it]: <https://github.com/markdown-it/markdown-it>" + "\n";
// text += "   [Ace Editor]: <http://ace.ajax.org>" + "\n";
// text += "   [node.js]: <http://nodejs.org>" + "\n";
// text +=
//   "   [Twitter Bootstrap]: <https://twitter.github.com/bootstrap/>" + "\n";
// text += "   [jQuery]: <https://jquery.com>" + "\n";
// text += "   [@tjholowaychuk]: <https://twitter.com/tjholowaychuk>" + "\n";
// text += "   [express]: <http://expressjs.com>" + "\n";
// text += "   [AngularJS]: <https://angularjs.org>" + "\n";
// text += "   [Gulp]: <http://gulpjs.com>" + "\n";
// text += " " + "\n";
// text +=
//   "   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>" +
//   "\n";
// text +=
//   "   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>" +
//   "\n";
// text +=
//   "   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>" +
//   "\n";
// text +=
//   "   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>" +
//   "\n";
// text +=
//   "   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>" +
//   "\n";
// text +=
//   "   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>" +
//   "\n";

// text = "<ol><li>List Item 1<li><li><ol><li>Point a</li></ol></li></ol>";

// init(text);
