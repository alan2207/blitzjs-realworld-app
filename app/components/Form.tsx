import React from "react"
import { useForm, ValidationRules } from "react-hook-form"
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
} from "@chakra-ui/core"
import ReactSelect from "react-select"
import marked from "marked"
import MdEditor from "app/components/MDEditor"
type Field = {
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "textarea"
    | "markdown"
    | "multiselect"
  name: string
  label: string
  validation: ValidationRules
  isDisabled?: boolean
  placeholder?: string
  options?: Array<{ value: any; label: string }>
  selectParams?: {
    optionValueKey: string
    optionLabelKey: string
    isMulti: boolean
  }
}

type Fields = {
  [key: string]: Field
}

type Props = {
  fields: Fields
  onSubmit: (any) => Promise<any>
}

const Form = ({ fields, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState,
    setError,
    reset,
    setValue,
    errors,
    getValues,
  } = useForm()

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
            {["text", "email", "password"].includes(v.type) && (
              <Input
                mb="2"
                id={k}
                name={k}
                type={v.type}
                isDisabled={v.isDisabled}
                ref={register(v.validation)}
              />
            )}
            {v.type === "textarea" && (
              <Textarea
                name={k}
                id={k}
                mb={2}
                isDisabled={v.isDisabled}
                ref={register(v.validation)}
              />
            )}
            {v.type === "markdown" && (
              <MdEditor
                value={getValues([k])[0]}
                onChange={({ text }) => setValue(k, text)}
                renderHTML={(text) => marked(text)}
                style={{ height: "300px" }}
              />
            )}
            {v.type === "multiselect" && v.selectParams && (
              <ReactSelect
                isClearable={false}
                getOptionValue={(t) => t[v.selectParams?.optionValueKey || ""]}
                getOptionLabel={(t) => t[v.selectParams?.optionLabelKey || ""]}
                onChange={(v) => setValue(k, v)}
                isMulti={v.selectParams.isMulti}
                options={v.options}
                name={k}
              />
            )}
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
