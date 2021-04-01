import { Box, Flex } from '@primer/components'
import { Language } from '../../components/select-language/SelectLanguage'
import { FileReview } from './FileReview'

export interface BinFile {
  id: string
  lang: Language
  name: string
  url: string
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
  isLoadingBin,
  isLoadingComments,
}: {
  bin: Bin
  comments: FileComments
  isLoadingBin: boolean
  isLoadingComments: boolean
}) => {
  return (
    <Flex>
      <Box width={450} backgroundColor="gray.1" mr={4}>
        Aqui terá a arvore de arquivos
      </Box>
      <Flex flexDirection="column" sx={{ width: 'calc(100% - 450px)' }}>
        {!isLoadingBin &&
          !isLoadingComments &&
          bin?.files.map((file) => (
            <Box key={file.id} mb={4}>
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
