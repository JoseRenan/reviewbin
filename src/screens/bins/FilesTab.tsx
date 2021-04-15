import {
  BorderBox,
  Box,
  Flex,
  Heading,
  SideNav,
  Text,
} from '@primer/components'
import { Language } from '../../components/select-language/SelectLanguage'
import { useReviewsQuery } from '../../hooks/queries'
import { FileReview } from './FileReview'

export interface BinFile {
  id: string
  lang: Language
  name: string
  url: string
  code?: string
}

export interface ReviewComment {
  id?: string
  author: string
  content: string
  timestamp?: number
}

export interface FileComments {
  [file: string]: {
    [line: number]: ReviewComment[]
  }
}

export interface Bin {
  id: string
  name: string
  author: string
  files: BinFile[]
}

export const FilesTab = ({ bin }: { bin: Bin }) => {
  const { data: reviews } = useReviewsQuery(bin.id as string)
  return (
    <Flex>
      <BorderBox
        p={3}
        backgroundColor="bg.secondary"
        width={480}
        mr={4}
        height="min-content">
        <BorderBox
          borderWidth={0}
          borderBottomWidth={1}
          borderRadius={0}
          mb={2}
          pb={1}>
          <Heading as="h5" fontSize={1} color="text.secondary">
            Arquivos
          </Heading>
        </BorderBox>
        <SideNav variant="lightweight">
          {bin?.files.map((file) => (
            <SideNav.Link href={`#${file.id}`} key={file.id}>
              <Text fontFamily="monospace">
                {file.name.split('/').length >= 4
                  ? `${file.name
                      .split('/')
                      .slice(0, 2)
                      .join('/')}/.../${file.name
                      .split('/')
                      .slice(-1)
                      .join('/')}`
                  : file.name}
              </Text>
            </SideNav.Link>
          ))}
        </SideNav>
      </BorderBox>
      <Flex flexDirection="column" sx={{ width: 'calc(100% - 480px)' }}>
        {bin?.files.map((file) => (
          <Box key={file.id} mb={4} id={file.id}>
            <FileReview
              binId={bin.id}
              file={file}
              comments={reviews?.[file.id] ?? []}
            />
          </Box>
        ))}
      </Flex>
    </Flex>
  )
}
