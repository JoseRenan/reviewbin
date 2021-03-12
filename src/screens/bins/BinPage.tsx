import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { Language } from '../../components/select-language/SelectLanguage'
import { useBinQuery, useCommentsQuery } from '../../hooks/queries'
import { Navbar } from '../home/HomePage'
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

export const BinPage = () => {
  const { query } = useRouter()
  const { data: bin, isLoading: isLoadingBin } = useBinQuery(query.id as string)

  const { data: comments, isLoading: isLoadingComments } = useCommentsQuery(
    query.id as string
  )

  return (
    <div>
      <Head>
        <title>ReviewBin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
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
    </div>
  )
}
