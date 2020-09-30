import React from "react"
import { useForm, ValidationRules, Controller } from "react-hook-form"
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  useToast,
} from "@chakra-ui/core"
import CreatableSelect from "react-select/creatable"
import Select from "react-select"
import MdEditor from "app/components/MDEditor"
import MarkdownPreview from "./MarkdownPreview"
type Field = {
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "simpleselect"
    | "textarea"
    | "markdown"
    | "select"
  name: string
  label: string
  validation: ValidationRules
  isDisabled?: boolean
  placeholder?: string
  options?: Array<{ [key: string]: any }>
  selectParams?: {
    optionValueKey: string
    optionLabelKey: string
    isMulti: boolean
  }
}

type Fields = {
  [key: string]: Field
}

type DefaultValues = {
  [key: string]: any
}

type Props = {
  fields: Fields
  onSubmit: (any) => Promise<any>
  defaultValues?: DefaultValues
}

const Form = ({ fields, onSubmit, defaultValues }: Props) => {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState,
    setError,
    reset,
    setValue,
    errors,
    control,
  } = useForm({ defaultValues })

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
      onSubmit={handleSubmit(async (values, event) => {
        try {
          await onSubmit({ values, formControls, event })
        } catch (err) {
          console.error(err)
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          })
        }
      })}
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
              <Controller
                render={(props) => (
                  <MdEditor
                    {...props}
                    onChange={({ text }) => setValue(k, text)}
                    renderHTML={(text) => <MarkdownPreview content={text} />}
                    style={{ height: "300px" }}
                  />
                )}
                name={k}
                control={control}
              />
            )}
            {v.type === "select" && v.selectParams && (
              <Controller
                render={(props) => (
                  <Box color="black">
                    <CreatableSelect
                      {...props}
                      style={{ color: "black" }}
                      isClearable={false}
                      getNewOptionData={(inputValue, optionLabel) => ({
                        label: inputValue,
                        value: "" + Date.now(),
                        __isNew__: true,
                      })}
                      onChange={(v) => setValue(k, v)}
                      isMulti={v.selectParams?.isMulti}
                      options={v.options?.map((o) => ({ value: o.id, label: o.name }))}
                    />
                  </Box>
                )}
                name={k}
                control={control}
              />
            )}
            {v.type === "simpleselect" && (
              <Controller
                name={k}
                control={control}
                render={(props) => (
                  <Box color="black">
                    <Select
                      {...props}
                      getOptionValue={(i) => i.value}
                      getOptionLabel={(i) => i.label}
                      value={{ value: props.value, label: props.value }}
                      onChange={(v) => setValue(k, v.value)}
                      options={v.options}
                    />
                  </Box>
                )}
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
