import { Box } from '@primer/components'
import CodeViewer from '../../components/code-viewer'
import { useFileQuery } from '../../hooks/queries'
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
  const { data: fileCode } = useFileQuery(file.url)

  return (
    <>
      {comments &&
        Object.keys(comments).map((lineNumber) => (
          <Box width="100%" mb={4}>
            <CodeViewer
              onlyLine={+lineNumber}
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
        ))}
    </>
  )
}

export const CommentsTab = ({
  comments,
  bin,
  isLoadingBin,
  isLoadingComments,
}: {
  bin: Bin
  comments: FileComments
  isLoadingBin: boolean
  isLoadingComments: boolean
}) => {
  return (
    <>
      {!isLoadingBin &&
        !isLoadingComments &&
        bin?.files.map((file) => (
          <CodeComment
            file={file}
            comments={comments[file.id]}
            binId={bin.id}
          />
        ))}
    </>
  )
}
