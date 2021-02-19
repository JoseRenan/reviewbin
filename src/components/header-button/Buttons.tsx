import {
  Button as PrimerButton,
  ButtonPrimary as PrimerButtonPrimary,
  ButtonInvisible,
  ButtonProps,
} from '@primer/components'
import { PropsWithChildren } from 'react'

export const HeaderButton = ({ children, sx, ...rest }: ButtonProps) => (
  <ButtonInvisible
    sx={{
      color: 'gray.0',
      border: '1px solid',
      borderColor: 'gray.0',
      borderRadius: '6px',
      fontWeight: 'semibold',
      ':hover': {
        border: '1px solid',
        borderColor: 'gray.3',
        color: 'gray.3',
      },
      ...sx,
    }}
    {...rest}>
    {children}
  </ButtonInvisible>
)

export const Button = ({ children, sx, ...rest }: ButtonProps) => (
  <PrimerButton
    sx={{
      fontWeight: 'semibold',
      ...sx,
    }}
    {...rest}>
    {children}
  </PrimerButton>
)

export const ButtonPrimary = ({ children, sx, ...rest }: ButtonProps) => (
  <PrimerButtonPrimary
    sx={{
      fontWeight: 'semibold',
      ...sx,
    }}
    {...rest}>
    {children}
  </PrimerButtonPrimary>
)
