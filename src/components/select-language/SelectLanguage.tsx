import { Button, SelectMenu, Text } from '@primer/components'
import { TriangleDownIcon } from '@primer/octicons-react'
import { useState } from 'react'

const LANGUAGES = [
  {
    name: 'javascript',
  },
  {
    name: 'java',
  },
  {
    name: 'C++',
  },
  {
    name: 'python',
  },
  {
    name: 'pascal',
  },
]

interface SelectLangProps {
  value: string
  onChange: (language: { name: string }) => void
}

const SelectLanguage = ({ value, onChange }: SelectLangProps) => {
  const [filterValue, setFilterValue] = useState('')

  let languages = LANGUAGES

  if (filterValue !== '') {
    languages = languages.filter((lang) =>
      lang.name.toLowerCase().includes(filterValue.toLowerCase())
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
        <SelectMenu.Filter
          placeholder="Filtrar linguagens..."
          value={filterValue}
          onChange={(value) => setFilterValue(value.target.value)}
          aria-label="Filtrar linguagens"
        />
        {languages.length !== 0 ? (
          <SelectMenu.List>
            {languages.map((lang) => (
              <SelectMenu.Item key={lang.name} onClick={() => onChange(lang)}>
                {lang.name}
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
