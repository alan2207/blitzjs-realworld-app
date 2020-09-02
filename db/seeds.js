/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client")
const dotenv = require("dotenv")

dotenv.config()
const db = new PrismaClient()

async function main() {
  console.info("No data to seed.")
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
