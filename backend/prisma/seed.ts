import { PrismaClient, Priority } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password,
      todos: {
        create: [
          {
            title: 'Complete TypeScript project',
            description: 'Finish the remaining tasks in the TypeScript todo app',
            priority: Priority.HIGH,
            dueDate: new Date('2026-06-15'),
          },
          {
            title: 'Buy groceries',
            description: 'Milk, eggs, bread, fruits',
            priority: Priority.MEDIUM,
            dueDate: new Date('2026-05-30'),
          },
          {
            title: 'Read a book',
            priority: Priority.LOW,
          },
        ],
      },
    },
  });

  console.log('Seed completed:', user.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
