import { Flex, FormGroup } from '@primer/components'
import { PropsWithChildren } from 'react'

export default ({
  children,
  label,
  htmlFor,
}: PropsWithChildren<{ label: string; htmlFor: string }>) => (
  <FormGroup
    m={0}
    as={Flex}
    sx={{
      flexDirection: 'row',
      width: 'max-content',
      alignItems: 'center',
    }}>
    {children}
    <FormGroup.Label htmlFor={htmlFor} mb={0}>
      {label}
    </FormGroup.Label>
  </FormGroup>
)
