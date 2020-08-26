import React from "react"
import { useQuery, Router, useSession, ErrorComponent, useParams } from "blitz"
import getTags from "app/tags/queries/getTags"
import MainLayout from "app/layouts/MainLayout"
import FormLayout from "app/layouts/FormLayout"
import Form from "app/components/Form"
import { Flex } from "@chakra-ui/core"
import updatePost from "app/posts/mutations/updatePost"
import getPost from "app/posts/queries/getPost"
import FullPageSpinner from "app/components/FullPageSpinner"
import differenceWith from "lodash/differenceWith"

const EditPostPage = () => {
  const params = useParams("string")
  const session = useSession()
  const [post, { isFetching }] = useQuery(
    getPost,
    {
      where: {
        id: params.id,
      },
      include: {
        tags: true,
      },
    },
    { enabled: params.id }
  )
  const [tags] = useQuery(getTags, {})

  if (isFetching) {
    return <FullPageSpinner />
  }

  if (!post && !isFetching) {
    return <ErrorComponent statusCode={404} title="Not Found" />
  }

  if (post && session?.userId && session.userId !== post.userId && !isFetching) {
    return <ErrorComponent statusCode={401} title="Unauthorized" />
  }

  return (
    <MainLayout headTitle={`Edit Post - ${post.title}`}>
      <Flex my="60px" justify="center" align="center" h="100%" w="100%">
        <FormLayout title="Edit Post">
          <Form
            onSubmit={async ({ values: { tags, ...values } }) => {
              const removingTags = differenceWith(post?.tags, tags, (x: any, y: any) => {
                return x.name === y.label
              }).map((t: any) => ({
                id: t.id,
              }))
              const addingTags = differenceWith(tags, post?.tags, (x: any, y: any) => {
                return x.label === y.name
              })

              const connectTags =
                removingTags.length > 0
                  ? {
                      connectOrCreate: addingTags.map((t: any) => ({
                        where: { id: t.value },
                        create: { name: t.label },
                      })),
                    }
                  : {}

              const disconnectTags =
                removingTags.length > 0
                  ? {
                      disconnect: removingTags,
                    }
                  : {}

              await updatePost({
                where: {
                  id: params.id,
                },
                data: {
                  ...values,
                  tags: {
                    connectOrCreate: addingTags.map((t: any) => ({
                      where: { id: t.value },
                      create: { name: t.label },
                    })),
                    ...connectTags,
                    ...disconnectTags,
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
              title: post.title,
              intro: post.intro,
              content: post.content,
              status: post.status,
              tags: post?.tags?.map((t) => ({ value: t.id, label: t.name })) || [],
            }}
          />
        </FormLayout>
      </Flex>
    </MainLayout>
  )
}

export default EditPostPage
