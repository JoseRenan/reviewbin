import { useRouter } from 'next/dist/client/router'
import { Language } from '../../components/select-language/SelectLanguage'
import { useBinQuery, useCommentsQuery } from '../../hooks/queries'
import { FileReview } from './FileReview'

export interface BinFile {
  id: string
  lang: Language
  name: string
  url: string
}

export interface ReviewComment {
  id?: string
  author: string
  content: string
}

export interface FileComments {
  [file: string]: {
    [line: number]: ReviewComment[]
  }
}

export interface Bin {
  id: string
  author: string
  files: BinFile[]
}

export const FilesTab = ({
  bin,
  comments,
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
          <FileReview
            key={file.id}
            binId={bin.id}
            file={file}
            comments={comments?.[file.id] ?? []}
          />
        ))}
    </>
  )
}
