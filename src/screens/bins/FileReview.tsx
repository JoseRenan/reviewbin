import { Avatar, BorderBox, Box, Text, Timeline } from '@primer/components'
import { useEffect, useState } from 'react'
import CodeViewer from '../../components/code-viewer'
import { CodeLineWrapper } from '../../components/code-viewer/CodeViewer'
import CommentInput from '../../components/comment-input'
import { LineWrapperProps } from '../../components/highlight/Highlight'
import { useAddFileReviewMutation } from '../../hooks/mutations'
import { useAuth } from '../../hooks/useGoogleAuth'
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
  const { auth: user } = useAuth()
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const addComment = useAddFileReviewMutation(binId)

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
        author: user ?? {
          name: 'anonymous',
          photoUrl: 'https://avatars.githubusercontent.com/primer',
        },
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
        hidden={!showComment}
        as="td"
        sx={{
          borderTop: 'solid 1px',
          borderBottom: 'solid 1px',
          borderColor: 'gray.2',
        }}
      />
      <Box
        as="td"
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
                        src={
                          c.author.photoUrl ??
                          'https://avatars.githubusercontent.com/primer'
                        }
                      />
                    </Timeline.Badge>
                    <Timeline.Body>
                      <Text fontWeight="bold" color="gray.8">
                        {c.author.name}
                      </Text>{' '}
                      {c.timestamp && (
                        <>
                          comentou em{' '}
                          {new Date(c.timestamp).toLocaleDateString()}
                        </>
                      )}
                      <Box mt={2}>
                        <Text whiteSpace="normal">{c.content}</Text>
                      </Box>
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
              avatarUrl={
                user?.photoUrl ?? 'https://avatars.githubusercontent.com/primer'
              }
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
  return (
    <Box width="100%" sx={{ maxWidth: 'inherit' }}>
      <CodeViewer
        code={file.code || ''}
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
  )
}
