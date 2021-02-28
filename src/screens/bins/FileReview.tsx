import { Avatar, BorderBox, Box, Text, Timeline } from '@primer/components'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import CodeViewer from '../../components/code-viewer'
import { CodeLineWrapper } from '../../components/code-viewer/CodeViewer'
import CommentInput from '../../components/comment-input'
import { LineWrapperProps } from '../../components/highlight/Highlight'
import { storage } from '../firebaseClient'
import { BinFile, ReviewComment } from './BinPage'

const CommentArea = ({
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

  useEffect(() => {
    if (!showComment && comments.length > 0) {
      setShowComment(true)
    }
  }, [comments.length])

  const handleSubmit = async () => {
    await fetch(`/api/bins/${binId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        lineNumber,
        fileId: fileId,
        comment: {
          content: comment,
          author: 'anonymous',
        },
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
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
                      comentou em 28/02/2021 às 19:30
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
  const { data: fileCode } = useQuery<string>(
    `file/${binId}/${file.id}`,
    async () => {
      const ref = storage.refFromURL(file.url)
      const authorizedUrl = await ref.getDownloadURL()
      const response = await fetch(authorizedUrl)
      if (!response.ok) throw new Error('An error ocurred')
      return response.text()
    }
  )

  return (
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
  )
}
