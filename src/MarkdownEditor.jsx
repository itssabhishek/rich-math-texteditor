import React, { useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import katex from "katex";
import "katex/dist/katex.css";
import "./styles.css";
import EquationEditor from "equation-editor-react";
const mdKaTeX = `click on summation icon
`;

const MarkdownEditor = () => {
  const [value, setValue] = React.useState(mdKaTeX);
  const [openEquationEditor, setOpenEquationEditor] = React.useState(false);
  const [equation, setEquation] = React.useState("y=x");
  const summation = {
    name: "summation",
    keyCommand: "summation",
    buttonProps: { "aria-label": "Insert summation" },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18">
        <path d="M6.646 15.271v-.813L10.875 10 6.646 5.542v-.813h6.708v.542H7.208l4.5 4.729-4.5 4.729h6.146v.542Z" />
      </svg>
    ),
    execute: (state, api) => {
      setOpenEquationEditor((prev) => !prev);
      let modifyText = `
\`\`\`KaTeX
      ${equation} " " ${state.selectedText}
\`\`\`
        `;
      if (!state.selectedText) {
        modifyText = `
\`\`\`KaTeX
      ${equation}
\`\`\`
            `;
      }
      api.replaceSelection(setEquation(modifyText));
    }
  };

  useEffect(() => {
    setValue(equation);
  }, [equation]);
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
        commands={[
          // Custom Toolbars
          summation
        ]}
        previewOptions={{
          components: {
            code: ({ inline, children, className, ...props }) => {
              const txt = children[0] || "";
              if (inline) {
                if (typeof txt === "string" && /^\$\$(.*)\$\$/.test(txt)) {
                  const html = katex.renderToString(
                    txt.replace(/^\$\$(.*)\$\$/, "$1"),
                    {
                      throwOnError: false
                    }
                  );
                  return <code dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return <code>{txt}</code>;
              }
              if (
                typeof txt === "string" &&
                typeof className === "string" &&
                /^language-katex/.test(className.toLocaleLowerCase())
              ) {
                const html = katex.renderToString(txt, {
                  throwOnError: false
                });
                console.log("props", txt, className, props);
                return <code dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return <code className={String(className)}>{txt}</code>;
            }
          }
        }}
      />
      {openEquationEditor && (
        <div class="equationEditor">
          <EquationEditor
            value={equation}
            onChange={setEquation}
            autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
            autoOperatorNames="sin cos tan"
          />
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
