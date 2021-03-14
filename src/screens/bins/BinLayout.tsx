import { Box, Heading, StyledOcticon, TabNav, Text } from '@primer/components'
import { CodeSquareIcon, CommentDiscussionIcon } from '@primer/octicons-react'
import { useRouter } from 'next/dist/client/router'
import { route } from 'next/dist/next-server/server/router'
import { PropsWithChildren } from 'react'
import { useBinQuery, useCommentsQuery } from '../../hooks/queries'
import { MainLayout } from '../MainLayout'
import { BinPage } from './BinPage'

export const BinLayout = ({ children }: PropsWithChildren<{}>) => {
  const {
    query: { tab, id: binId },
    ...router
  } = useRouter()

  const { data: bin, isLoading: isLoadingBin } = useBinQuery(binId as string)

  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(
    binId as string
  )

  return (
    <MainLayout>
      <Box mx={200} my={4}>
        <Heading fontSize={5} mb={2} fontWeight="normal">
          Testeee
        </Heading>
        <Text fontSize={1} color="text.gray">
          Criado por <Text fontWeight="bold">anonymous</Text> on{' '}
          <Text fontWeight="bold">19/03/2021</Text>
        </Text>
        <TabNav my={4}>
          <TabNav.Link
            selected={tab !== 'files'}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              router.push(
                { query: { tab: 'conversation', id: binId } },
                undefined,
                {
                  shallow: true,
                }
              )
            }>
            <StyledOcticon icon={CommentDiscussionIcon} mr={2} size={16} />
            Comentários
          </TabNav.Link>
          <TabNav.Link
            selected={tab === 'files'}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              router.push({ query: { tab: 'files', id: binId } }, undefined, {
                shallow: true,
              })
            }>
            <StyledOcticon icon={CodeSquareIcon} mr={2} size={16} />
            Arquivos
          </TabNav.Link>
        </TabNav>
        {tab === 'files' && (
          <BinPage
            bin={bin!}
            comments={comments!}
            isLoadingBin={isLoadingBin}
            isLoadingComments={isLoadingComments}
          />
        )}
        {tab !== 'files' && (
          <div>
            Vai ter comentários aqui, clica na outra seção que tem bolo...
          </div>
        )}
      </Box>
    </MainLayout>
  )
}
