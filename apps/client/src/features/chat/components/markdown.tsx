import type { Components } from 'react-markdown'
import { lazy, memo } from 'react'
import remarkGfm from 'remark-gfm'
// import { CodeBlock } from './code-block'

const ReactMarkdown = lazy(() => import('react-markdown'))

const components: Partial<Components> = {
  // code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  ol: ({ node: _, children, ...props }) => {
    return (
      <ol className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ol>
    )
  },
  li: ({ node: _, children, ...props }) => {
    return (
      <li className="py-2" {...props}>
        {children}
      </li>
    )
  },
  ul: ({ node: _, children, ...props }) => {
    return (
      <ul className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ul>
    )
  },
  strong: ({ node: _, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    )
  },
  a: ({ node: _, children, ...props }) => {
    return (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  h1: ({ node: _, children, ...props }) => {
    return (
      <h1 className="mt-2 mb-2 text-3xl font-semibold" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ node: _, children, ...props }) => {
    return (
      <h2 className="mt-6 mb-2 text-2xl font-semibold" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ node: _, children, ...props }) => {
    return (
      <h3 className="mt-6 mb-2 text-xl font-semibold" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ node: _, children, ...props }) => {
    return (
      <h4 className="mt-6 mb-2 text-lg font-semibold" {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ node: _, children, ...props }) => {
    return (
      <h5 className="mt-6 mb-2 text-base font-semibold" {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ node: _, children, ...props }) => {
    return (
      <h6 className="mt-6 mb-2 text-sm font-semibold" {...props}>
        {children}
      </h6>
    )
  },
}

const remarkPlugins = [remarkGfm]

function NonMemoizedMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
)
