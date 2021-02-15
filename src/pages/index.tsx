import Head from 'next/head'

import {
  BorderBox,
  Box,
  ButtonPrimary,
  Flex,
  Header,
  Heading,
  TextInput,
  Tooltip,
} from '@primer/components'
import SelectLanguage from '../components/select-language'
import CodeEditor from '../components/code-editor'
import { useState } from 'react'
import HeaderButton from '../components/header-button'
import CheckboxLabel from '../components/checkbox-label'

const Navbar = () => (
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

const Home = () => {
  const [mode, setMode] = useState({ name: 'text' })
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
        <Flex>
          <TextInput width={300} mr={2} placeholder="Nome do bin" />
          <SelectLanguage
            value={mode.name}
            onChange={(lang) => setMode(lang)}
          />
        </Flex>
        <BorderBox my={3}>
          <CodeEditor mode={mode.name} style={{ borderRadius: 6 }} />
        </BorderBox>
        <Flex justifyContent="space-between">
          <Tooltip aria-label="Você precisa se cadastrar para desabilitar essa opção">
            <CheckboxLabel
              label="Permitir revisão por usuários não cadastrados"
              htmlFor="not-registered-users">
              <input
                id="not-registered-users"
                type="checkbox"
                checked
                disabled
              />
            </CheckboxLabel>
          </Tooltip>
          <ButtonPrimary>Criar bin</ButtonPrimary>
        </Flex>
      </Box>
    </div>
  )
}

export default Home
