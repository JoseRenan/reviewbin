import { Avatar, Flex, TextInput } from '@primer/components'
import { ChangeEvent, useState } from 'react'
import { Button, ButtonPrimary } from '../buttons'

const CommentInput = ({
  value,
  onChange,
  onAddComment,
  onCancel,
  initialOpen = false,
  avatarUrl,
}: {
  initialOpen?: boolean
  avatarUrl: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onAddComment: () => void
  onCancel?: () => void
}) => {
  const [open, setOpen] = useState(initialOpen)
  return (
    <>
      {open ? (
        <>
          <TextInput
            as="textarea"
            backgroundColor="white"
            width="100%"
            placeholder="Adicionar comentário..."
            value={value}
            onChange={onChange}
            sx={{ minHeight: 150 }}
          />
          <Flex my={2} justifyContent="end">
            <Button
              mr={2}
              onClick={() => {
                setOpen(false)
                onCancel?.()
              }}>
              Cancelar
            </Button>
            <ButtonPrimary onClick={onAddComment}>
              Adicionar comentário
            </ButtonPrimary>
          </Flex>
        </>
      ) : (
        <Flex alignItems="center">
          <Avatar mr={2} size={28} src={avatarUrl} />
          <TextInput
            backgroundColor="white"
            width="100%"
            placeholder="Adicionar comentário..."
            onClick={() => setOpen(true)}
          />
        </Flex>
      )}
    </>
  )
}

export default CommentInput
