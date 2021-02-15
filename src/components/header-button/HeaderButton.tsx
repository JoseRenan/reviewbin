import { ButtonInvisible } from '@primer/components'
import { PropsWithChildren } from 'react'

export default ({ children }: PropsWithChildren<{}>) => (
  <ButtonInvisible
    sx={{
      color: 'gray.0',
      border: '1px solid',
      borderColor: 'gray.0',
      borderRadius: '6px',
      ':hover': {
        border: '1px solid',
        borderColor: 'gray.3',
        color: 'gray.3',
      },
    }}>
    {children}
  </ButtonInvisible>
)
