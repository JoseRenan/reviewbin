import { Button, SelectMenu, Text, TextInput } from '@primer/components'
import { TriangleDownIcon } from '@primer/octicons-react'
import { useState } from 'react'

export interface Language {
  displayName: string
  name: string
  fileExtension: string
}

export const LANGUAGES = {
  text: {
    name: 'text',
    displayName: 'Nenhuma',
    fileExtension: 'txt',
  },
  javascript: {
    name: 'javascript',
    displayName: 'Javascript',
    fileExtension: 'js',
  },
  java: {
    name: 'java',
    displayName: 'Java',
    fileExtension: 'java',
  },
  python: {
    name: 'python',
    displayName: 'Python',
    fileExtension: 'py',
  },
  c_cpp: {
    name: 'c_cpp',
    displayName: 'C++',
    fileExtension: 'cpp',
  },
  jsx: {
    name: 'jsx',
    displayName: 'React Javascript',
    fileExtension: 'jsx',
  },
}

interface SelectLangProps {
  value: string
  onChange: (language: Language) => void
}

const SelectLanguage = ({ value, onChange }: SelectLangProps) => {
  const [filterValue, setFilterValue] = useState('')

  let languages = Object.values(LANGUAGES)

  if (filterValue !== '') {
    languages = languages.filter((lang) =>
      lang.displayName.toLowerCase().includes(filterValue.toLowerCase())
    )
  }

  return (
    <SelectMenu>
      <Button as="summary" sx={{ fontWeight: 'normal' }}>
        Linguagem: {value}
        <TriangleDownIcon />
      </Button>
      <SelectMenu.Modal>
        <SelectMenu.Header>Linguagens</SelectMenu.Header>
        <TextInput
          m={2}
          placeholder="Filtrar linguagens..."
          value={filterValue}
          onChange={(value) => setFilterValue(value.target.value)}
          aria-label="Filtrar linguagens"
        />
        {languages.length !== 0 ? (
          <SelectMenu.List>
            {languages.map((lang) => (
              <SelectMenu.Item key={lang.name} onClick={() => onChange(lang)}>
                {lang.displayName}
              </SelectMenu.Item>
            ))}
          </SelectMenu.List>
        ) : (
          <Text m={3}>Nenhum resultado encontrado</Text>
        )}
      </SelectMenu.Modal>
    </SelectMenu>
  )
}

export default SelectLanguage
