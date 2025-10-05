import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('Seeding database...');

  const existingCategories = await prisma.category.findMany();
  if (existingCategories.length === 0) {
    // eslint-disable-next-line no-console
    console.log('Creating categories...');

    await prisma.category.createMany({
      data: [{ name: 'Work' }, { name: 'Personal' }],
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Categories already exist, skipping...');
  }

  const categories = await prisma.category.findMany();

  const existingTasks = await prisma.task.findMany();
  if (existingTasks.length === 0) {
    // eslint-disable-next-line no-console
    console.log('Creating sample tasks...');

    await prisma.task.createMany({
      data: [
        {
          title: 'Finish GraphQL API',
          description: 'Complete the GraphQL resolvers and schema definitions.',
          priority: 3,
          isDone: false,
          categoryId: categories[0]?.id,
        },
        {
          title: 'Buy groceries',
          description: 'Milk, eggs, bread, and vegetables.',
          priority: 1,
          isDone: true,
          categoryId: categories[1]?.id,
        },
        {
          title: 'Refactor Zustand store',
          description: 'Simplify task filtering and sorting logic.',
          priority: 2,
          isDone: false,
          categoryId: categories[0]?.id,
        },
        {
          title: 'Workout',
          description: '30 minutes of cardio and strength training.',
          priority: 2,
          isDone: false,
          categoryId: categories[1]?.id,
        },
        {
          title: 'Plan weekend trip',
          description: 'Find hotel and plan activities for Saturday and Sunday.',
          priority: 4,
          isDone: false,
          categoryId: categories[1]?.id,
        },
      ],
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Tasks already exist, skipping...');
  }

  // eslint-disable-next-line no-console
  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
