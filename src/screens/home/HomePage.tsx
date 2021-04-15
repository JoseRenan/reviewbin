import {
  BorderBox,
  Box,
  Flex,
  Header,
  Heading,
  Text,
  TextInput,
  Tooltip,
} from '@primer/components'
import SelectLanguage from '../../components/select-language'
import CodeEditor from '../../components/code-editor'
import { FormEvent, useState } from 'react'
import { ButtonPrimary, HeaderButton } from '../../components/buttons'
import CheckboxLabel from '../../components/checkbox-label'
import {
  Language,
  LANGUAGES,
} from '../../components/select-language/SelectLanguage'
import { Bin } from '../bins/FilesTab'
import { useRouter } from 'next/dist/client/router'
import { MainLayout } from '../MainLayout'

export const Navbar = () => (
  <Header px={5}>
    <Header.Link href="/" fontSize={2}>
      <span>ReviewBin</span>
    </Header.Link>
    <Header.Item full ml={3}>
      Crie, compartilhe e revise código instantaneamente!
    </Header.Item>
    <Header.Item mr={0}>
      <HeaderButton>Entre ou cadastre-se</HeaderButton>
    </Header.Item>
  </Header>
)

const CreateBinForm = ({ onSubmit }: { onSubmit: (data: Bin) => void }) => {
  const [lang, setLang] = useState<Language>(LANGUAGES.text)
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>()
  const [code, setCode] = useState('// Cole seu código aqui')
  const [anonymousReview, setAnonymousReview] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (file) {
      return handleSubmitFile()
    }
    const result = await fetch('/api/bins', {
      method: 'POST',
      body: JSON.stringify({
        name,
        anonymousReview,
        author: 'anonymous',
        files: [{ lang, code, filename: 'main' }],
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    onSubmit((await result.json()) as Bin)
  }

  const handleSubmitFile = async () => {
    const formData = new FormData()
    setLoading(true)
    if (file) {
      formData.append('file', file as Blob)
      formData.append('name', name)
      formData.append('author', 'anonymous')
    }
    const result = await fetch('/api/bins/upload', {
      method: 'POST',
      body: formData,
    })
    onSubmit((await result.json()) as Bin)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        disabled={loading}
        width={300}
        mr={2}
        placeholder="Nome do bin"
        onChange={(e) => setName(e.target.value)}
      />
      <Flex alignItems="center" my={3}>
        <Text>Faça upload de um .zip ou cole seu código abaixo</Text>
        <TextInput
          disabled={loading}
          ml={2}
          type="file"
          onChange={(e) => setFile(e.target.files?.item(0))}
        />
      </Flex>
      {!file && (
        <>
          <SelectLanguage
            value={lang.displayName}
            onChange={(lang) => setLang(lang)}
          />
          <BorderBox my={3}>
            <CodeEditor
              mode={lang.name}
              style={{ borderRadius: 6 }}
              value={code}
              onChange={(newCode) => setCode(newCode)}
            />
          </BorderBox>
        </>
      )}
      <Flex justifyContent="space-between">
        <Tooltip aria-label="Você precisa se cadastrar para desabilitar essa opção">
          <CheckboxLabel
            label="Permitir revisão por usuários não cadastrados"
            htmlFor="not-registered-users">
            <input
              id="not-registered-users"
              type="checkbox"
              checked={anonymousReview}
              onChange={(e) => setAnonymousReview(e.target.checked)}
              disabled
            />
          </CheckboxLabel>
        </Tooltip>
        <ButtonPrimary
          className={loading ? 'loading' : ''}
          disabled={loading}
          type="submit"
          sx={{ position: 'relative' }}>
          {!loading && <Text>Criar bin</Text>}
          <Box className="spinner" />
        </ButtonPrimary>
      </Flex>
    </form>
  )
}

export const HomePage = () => {
  const { push } = useRouter()
  return (
    <MainLayout>
      <Box px={5} py={4}>
        <Heading fontSize={4} mb={3}>
          Crie um novo bin
        </Heading>
        <CreateBinForm onSubmit={(bin) => push(`/bins/${bin.id}`)} />
      </Box>
    </MainLayout>
  )
}
