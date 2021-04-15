import {
  Box,
  Flex,
  Heading,
  StyledOcticon,
  TabNav,
  Text,
  useSafeTimeout,
} from '@primer/components'
import {
  CheckIcon,
  CodeSquareIcon,
  CommentDiscussionIcon,
  ShareIcon,
} from '@primer/octicons-react'
import { useRouter } from 'next/dist/client/router'
import { MainLayout } from '../MainLayout'
import { Bin, FilesTab } from './FilesTab'
import { CommentsTab } from './CommentsTab'
import { Button } from '../../components/buttons'
import { useState } from 'react'

export const BinPage = ({ bin }: { bin: Bin }) => {
  const {
    query: { tab, id: binId },
    ...router
  } = useRouter()
  const [copied, setCopied] = useState(false)
  const { safeSetTimeout } = useSafeTimeout()
  return (
    <MainLayout>
      <Box mx={200} my={4}>
        <Flex alignItems="baseline" justifyContent="space-between">
          <Heading fontSize={5} mb={2} fontWeight="normal">
            {bin.name}
          </Heading>
          <Flex alignItems="baseline">
            {copied && (
              <>
                <Text sx={{ display: 'inline-block' }}>Copiado</Text>
                <StyledOcticon
                  icon={CheckIcon}
                  color="icon.success"
                  mx={2}
                  size={16}
                />
              </>
            )}
            <Button
              height="min-content"
              onClick={() => {
                navigator.clipboard.writeText(window.location.toString())
                setCopied(true)
                safeSetTimeout(() => setCopied(false), 3000)
              }}>
              <StyledOcticon icon={ShareIcon} mr={2} size={16} />
              <Text sx={{ display: 'inline-block' }}>
                Copiar URL para compartilhar
              </Text>
            </Button>
          </Flex>
        </Flex>
        <Text fontSize={1} color="text.gray">
          Criado por <Text fontWeight="bold">{bin.author}</Text> em{' '}
          <Text fontWeight="bold">
            {bin?.timestamp && (
              <>{new Date(bin.timestamp).toLocaleDateString()}</>
            )}
          </Text>
        </Text>
        <TabNav my={4}>
          <TabNav.Link
            selected={tab !== 'files'}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              router.push({ query: { tab: 'conversation', id: binId } })
            }>
            <StyledOcticon icon={CommentDiscussionIcon} mr={2} size={16} />
            Comentários
          </TabNav.Link>
          <TabNav.Link
            selected={tab === 'files'}
            style={{ cursor: 'pointer' }}
            onClick={() => router.push({ query: { tab: 'files', id: binId } })}>
            <StyledOcticon icon={CodeSquareIcon} mr={2} size={16} />
            Arquivos
          </TabNav.Link>
        </TabNav>
        {tab === 'files' && <FilesTab bin={bin!} />}
        {tab !== 'files' && <CommentsTab bin={bin!} />}
      </Box>
    </MainLayout>
  )
}
