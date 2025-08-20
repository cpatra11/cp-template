import ReactMarkdown from "react-markdown";

export const Markdown = ({ children }: { children: string }) => {
  return (
    <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words">
      <ReactMarkdown
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
