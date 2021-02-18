import { BorderBox, Text, Flex, StyledOcticon } from '@primer/components'
import { FileIcon } from '@primer/octicons-react'
import { BinFile } from '../../screens/bins/BinPage'
import Highlight from '../highlight'
import { LineWrapperProps } from '../highlight/Highlight'

const CodeLine = ({ children, lineNumber }: LineWrapperProps) => (
  <tr style={{ height: 20 }}>
    <td
      style={{
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 10,
        userSelect: 'none',
      }}>
      <Text fontFamily="monospace" color="gray.4">
        {lineNumber}
      </Text>
    </td>
    <td style={{ userSelect: 'text' }}>{children}</td>
  </tr>
)

export const CodeViewer = ({ code, file }: { code: string; file: BinFile }) => {
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
          <table>
            <tbody>{children}</tbody>
          </table>
        )}
        lineWrapper={(props) => <CodeLine {...props} />}
      />
    </BorderBox>
  )
}
