import { BorderBox, Flex } from '@primer/components'
import { BinFile } from '../../pages/bins/BinPage'
import Highlight from '../highlight'
import { LineWrapperProps } from '../highlight/Highlight'

const CodeLine = ({ children, line, row }: LineWrapperProps) => (
  <Flex height={20}>
    {`${line}. `}
    {children}
  </Flex>
)

export const CodeViewer = ({ code, file }: { code: string; file: BinFile }) => {
  return (
    <BorderBox p={3} m={8} sx={{ overflowX: 'auto' }}>
      <Highlight
        language={file.lang.name}
        lineWrapper={(props) => <CodeLine {...props} />}>
        {code}
      </Highlight>
    </BorderBox>
  )
}
