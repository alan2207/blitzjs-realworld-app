import React from "react"
import { useForm, ValidationRules } from "react-hook-form"
import { Box, Input, Button, FormControl, FormLabel, FormHelperText } from "@chakra-ui/core"

type Field = {
  type: "text" | "number" | "email" | "password" | "select" | "textarea"
  name: string
  label: string
  validation: ValidationRules
  isDisabled?: boolean
  placeholder?: string
  options?: Array<{ value: any; label: string }>
}

type Fields = {
  [key: string]: Field
}

type Props = {
  fields: Fields
  onSubmit: (any) => Promise<any>
}

const Form = ({ fields, onSubmit }: Props) => {
  const { register, handleSubmit, formState, setError, reset, setValue, errors } = useForm()

  const { isSubmitting } = formState

  const formControls = React.useMemo(
    () => ({
      setError,
      reset,
      setValue,
    }),
    [setError, reset, setValue]
  )

  return (
    <Box
      onSubmit={handleSubmit(
        async (values, event) => await onSubmit({ values, formControls, event })
      )}
      as="form"
      w="100%"
    >
      <fieldset disabled={isSubmitting}>
        {Object.entries(fields).map(([k, v]) => (
          <FormControl my={4} key={k}>
            <FormLabel htmlFor={k}>{v.label}</FormLabel>
            <Input
              mb="2"
              id={k}
              name={k}
              type={v.type}
              isDisabled={v.isDisabled}
              ref={register(v.validation)}
            />
            <FormHelperText textTransform="capitalize" color="red.300">
              {errors[k]?.message || errors[k]?.type}
            </FormHelperText>
          </FormControl>
        ))}
      </fieldset>
      <Button
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        mt="2"
        bg="bg-dark"
        color="text-light"
        w="100%"
        type="submit"
      >
        Submit
      </Button>
    </Box>
  )
}

export default Form
