'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  textColor?: string;
}

export default function MarkdownRenderer({ content, className = '', textColor = 'text-gray-700' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customizar componentes para melhor integração com o design
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-gray-900 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-gray-800 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-medium text-gray-700 mb-1">{children}</h3>
          ),
          p: ({ children }) => (
            <p className={`text-sm ${textColor} mb-2 leading-relaxed`}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc list-inside text-sm ${textColor} mb-2 space-y-1`}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-inside text-sm ${textColor} mb-2 space-y-1`}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className={`text-sm ${textColor}`}>{children}</li>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto text-xs">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-green-500 pl-3 italic text-gray-600 my-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border border-gray-200 rounded-lg text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 bg-gray-50 px-2 py-1 text-left font-medium text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-2 py-1 text-gray-700">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-green-600 hover:text-green-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
