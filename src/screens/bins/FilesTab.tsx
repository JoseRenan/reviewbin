import {
  BorderBox,
  Box,
  Flex,
  Heading,
  SideNav,
  Text,
} from '@primer/components'
import { Language } from '../../components/select-language/SelectLanguage'
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
  author: string
  files: BinFile[]
}

export const FilesTab = ({
  bin,
  comments,
  isLoadingComments,
}: {
  bin: Bin
  comments: FileComments
  isLoadingComments: boolean
}) => {
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
            Files
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
        {!isLoadingComments &&
          bin?.files.map((file) => (
            <Box key={file.id} mb={4} id={file.id}>
              <FileReview
                binId={bin.id}
                file={file}
                comments={comments?.[file.id] ?? []}
              />
            </Box>
          ))}
      </Flex>
    </Flex>
  )
}
