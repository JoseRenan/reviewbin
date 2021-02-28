import { Box, Flex, TextInput } from '@primer/components'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import CodeViewer from '../../components/code-viewer'
import { CodeLineWrapper } from '../../components/code-viewer/CodeViewer'
import { Button, ButtonPrimary } from '../../components/header-button'
import { LineWrapperProps } from '../../components/highlight/Highlight'
import { storage } from '../firebaseClient'
import { BinFile, Comment } from './BinPage'

const CommentArea = ({
  lineNumber,
  comments = [],
  fileId,
  codeLine,
  binId,
}: LineWrapperProps & {
  fileId: string
  binId: string
  comments: Comment[]
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
        hidden={!showComment}
        px={2}
        py={2}
        sx={{
          fontFamily: 'normal',
          borderTop: 'solid 1px',
          borderBottom: 'solid 1px',
          borderColor: 'gray.2',
        }}>
        <TextInput
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          block
          as="textarea"
        />
        <Flex my={1} justifyContent="end">
          <Button mr={1} onClick={() => setShowComment(false)}>
            Cancelar
          </Button>
          <ButtonPrimary onClick={handleSubmit}>
            Adicionar comentário
          </ButtonPrimary>
        </Flex>
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
  comments: { [line: number]: Comment[] }
}) => {
  console.log(comments)

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
