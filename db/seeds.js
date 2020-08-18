/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client")
const dotenv = require("dotenv")

dotenv.config()
const db = new PrismaClient()

async function main() {
  ;[
    { name: "Tech" },
    { name: "Life" },
    { name: "Sports" },
    { name: "Entertainment" },
    { name: "Health" },
  ].forEach(async (t) => {
    await db.tag.create({ data: t })
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
