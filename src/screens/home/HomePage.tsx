import Head from 'next/head'

import {
  BorderBox,
  Box,
  Flex,
  Header,
  Heading,
  TextInput,
  Tooltip,
} from '@primer/components'
import SelectLanguage from '../../components/select-language'
import CodeEditor from '../../components/code-editor'
import { FormEvent, useState } from 'react'
import { ButtonPrimary, HeaderButton } from '../../components/header-button'
import CheckboxLabel from '../../components/checkbox-label'
import {
  Language,
  LANGUAGES,
} from '../../components/select-language/SelectLanguage'
import { Bin } from '../bins/BinPage'
import { useRouter } from 'next/dist/client/router'

export const Navbar = () => (
  <Header px={5}>
    <Header.Link fontSize={2}>
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
  const [code, setCode] = useState('// Cole seu código aqui')
  const [anonymousReview, setAnonymousReview] = useState(true)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await fetch('/api/bins', {
      method: 'POST',
      body: JSON.stringify({
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

  return (
    <form onSubmit={handleSubmit}>
      <Flex>
        <TextInput width={300} mr={2} placeholder="Nome do bin" />
        <SelectLanguage
          value={lang.displayName}
          onChange={(lang) => setLang(lang)}
        />
      </Flex>
      <BorderBox my={3}>
        <CodeEditor
          mode={lang.name}
          style={{ borderRadius: 6 }}
          value={code}
          onChange={(newCode) => setCode(newCode)}
        />
      </BorderBox>
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
        <ButtonPrimary type="submit">Criar bin</ButtonPrimary>
      </Flex>
    </form>
  )
}

export const HomePage = () => {
  const { push } = useRouter()
  return (
    <div>
      <Head>
        <title>ReviewBin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box px={5} py={4}>
        <Heading fontSize={4} mb={3}>
          Crie um novo bin
        </Heading>
        <CreateBinForm onSubmit={(bin) => push(`/bins/${bin.id}`)} />
      </Box>
    </div>
  )
}
