import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const contact = await prisma.contact.create({
    data: {
      name: 'Murtada',
      email: 'm@prisma.com',
      message: 'Hello from prisma',
    },
    })
    console.log(contact)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })