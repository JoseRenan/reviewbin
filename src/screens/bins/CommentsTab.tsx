import { Box } from '@primer/components'
import CodeViewer from '../../components/code-viewer'
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

interface FileThread {
  fileId: string
  lineNumber: string
  type: 'file'
  comments: {
    [lineNumber: string]: Array<ReviewComment>
  }
  timestamp: number
}

interface Comment {
  type: 'comment'
  author: string
  content: string
  timestamp: number
  id: string
}

export const CommentsTab = ({
  comments,
  bin,
  isLoadingComments,
}: {
  bin: Bin
  comments: Array<FileThread | Comment>
  isLoadingComments: boolean
}) => {
  return (
    <>
      {!isLoadingComments &&
        comments.map((comment) => {
          if (comment.type === 'file') {
            const fileThread = (comment as unknown) as FileThread
            const file = bin.files.find((f) => f.id === fileThread.fileId)
            return (
              <CodeComment
                key={`${fileThread.fileId}-${fileThread.lineNumber}`}
                file={file!}
                comments={fileThread.comments}
                binId={bin.id}
              />
            )
          }
        })}
    </>
  )
}
