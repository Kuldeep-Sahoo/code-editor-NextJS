import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AboutPage() {
  // Read the README.md file from root directory
  const readmePath = path.join(process.cwd(), 'README.md');
  const markdownContent = fs.readFileSync(readmePath, 'utf8');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-white mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-semibold text-white mt-8 mb-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-gray-200 mt-6 mb-3" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
              a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300 underline" {...props} />,
              code: ({node, inline, ...props}: any) => 
                inline 
                  ? <code className="bg-gray-800 text-purple-300 px-2 py-1 rounded" {...props} />
                  : <code className="block bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4" {...props} />,
              img: ({node, ...props}) => <img className="rounded-lg shadow-lg my-6" {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
