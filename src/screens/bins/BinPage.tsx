import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CodeViewer from '../../components/code-viewer'
import { Language } from '../../components/select-language/SelectLanguage'
import { storage } from '../firebaseClient'

const getBinFromStorage = async (url: string) => {
  const ref = storage.refFromURL(url)
  const authorizedUrl = await ref.getDownloadURL()
  const response = await fetch(authorizedUrl)
  return (await response.blob()).text()
}

export interface BinFile {
  lang: Language
  name: string
  url: string
}

export interface Bin {
  id: string
  author: string
  files: BinFile[]
}

export const BinPage = () => {
  const { query } = useRouter()
  const [bin, setBin] = useState<Bin>()
  const [content, setContent] = useState<string>()

  useEffect(() => {
    if (query.id) {
      fetch(`/api/bins/${query.id}`).then(async (data) => {
        const newBin = await data.json()
        setBin(newBin)
        if (newBin?.files[0].url) {
          setContent(await getBinFromStorage(newBin.files[0].url))
        }
      })
    }
  }, [query.id])

  return (
    <>
      <Head>
        <title>ReviewBin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {bin && content && (
        <CodeViewer code={content ?? ''} file={bin.files[0]} />
      )}
    </>
  )
}
