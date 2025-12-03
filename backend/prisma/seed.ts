import { PrismaClient, UserRole, QuestionDifficulty } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create test user
  const testUserPassword = await bcrypt.hash('user123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: testUserPassword,
      fullName: 'Test User',
      role: UserRole.USER,
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // 3. Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ai-ml' },
      update: {},
      create: {
        name: 'AI & Machine Learning',
        slug: 'ai-ml',
        description: 'Questions about AI, ML, Deep Learning',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming languages, algorithms, data structures',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'database' },
      update: {},
      create: {
        name: 'Database',
        slug: 'database',
        description: 'SQL, NoSQL, database design',
      },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // 4. Create sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Sample AI Quiz',
      description: 'Basic AI concepts for testing',
      categoryId: categories[0].id,
      difficulty: QuestionDifficulty.MEDIUM,
      totalQuestions: 3,
      createdBy: 'admin@example.com',
      isPublished: true,
      questions: {
        create: [
          {
            text: 'What does AI stand for?',
            order: 1,
            difficulty: QuestionDifficulty.EASY,
            options: {
              create: [
                { label: 'A', text: 'Automated Intelligence', isCorrect: false },
                { label: 'B', text: 'Artificial Intelligence', isCorrect: true },
                { label: 'C', text: 'Advanced Integration', isCorrect: false },
                { label: 'D', text: 'Analytical Interpretation', isCorrect: false },
              ],
            },
          },
          {
            text: 'Which algorithm is used for classification?',
            order: 2,
            difficulty: QuestionDifficulty.MEDIUM,
            options: {
              create: [
                { label: 'A', text: 'K-Means', isCorrect: false },
                { label: 'B', text: 'SVM', isCorrect: true },
                { label: 'C', text: 'PCA', isCorrect: false },
                { label: 'D', text: 'Apriori', isCorrect: false },
              ],
            },
          },
          {
            text: 'What is the activation function in neural networks?',
            order: 3,
            difficulty: QuestionDifficulty.HARD,
            options: {
              create: [
                { label: 'A', text: 'Loss function', isCorrect: false },
                { label: 'B', text: 'Cost function', isCorrect: false },
                { label: 'C', text: 'ReLU', isCorrect: true },
                { label: 'D', text: 'Gradient descent', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ Sample quiz created:', quiz.title);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
