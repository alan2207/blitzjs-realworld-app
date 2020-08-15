import React from "react"
import { useQuery, Router } from "blitz"
import getTags from "app/tags/queries/getTags"
import MainLayout from "app/layouts/MainLayout"
import FormLayout from "app/layouts/FormLayout"
import Form from "app/components/Form"
import { Flex } from "@chakra-ui/core"
import createPost from "app/posts/mutations/createPost"
import useAuthUser from "app/auth/hooks/useAuthUser"
import allowAuthorizedRoles from "app/utils/allowAuthorizedRoles"

const CreatePostPage = () => {
  const [authUser] = useAuthUser()
  const [tags] = useQuery(getTags, {})

  return (
    <MainLayout>
      <Flex my="60px" justify="center" align="center" h="100%" w="100%">
        <FormLayout title="Create Post">
          <Form
            onSubmit={async ({ values: { tags, ...values } }) => {
              await createPost({
                data: {
                  ...values,
                  tags: {
                    connect: tags?.map((t) => ({ id: t.id })),
                  },
                  User: {
                    connect: {
                      id: authUser?.id,
                    },
                  },
                },
              })
              Router.push("/")
            }}
            fields={{
              title: {
                name: "title",
                label: "Title",
                type: "text",
                validation: { required: true },
              },
              intro: {
                name: "intro",
                label: "Intro",
                type: "text",
                validation: { required: true },
              },
              content: {
                name: "content",
                label: "Content",
                type: "markdown",
                validation: { required: true },
              },
              tags: {
                name: "tags",
                label: "Tags",
                type: "select",
                validation: { required: true },
                options: tags?.map((t) => ({ id: t.id, name: t.name })) || [],
                selectParams: {
                  optionValueKey: "id",
                  optionLabelKey: "name",
                  isMulti: true,
                },
              },
            }}
            defaultValues={{
              title: "",
              intro: "",
              content: "",
              tags: [],
            }}
          />
        </FormLayout>
      </Flex>
    </MainLayout>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  await allowAuthorizedRoles({ roles: ["admin", "user"], req, res })
  return { props: {} }
}

export default CreatePostPage
