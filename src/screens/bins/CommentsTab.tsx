import {
  Avatar,
  Box,
  Flash,
  Flex,
  Link,
  PointerBox,
  StyledOcticon,
  TextInput,
  Timeline,
} from '@primer/components'
import Text from '@primer/components/lib/Text'
import { EyeIcon } from '@primer/octicons-react'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { ButtonPrimary } from '../../components/buttons'
import CodeViewer from '../../components/code-viewer'
import { useAddCommentMutation } from '../../hooks/mutations'
import { useCommentsQuery } from '../../hooks/queries'
import { useAuth, Auth } from '../../hooks/useGoogleAuth'
import { CommentArea } from './FileReview'
import { Bin, BinFile, ReviewComment } from './FilesTab'

const CodeComment = ({
  file,
  comments,
  binId,
}: {
  binId: string
  file: BinFile
  comments: { [line: number]: ReviewComment[] }
}) => {
  return (
    <>
      {comments &&
        Object.keys(comments).map((lineNumber) => (
          <Box width="100%" key={lineNumber}>
            <CodeViewer
              onlyLine={+lineNumber}
              code={file.code ?? ''}
              fileName={file.name}
              langName={file.lang.name}
              lineWrapper={(props) => (
                <CommentArea
                  {...props}
                  comments={comments[props.lineNumber]}
                  fileId={file.id}
                  binId={binId}
                />
              )}
            />
          </Box>
        ))}
    </>
  )
}

export interface FileThread {
  fileId: string
  lineNumber: string
  type: 'file'
  comments: {
    [lineNumber: string]: Array<ReviewComment>
  }
  timestamp?: number
}

export interface Comment {
  type?: 'comment'
  author: Auth
  content: string
  timestamp?: number
  id?: string
}

export const CommentsTab = ({ bin }: { bin: Bin }) => {
  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(
    bin.id
  )

  const { auth: user } = useAuth()
  const router = useRouter()
  const addComment = useAddCommentMutation(bin.id)
  const [newComment, setNewComment] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addComment.mutateAsync({
      author: user ?? {
        name: 'anonymous',
      },
      content: newComment,
    })
    setNewComment('')
  }

  return (
    <>
      {comments?.length === 0 && (
        <Flash>
          <Text>
            Não há comentários a serem exibidos, adicione algum abaixo ou clique
            na tab{' '}
            <Link
              href="#"
              onClick={() =>
                router.push({ query: { tab: 'files', id: bin.id } })
              }>
              Arquivos
            </Link>{' '}
            para revisar o código e adicionar comentários diretamente nos
            arquivos
          </Text>
        </Flash>
      )}
      <Timeline>
        {!isLoadingComments &&
          comments?.map((comment) => {
            if (comment.type === 'file') {
              const file = bin.files.find((f) => f.id === comment.fileId)
              return (
                <Timeline.Item key={`${comment.fileId}-${comment.lineNumber}`}>
                  <Timeline.Badge>
                    <StyledOcticon icon={EyeIcon} />
                  </Timeline.Badge>
                  <Box width="100%">
                    <CodeComment
                      file={file!}
                      comments={comment.comments}
                      binId={bin.id}
                    />
                  </Box>
                </Timeline.Item>
              )
            } else {
              return (
                <Timeline.Item key={comment.id}>
                  <Timeline.Badge>
                    <Avatar
                      size={28}
                      src={
                        comment.author.photoUrl ??
                        'https://avatars.githubusercontent.com/primer'
                      }
                    />
                  </Timeline.Badge>
                  <Flex width="100%">
                    <PointerBox
                      width="100%"
                      ml={3}
                      mb={4}
                      bg="gray.1"
                      borderColor="gray.3"
                      caret="left-top">
                      <Box px={3} py={2}>
                        <Text fontSize={1}>
                          <Text fontWeight="bold" color="gray.8">
                            {comment.author.name}
                          </Text>{' '}
                          comentou em{' '}
                          {comment.timestamp
                            ? new Date(comment.timestamp).toLocaleDateString()
                            : 'pouco tempo atrás'}
                        </Text>
                      </Box>
                      <Box bg="white" sx={{ borderRadius: 5 }} p={3}>
                        {comment.content}
                      </Box>
                    </PointerBox>
                  </Flex>
                </Timeline.Item>
              )
            }
          })}
        <Timeline.Item>
          <Timeline.Badge>
            <Avatar
              size={28}
              src={
                user?.photoUrl ?? 'https://avatars.githubusercontent.com/primer'
              }
            />
          </Timeline.Badge>
          <PointerBox
            width="100%"
            p={2}
            ml={3}
            mb={4}
            bg="gray.1"
            borderColor="gray.3"
            caret="left-top">
            <form onSubmit={handleSubmit}>
              <TextInput
                as="textarea"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                backgroundColor="white"
                width="100%"
                placeholder="Adicionar comentário..."
                sx={{ minHeight: 150 }}
              />
              <Flex my={2} justifyContent="end">
                <ButtonPrimary type="submit">
                  Adicionar comentário
                </ButtonPrimary>
              </Flex>
            </form>
          </PointerBox>
        </Timeline.Item>
      </Timeline>
    </>
  )
}
