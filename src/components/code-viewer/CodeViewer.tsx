import { Box, BorderBox, Text, Flex, StyledOcticon } from '@primer/components'
import { FileIcon, PlusIcon } from '@primer/octicons-react'
import { useState } from 'react'
import { BinFile } from '../../screens/bins/BinPage'
import Highlight from '../highlight'
import { LineWrapperProps } from '../highlight/Highlight'

export interface CommentAreaProps {
  lineNumber: number
  codeLine: JSX.Element[]
}

export const CodeLineWrapper = ({
  children,
  lineNumber,
  codeLine,
  onPlusClick,
}: LineWrapperProps & {
  onPlusClick?: (lineNumber: number) => void
}) => {
  const [showButton, setShowButton] = useState(false)
  const hover = (isHovered: boolean) => {
    setShowButton(isHovered)
  }
  return (
    <>
      <tr
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        style={{ width: '100%' }}>
        <td
          style={{
            paddingRight: 20,
            paddingLeft: 10,
            userSelect: 'none',
          }}>
          <Flex sx={{ position: 'relative', textAlign: 'right' }}>
            <Text
              as={Box}
              textAlign="right"
              fontFamily="monospace"
              color="gray.4"
              lineHeight="18px"
              sx={{ width: '100%' }}>
              {lineNumber}
            </Text>
            {onPlusClick && (
              <Box
                role="button"
                onClick={() => onPlusClick(lineNumber)}
                width="20px"
                height="20px"
                aria-hidden={!showButton}
                hidden={!showButton}
                sx={{
                  position: 'absolute',
                  right: '-22px',
                  backgroundColor: 'blue.5',
                  textAlign: 'center',
                  borderRadius: 2,
                }}>
                <StyledOcticon
                  verticalAlign="middle"
                  size={14}
                  color="white"
                  icon={PlusIcon}
                />
              </Box>
            )}
          </Flex>
        </td>
        <td style={{ width: '100%' }}>{codeLine}</td>
      </tr>
      <tr>
        <td colSpan={2}>{children}</td>
      </tr>
    </>
  )
}

export const CodeViewer = ({
  code,
  file,
  lineWrapper = (props) => <CodeLineWrapper {...props} />,
}: {
  code: string
  file: BinFile
  lineWrapper: (props: LineWrapperProps) => JSX.Element
}) => {
  return (
    <BorderBox m={8} sx={{ overflowX: 'auto' }}>
      <Flex
        height={40}
        px={3}
        sx={{
          backgroundColor: 'gray.1',
          alignItems: 'center',
          fontSize: 12,
          borderBottom: 'solid 1px',
          borderBottomColor: 'gray.2',
        }}>
        <StyledOcticon color="gray.4" mr={2} icon={FileIcon} />
        <Text fontFamily="monospace" fontSize={12}>
          {file.name}
        </Text>
      </Flex>
      <Highlight
        code={code}
        style={{ marginTop: 4, marginBottom: 4, fontSize: 12 }}
        language={file.lang.name}
        codeWrapper={({ children }) => (
          <table width="100%">
            <tbody>{children}</tbody>
          </table>
        )}
        lineWrapper={lineWrapper}
      />
    </BorderBox>
  )
}
