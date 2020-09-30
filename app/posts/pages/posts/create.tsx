import React from "react"
import { useQuery, Router } from "blitz"
import getTags from "app/tags/queries/getTags"
import MainLayout from "app/layouts/MainLayout"
import FormLayout from "app/layouts/FormLayout"
import Form from "app/components/Form"
import { Flex } from "@chakra-ui/core"
import createPost from "app/posts/mutations/createPost"
import useAuthUser from "app/auth/hooks/useAuthUser"

const CreatePostPage = () => {
  const [authUser] = useAuthUser()
  const [tags] = useQuery(getTags, {})

  return (
    <MainLayout headTitle="Create Post">
      <Flex my="60px" justify="center" align="center" h="100%" w="100%">
        <FormLayout title="Create Post">
          <Form
            onSubmit={async ({ values: { tags, ...values } }) => {
              await createPost({
                data: {
                  ...values,
                  tags: {
                    connectOrCreate: tags?.map((t) => ({
                      where: { id: t.value },
                      create: { name: t.label.toLowerCase() },
                    })),
                  },
                  user: {
                    connect: {
                      id: authUser?.id,
                    },
                  },
                },
              })
              Router.push("/profile/my-posts")
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
                options: tags,
                selectParams: {
                  optionValueKey: "id",
                  optionLabelKey: "name",
                  isMulti: true,
                },
              },
              status: {
                name: "status",
                label: "Status",
                type: "simpleselect",
                validation: { required: true },
                options: [
                  { value: "draft", label: "draft" },
                  { value: "published", label: "published" },
                ],
              },
            }}
            defaultValues={{
              title: "",
              intro: "",
              content: "",
              tags: [],
              status: "draft",
            }}
          />
        </FormLayout>
      </Flex>
    </MainLayout>
  )
}

export default CreatePostPage
