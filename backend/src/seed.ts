import { prisma } from './prisma';
import { faker, Faker, id_ID, en} from '@faker-js/faker';

const customFaker = new Faker({
  locale: [id_ID, en], 
});

async function main() {
  console.log('Seeding data...');

  const userData = Array.from({ length: 30 }, () => ({
    username: customFaker.internet.username(),
    email: customFaker.internet.email(),
    password_hash: '$2b$10$RbIlRO7qhsZt.vRcVJ8AIeuptNAhk0RZ/TW4AqS.DNB8XCTojCX5q', //Aku123_
    full_name: customFaker.person.fullName(),
    work_history: `${customFaker.person.jobTitle()} di ${customFaker.company.name()}`,
    skills: customFaker.helpers.arrayElements(
      ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Agile', 'Scrum', 'Kepemimpinan'],
      customFaker.number.int({ min: 1, max: 3 })
    ).join(', '),
    profile_photo_path: null,
    // profile_photo_path: customFaker.image.avatar(),
  }));

  await prisma.user.createMany({ data: userData });
  console.log(`${userData.length} pengguna berhasil dibuat.`);

  // Fetch created users to use their IDs
  const users = await prisma.user.findMany();
  const userIds = users.map(user => user.id);

  // Generate Feeds
  const feedData = Array.from({ length: 50 }, () => ({
    content: customFaker.lorem.sentence(),
    user_id: customFaker.helpers.arrayElement(userIds),
  }));

  await prisma.feed.createMany({ data: feedData });
  console.log(`${feedData.length} feed berhasil dibuat.`);

  // Generate Chats
  const chatData = Array.from({ length: 200 }, () => {
    const from_id = customFaker.helpers.arrayElement(userIds);
    let to_id = customFaker.helpers.arrayElement(userIds);
    while (to_id === from_id) {
      to_id = customFaker.helpers.arrayElement(userIds);
    }
    return { from_id, to_id, message: customFaker.lorem.sentence() };
  });

  await prisma.chat.createMany({ data: chatData });
  console.log(`${chatData.length} chat berhasil dibuat.`);

  // Pastikan hubungan koneksi dua arah untuk setiap chat
  for (const chat of chatData) {
    const { from_id, to_id } = chat;
    // Cek dan tambahkan koneksi jika belum ada
    const existingConnection1 = await prisma.connection.findFirst({
      where: { from_id, to_id },
    });

    const existingConnection2 = await prisma.connection.findFirst({
      where: { from_id: to_id, to_id: from_id },
    });
    if (!existingConnection1) {
      await prisma.connection.create({
        data: { from_id, to_id, created_at: customFaker.date.recent() },
      });
    }
    if (!existingConnection2) {
      await prisma.connection.create({
        data: { from_id: to_id, to_id: from_id, created_at: customFaker.date.recent() },
      });
    }
  }

  console.log('Hubungan koneksi dua arah berhasil dipastikan untuk semua chat.');
  const connectionRequestData = Array.from({ length: 10 }, () => {
    const from_id = customFaker.helpers.arrayElement(userIds);
    let to_id = customFaker.helpers.arrayElement(userIds);
    while (to_id === from_id) {
      to_id = customFaker.helpers.arrayElement(userIds);
    }
    return { from_id, to_id, created_at: customFaker.date.recent() };
  });

  await prisma.connectionRequest.createMany({ data: connectionRequestData });
  console.log(`${connectionRequestData.length} permintaan koneksi berhasil dibuat.`);

  // Generate Push Subscriptions
  // ini keknya salah
  // const pushSubscriptionData = users.map(user => ({
  //   endpoint: customFaker.internet.url(),
  //   user_id: user.id,
  //   keys: JSON.stringify({
  //     p256dh: customFaker.string.alphanumeric(43),
  //     auth: customFaker.string.alphanumeric(22),
  //   }),
  // }));

  // await prisma.pushSubscription.createMany({ data: pushSubscriptionData });
  // console.log(`${pushSubscriptionData.length} push subscription berhasil dibuat.`);
}

main()
  .then(() => {
    console.log('finished seeding.');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error('error occured while seeding', e);
    return prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
