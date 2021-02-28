import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { useQuery } from 'react-query'
import { Language } from '../../components/select-language/SelectLanguage'
import { Navbar } from '../home/HomePage'
import { FileReview } from './FileReview'

export interface BinFile {
  id: string
  lang: Language
  name: string
  url: string
}

export interface ReviewComment {
  id: string
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
  const { data: bin, isLoading: isLoadingBin } = useQuery<Bin>(
    `bin/${query.id}`,
    async () => {
      if (query.id) {
        const response = await fetch(`/api/bins/${query.id}`)
        if (!response.ok) throw new Error('An error ocurred')
        return response.json()
      }
    }
  )

  const {
    data: comments,
    isLoading: isLoadingComments,
  } = useQuery<FileComments>(`reviews/${query.id}`, async () => {
    if (query.id) {
      const response = await fetch(`/api/bins/${query.id}/reviews`)
      if (!response.ok) throw new Error('An error ocurred')
      return response.json()
    }
  })

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
            binId={query.id as string}
            file={file}
            comments={comments?.[file.id] ?? []}
          />
        ))}
    </div>
  )
}
