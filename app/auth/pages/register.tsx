import React from "react"
import { useRouter, BlitzPage, Link } from "blitz"
import register from "app/auth/mutations/register"
import { Flex, Box } from "@chakra-ui/core"
import Form from "app/components/Form"
import MainLayout from "app/layouts/MainLayout"
import FormLayout from "app/layouts/FormLayout"

const RegisterPage: BlitzPage = () => {
  const router = useRouter()
  const onSubmit = async ({ values, formControls }) => {
    try {
      await register(values)
      router.push("/")
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        formControls.setError("email", {
          type: "manual",
          message: "This email is already being used",
        })
      } else {
        console.log(error)
      }
    }
  }

  return (
    <MainLayout headTitle="Register">
      <Flex justify="center" align="center" h="100vh" w="100%">
        <FormLayout title="Register">
          <Form
            onSubmit={onSubmit}
            defaultValues={{}}
            fields={{
              name: {
                name: "name",
                label: "Name",
                type: "text",
                validation: { required: true },
              },
              email: {
                name: "email",
                label: "Email",
                type: "email",
                validation: { required: true },
              },
              password: {
                name: "password",
                label: "Password",
                type: "password",
                validation: { required: true },
              },
            }}
          />
          <Box py="4">
            <Link href="/login">Already have an account? Go ahead and login!</Link>
          </Box>
        </FormLayout>
      </Flex>
    </MainLayout>
  )
}

export default RegisterPage
