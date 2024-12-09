import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password_hash: '$2b$10$RbIlRO7qhsZt.vRcVJ8AIeuptNAhk0RZ/TW4AqS.DNB8XCTojCX5q',
        full_name: 'John Doe',
        work_history: 'Software Engineer at TechCorp',
        skills: 'JavaScript, TypeScript, React',
        profile_photo_path: '/images/johndoe.jpg',
      },
      {
        username: 'janedoe',
        email: 'janedoe@example.com',
        password_hash: '$2b$10$RbIlRO7qhsZt.vRcVJ8AIeuptNAhk0RZ/TW4AqS.DNB8XCTojCX5q',
        full_name: 'Jane Doe',
        work_history: 'Product Manager at Innovate Inc.',
        skills: 'Leadership, Agile, Scrum',
        profile_photo_path: '/images/janedoe.jpg',
      },
    ],
  });
  console.log(`${users.count} users created.`);

  const feeds = await prisma.feed.createMany({
    data: [
      {
        content: 'Excited to join TechCorp as a Software Engineer!',
        user_id: 1, // John Doe
      },
      {
        content: 'Just completed a successful sprint! Great teamwork!',
        user_id: 2, // Jane Doe
      },
    ],
  });
  console.log(`${feeds.count} feeds created.`);

  const chats = await prisma.chat.createMany({
    data: [
      {
        from_id: 1,
        to_id: 2,
        message: 'Hi Jane, congratulations on the new project!',
      },
      {
        from_id: 2,
        to_id: 1,
        message: 'Thanks, John! Let’s catch up soon.',
      },
    ],
  });
  console.log(`${chats.count} chats created.`);

  // Create Connection Requests
  const connectionRequests = await prisma.connectionRequest.createMany({
    data: [
      { from_id: 1, to_id: 2, created_at: new Date() }, // John requested to connect with Jane
    ],
  });
  console.log(`${connectionRequests.count} connection requests created.`);

  // Create Connections
  const connections = await prisma.connection.createMany({
    data: [
      { from_id: 1, to_id: 2, created_at: new Date() }, // John and Jane are connected
    ],
  });
  console.log(`${connections.count} connections created.`);

  // Create Push Subscriptions
  const pushSubscriptions = await prisma.pushSubscription.createMany({
    data: [
      {
        endpoint: 'https://push-service.example.com/johndoe',
        user_id: 1,
        keys: {
          p256dh: 'public_key_1',
          auth: 'auth_token_1',
        },
      },
      {
        endpoint: 'https://push-service.example.com/janedoe',
        user_id: 2,
        keys: {
          p256dh: 'public_key_2',
          auth: 'auth_token_2',
        },
      },
    ],
  });
  console.log(`${pushSubscriptions.count} push subscriptions created.`);
}

main()
  .then(() => {
    console.log('Seeding completed.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error during seeding:', e);
    return prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
