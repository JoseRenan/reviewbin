import {
  Avatar,
  BorderBox,
  Box,
  Flex,
  Text,
  Timeline,
} from '@primer/components'
import { useEffect, useState } from 'react'
import CodeViewer from '../../components/code-viewer'
import { CodeLineWrapper } from '../../components/code-viewer/CodeViewer'
import CommentInput from '../../components/comment-input'
import { LineWrapperProps } from '../../components/highlight/Highlight'
import { useAddCommentMutation } from '../../hooks/mutations'
import { useFileQuery } from '../../hooks/queries'
import { BinFile, ReviewComment } from './FilesTab'

export const CommentArea = ({
  lineNumber,
  comments = [],
  fileId,
  codeLine,
  binId,
}: LineWrapperProps & {
  fileId: string
  binId: string
  comments: ReviewComment[]
}) => {
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const addComment = useAddCommentMutation(binId)

  useEffect(() => {
    if (!showComment && comments.length > 0) {
      setShowComment(true)
    }
  }, [comments.length])

  const handleSubmit = () => {
    addComment.mutateAsync({
      lineNumber,
      fileId,
      comment: {
        content: comment,
        author: 'anonymous',
      },
    })
    setComment('')
  }

  return (
    <CodeLineWrapper
      lineNumber={lineNumber}
      codeLine={codeLine}
      onPlusClick={() => setShowComment(true)}>
      <Box
        p={2}
        hidden={!showComment}
        sx={{
          fontFamily: 'normal',
          borderTop: 'solid 1px',
          borderBottom: 'solid 1px',
          borderColor: 'gray.2',
        }}>
        <BorderBox width={740}>
          {comments.length !== 0 && (
            <Box px={1}>
              <Timeline>
                {comments.map((c) => (
                  <Timeline.Item key={`comment--${c.id}`}>
                    <Timeline.Badge>
                      <Avatar
                        size={28}
                        src="https://avatars.githubusercontent.com/primer"
                      />
                    </Timeline.Badge>
                    <Timeline.Body>
                      <Text fontWeight="bold" color="gray.8">
                        {c.author}
                      </Text>{' '}
                      {c.timestamp && (
                        <>
                          comentou em{' '}
                          {new Date(c.timestamp).toLocaleDateString()}
                        </>
                      )}
                      <Box mt={2}>{c.content}</Box>
                    </Timeline.Body>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Box>
          )}
          <Box
            p={2}
            backgroundColor="gray.1"
            sx={{ borderTop: '1px solid', borderTopColor: 'gray.2' }}>
            <CommentInput
              initialOpen={comments.length === 0}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onAddComment={handleSubmit}
              onCancel={() => comments.length === 0 && setShowComment(false)}
            />
          </Box>
        </BorderBox>
      </Box>
    </CodeLineWrapper>
  )
}

export const FileReview = ({
  binId,
  file,
  comments,
}: {
  binId: string
  file: BinFile
  comments: { [line: number]: ReviewComment[] }
}) => {
  const { data: fileCode } = useFileQuery(file.url)
  return (
    <Flex>
      <Box width={450} backgroundColor="gray.1" mr={4}>
        Aqui terá a arvore de arquivos
      </Box>
      <Box width="100%">
        <CodeViewer
          code={fileCode ?? ''}
          fileName={file.name}
          langName={file.lang.name}
          lineWrapper={(props) => (
            <CommentArea
              {...props}
              key={`${file.id}--${props.lineNumber}`}
              comments={comments[props.lineNumber]}
              fileId={file.id}
              binId={binId}
            />
          )}
        />
      </Box>
    </Flex>
  )
}
