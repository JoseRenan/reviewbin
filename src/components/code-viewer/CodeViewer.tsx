import { Box, BorderBox, Text, Flex, StyledOcticon } from '@primer/components'
import { FileIcon, PlusIcon } from '@primer/octicons-react'
import { useState } from 'react'
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
              fontFamily="mono"
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
        <td style={{ width: '100%' }}>
          <Text fontFamily="mono">{codeLine}</Text>
        </td>
      </tr>
      <tr>
        <td colSpan={2}>{children}</td>
      </tr>
    </>
  )
}

export const CodeViewer = ({
  code,
  fileName,
  langName,
  lineWrapper = (props) => <CodeLineWrapper {...props} />,
}: {
  code: string
  fileName: string
  langName: string
  lineWrapper: (props: LineWrapperProps) => JSX.Element
}) => {
  return (
    <BorderBox sx={{ overflowX: 'auto' }}>
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
        <Text fontFamily="mono" fontSize={12}>
          {fileName}
        </Text>
      </Flex>
      <Highlight
        code={code}
        style={{ marginTop: 4, marginBottom: 4, fontSize: 12 }}
        language={langName}
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
