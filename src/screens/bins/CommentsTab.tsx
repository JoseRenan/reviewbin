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

export const CommentsTab = ({
  comments,
  bin,
  isLoadingComments,
}: {
  bin: Bin
  comments: FileComments
  isLoadingComments: boolean
}) => {
  return (
    <>
      {!isLoadingComments &&
        bin?.files.map((file) => (
          <CodeComment
            key={file.id}
            file={file}
            comments={comments[file.id]}
            binId={bin.id}
          />
        ))}
    </>
  )
}
