import React from "react"
import { useRouter, BlitzPage, Link } from "blitz"
import login from "app/auth/mutations/login"
import { Flex, Box, Heading } from "@chakra-ui/core"
import Form from "app/components/Form"
import MainLayout from "app/layouts/MainLayout"

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
    <MainLayout>
      <Flex justify="center" align="center" h="100%" w="100%">
        <Box shadow="lg" bg="white" p="8" width="lg">
          <Heading textAlign="center" mb="4">
            Login
          </Heading>
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
        </Box>
      </Flex>
    </MainLayout>
  )
}

export default LoginPage
