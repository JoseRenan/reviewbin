import { Box, Flex, TextInput } from '@primer/components'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CodeViewer from '../../components/code-viewer'
import { CodeLineWrapper } from '../../components/code-viewer/CodeViewer'
import { Button, ButtonPrimary } from '../../components/header-button'
import { LineWrapperProps } from '../../components/highlight/Highlight'
import { Language } from '../../components/select-language/SelectLanguage'
import { storage } from '../firebaseClient'
import { Navbar } from '../home/HomePage'

const getBinFromStorage = async (url: string) => {
  const ref = storage.refFromURL(url)
  const authorizedUrl = await ref.getDownloadURL()
  const response = await fetch(authorizedUrl)
  return (await response.blob()).text()
}

export interface BinFile {
  id: string
  lang: Language
  name: string
  url: string
}

export interface Bin {
  id: string
  author: string
  files: BinFile[]
}

const CommentArea = ({
  lineNumber,
  file,
  codeLine,
  binId,
  key,
}: LineWrapperProps & { file: BinFile; binId: string }) => {
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    const result = await fetch(`/api/bins/${binId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        lineNumber,
        fileId: file.id,
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
      key={key}
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
    <div>
      <Head>
        <title>ReviewBin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {bin && content && (
        <CodeViewer
          code={content ?? ''}
          file={bin.files[0]}
          lineWrapper={(props) => (
            <CommentArea {...props} file={bin.files[0]} binId={bin.id} />
          )}
        />
      )}
    </div>
  )
}
