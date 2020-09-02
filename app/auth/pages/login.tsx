import React from "react"
import { useRouter, BlitzPage, Link } from "blitz"
import login from "app/auth/mutations/login"
import { Flex, Box } from "@chakra-ui/core"
import Form from "app/components/Form"
import MainLayout from "app/layouts/MainLayout"
import FormLayout from "app/layouts/FormLayout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  const onSubmit = async ({ values, formControls }) => {
    try {
      await login({ email: values.email, password: values.password })
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
    <MainLayout headTitle="Login">
      <Flex justify="center" align="center" h="100vh" w="100%">
        <FormLayout title="Login">
          <Form
            onSubmit={onSubmit}
            fields={{
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
            <Link href="/register">Don't have an account? Go ahead and create one!</Link>
          </Box>
        </FormLayout>
      </Flex>
    </MainLayout>
  )
}

export default LoginPage
