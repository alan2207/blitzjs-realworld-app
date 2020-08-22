import React from "react"
import { useQuery, Router, useSession, useRouter, ErrorComponent } from "blitz"
import getTags from "app/tags/queries/getTags"
import MainLayout from "app/layouts/MainLayout"
import FormLayout from "app/layouts/FormLayout"
import Form from "app/components/Form"
import { Flex } from "@chakra-ui/core"
import differenceBy from "lodash/differenceBy"
import updatePost from "app/posts/mutations/updatePost"
import getPost from "app/posts/queries/getPost"
import FullPageSpinner from "app/components/FullPageSpinner"

const EditPostPage = () => {
  const session = useSession()
  const router = useRouter()
  const [post, { isFetching }] = useQuery(
    getPost,
    {
      where: {
        id: +router.params.id,
      },
      include: {
        tags: true,
      },
    },
    { enabled: +router.params.id }
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
              const removingTags = differenceBy(post.tags, tags).map((t) => ({ id: t.id }))
              const addingTags = differenceBy(tags, post.tags).map((t) => ({ id: t.id }))
              await updatePost({
                where: {
                  id: +router.params.id,
                },
                data: {
                  ...values,
                  tags: {
                    connect: addingTags.length > 0 ? addingTags : undefined,
                    disconnect: removingTags.length > 0 ? removingTags : undefined,
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
              title: post.title,
              intro: post.intro,
              content: post.content,
              tags: post.tags,
            }}
          />
        </FormLayout>
      </Flex>
    </MainLayout>
  )
}

export default EditPostPage
