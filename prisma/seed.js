import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper functions to generate random data
function randomName() {
  const firstNames = ['John', 'Jane', 'Mike', 'Emily', 'David', 'Sarah', 'Chris', 'Lisa', 'Tom', 'Anna', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia', 'Daniel', 'Ava', 'Matthew', 'Isabella'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Harris', 'Clark'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function randomEmail(index) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
  return `user${index}_${Date.now()}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function randomBio() {
  const bios = [
    'Software developer passionate about clean code',
    'Full-stack engineer with 5 years of experience',
    'Tech enthusiast and open source contributor',
    'Building scalable applications one line at a time',
    'Coffee lover and debugging wizard',
    'Passionate about creating user-friendly applications',
    'Data nerd who loves solving complex problems',
    'Lifelong learner exploring new technologies',
    'Remote developer embracing async communication',
    'Building the future of web applications',
    null // Some profiles won't have a bio
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

function randomTitle() {
  const adjectives = ['Amazing', 'Incredible', 'Ultimate', 'Essential', 'Complete', 'Modern', 'Advanced', 'Simple', 'Quick', 'Deep'];
  const topics = ['Guide', 'Tutorial', 'Introduction', 'Overview', 'Tips', 'Tricks', 'Best Practices', 'Patterns', 'Architecture', 'Fundamentals'];
  const subjects = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'GraphQL', 'REST APIs', 'Microservices', 'Testing', 'DevOps', 'Cloud Computing', 'Machine Learning', 'Web Development'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]} ${topics[Math.floor(Math.random() * topics.length)]}`;
}

function randomContent() {
  const contents = [
    'This is a comprehensive guide covering all the essential concepts you need to know.',
    'In this post, we will explore the fundamentals and dive deep into advanced topics.',
    'Learn how to build scalable applications with these proven techniques.',
    'A step-by-step tutorial that will take you from beginner to expert.',
    'Discover the best practices used by industry professionals.',
    'Everything you need to know to get started with modern development.',
    'Tips and tricks that will improve your productivity significantly.',
    'An in-depth analysis of the most important concepts and patterns.',
    'Practical examples and real-world use cases to help you understand better.',
    'A complete walkthrough with code samples and explanations.',
    null // Some posts won't have content
  ];
  return contents[Math.floor(Math.random() * contents.length)];
}

async function main() {
  console.log('🌱 Starting seed...');
  
  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  
  // Create 500 users
  console.log('👤 Creating 500 users...');
  const users = [];
  for (let i = 1; i <= 500; i++) {
    users.push({
      email: randomEmail(i),
      name: randomName(),
    });
  }
  
  await prisma.user.createMany({
    data: users,
  });
  
  // Get all created users
  const createdUsers = await prisma.user.findMany();
  console.log(`✅ Created ${createdUsers.length} users`);
  
  // Create 500 profiles (one for each user)
  console.log('📋 Creating 500 profiles...');
  const profiles = createdUsers.map(user => ({
    bio: randomBio(),
    userId: user.id,
  }));
  
  await prisma.profile.createMany({
    data: profiles,
  });
  console.log('✅ Created 500 profiles');
  
  // Create 500 posts (randomly distributed among users)
  console.log('📝 Creating 500 posts...');
  const posts = [];
  for (let i = 0; i < 500; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    posts.push({
      title: randomTitle(),
      content: randomContent(),
      published: Math.random() > 0.3, // 70% published
      authorId: randomUser.id,
    });
  }
  
  await prisma.post.createMany({
    data: posts,
  });
  console.log('✅ Created 500 posts');
  
  // Print summary
  const userCount = await prisma.user.count();
  const profileCount = await prisma.profile.count();
  const postCount = await prisma.post.count();
  
  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Profiles: ${profileCount}`);
  console.log(`   Posts: ${postCount}`);
  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
