import { FileComments } from './FilesTab'

export const CommentsTab = ({
  comments,
  isLoadingBin,
  isLoadingComments,
}: {
  comments: FileComments
  isLoadingBin: boolean
  isLoadingComments: boolean
}) => {
  return <>{JSON.stringify(comments)}</>
}
