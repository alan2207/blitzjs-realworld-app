import React from "react"
import MainLayout from "app/layouts/MainLayout"
import { ssrQuery, GetServerSideProps, PromiseReturnType, Head } from "blitz"
import getPost from "app/posts/queries/getPost"
import { Box, Heading, Flex, Text } from "@chakra-ui/core"
import { cardStyles } from "app/styles"
import MarkdownPreview from "app/components/MarkdownPreview"

type PageProps = {
  post: PromiseReturnType<typeof getPost>
}

const PostPage = ({ post }) => {
  return (
    <MainLayout>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box {...cardStyles} maxW="containers.lg" mx="auto" my="4" p="4">
        <Heading textAlign="center">{post.title}</Heading>
        <Flex>
          <Box p="8">
            <Text>Created By: {post.User?.name}</Text>
            <Text>Date: {post.createdAt}</Text>
          </Box>
        </Flex>
        <MarkdownPreview content={post.content} />
      </Box>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, res, params }) => {
  const post = await ssrQuery(
    getPost,
    {
      where: {
        id: +params.id,
      },
      include: {
        User: true,
      },
    },
    { req, res }
  )

  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
  }
}

export default PostPage
