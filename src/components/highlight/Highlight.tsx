import SyntaxHighlighter from 'react-syntax-highlighter'
import createElement from 'react-syntax-highlighter/dist/cjs/create-element'
import github from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist'
import { PropsWithChildren, ReactNode } from 'react'

export type LineWrapperProps = PropsWithChildren<{ line: number; row: any }>

export interface HighlighterProps {
  language: string
  lineWrapper?: ({ children, line }: LineWrapperProps) => JSX.Element
}

export const Highlight = ({
  language,
  lineWrapper = ({ children }) => <>{children}</>,
  children,
}: PropsWithChildren<HighlighterProps>) => {
  return (
    <SyntaxHighlighter
      customStyle={{ margin: 0, padding: 0 }}
      language={language}
      style={github}
      renderer={({ rows, stylesheet, useInlineStyles }: any) => (
        <>
          {rows.map((row: any, index: any) =>
            lineWrapper({
              line: index + 1,
              row,
              children: createElement({
                node: row,
                stylesheet,
                useInlineStyles,
                key: index,
              }),
            })
          )}
        </>
      )}>
      {children}
    </SyntaxHighlighter>
  )
}
