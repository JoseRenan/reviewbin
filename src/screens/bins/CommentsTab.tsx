import { Avatar, Box, Flex, PointerBox, TextInput } from '@primer/components'
import Text from '@primer/components/lib/Text'
import { FormEvent, useState } from 'react'
import { Button, ButtonPrimary } from '../../components/buttons'
import CodeViewer from '../../components/code-viewer'
import CommentInput from '../../components/comment-input'
import { useAddCommentMutation } from '../../hooks/mutations'
import { useCommentsQuery } from '../../hooks/queries'
import { CommentArea } from './FileReview'
import { FileComments, Bin, BinFile, ReviewComment } from './FilesTab'

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
          <Box width="100%" mb={4} key={lineNumber}>
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
  timestamp: number
}

export interface Comment {
  type?: 'comment'
  author: string
  content: string
  timestamp?: number
  id?: string
}

export const CommentsTab = ({ bin }: { bin: Bin }) => {
  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(
    bin.id
  )

  const addComment = useAddCommentMutation(bin.id)
  const [newComment, setNewComment] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addComment.mutateAsync({
      author: 'anonymous',
      content: newComment,
    })
    setNewComment('')
  }

  return (
    <>
      {!isLoadingComments &&
        comments?.map((comment) => {
          if (comment.type === 'file') {
            const file = bin.files.find((f) => f.id === comment.fileId)
            return (
              <CodeComment
                key={`${comment.fileId}-${comment.lineNumber}`}
                file={file!}
                comments={comment.comments}
                binId={bin.id}
              />
            )
          } else {
            return (
              <Flex width="100%">
                <Avatar
                  size={28}
                  src="https://avatars.githubusercontent.com/primer"
                />
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
                        {comment.author}
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
            )
          }
        })}
      <PointerBox
        mt={2}
        p={2}
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
            <ButtonPrimary type="submit">Adicionar comentário</ButtonPrimary>
          </Flex>
        </form>
      </PointerBox>
    </>
  )
}
