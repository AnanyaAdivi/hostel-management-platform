import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = (password: string) => bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: 'admin@sau.ac.in' },
    update: {},
    create: {
      name: 'Dr. Rajesh Kumar',
      email: 'admin@sau.ac.in',
      role: 'ADMIN',
      password: await hash('admin123'),
      avatarUrl: 'https://placehold.co/200x200/png',
      enrollmentNo: 'ADMIN-001',
      course: 'Administration',
      gender: 'OTHER',
      sportsInterests: ['Badminton'],
      careerGoal: 'Run hostel operations efficiently',
      address: 'South Asian University Campus',
      parentContactNo: '+91-9999999991',
      approvalStatus: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: 'warden@sau.ac.in' },
    update: {},
    create: {
      name: 'Mrs. Priya Sharma',
      email: 'warden@sau.ac.in',
      role: 'WARDEN',
      password: await hash('warden123'),
      avatarUrl: 'https://placehold.co/200x200/png',
      enrollmentNo: 'WARDEN-001',
      course: 'Administration',
      gender: 'FEMALE',
      sportsInterests: ['Yoga'],
      careerGoal: 'Support student wellbeing and discipline',
      address: 'Warden Residence, SAU',
      parentContactNo: '+91-9999999992',
      approvalStatus: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@sau.ac.in' },
    update: {},
    create: {
      name: 'Arjun Mehta',
      email: 'student@sau.ac.in',
      role: 'STUDENT',
      password: await hash('student123'),
      phone: '+91-9876543210',
      avatarUrl: 'https://placehold.co/200x200/png',
      enrollmentNo: 'SAU-2026-001',
      course: 'M.Tech Computer Science',
      gender: 'MALE',
      sportsInterests: ['Football', 'Cricket'],
      careerGoal: 'Become an AI engineer',
      address: 'New Delhi, India',
      parentContactNo: '+91-9811111111',
      approvalStatus: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  const blocks = ['A', 'B', 'C'];
  const rooms: Array<{ id: string; number: string }> = [];

  for (const block of blocks) {
    for (let floor = 1; floor <= 4; floor += 1) {
      for (let num = 1; num <= 5; num += 1) {
        const roomNumber = `${block}${floor}0${num}`;
        const room = await prisma.room.upsert({
          where: { number: roomNumber },
          update: {},
          create: {
            number: roomNumber,
            floor,
            block,
            capacity: 2,
            amenities: ['WiFi', 'AC', 'Attached Bathroom'],
            status: 'AVAILABLE',
          },
        });
        rooms.push(room);
      }
    }
  }

  const demoRoom = rooms.find((room) => room.number === 'A101');
  if (demoRoom) {
    await prisma.roomAllocation.upsert({
      where: { userId: student.id },
      update: {},
      create: { userId: student.id, roomId: demoRoom.id, isActive: true },
    });

    await prisma.room.update({
      where: { id: demoRoom.id },
      data: { status: 'OCCUPIED' },
    });
  }

  const complaints = [
    {
      token: 'CPL-DEMO1',
      isAnonymous: true,
      category: 'PLUMBING' as const,
      title: 'Tap leaking in Block B washroom',
      description: 'The tap has been leaking for 2 days, water wastage is significant.',
      status: 'IN_PROGRESS' as const,
      adminNote: 'Plumber scheduled for tomorrow 9 AM.',
    },
    {
      token: 'CPL-DEMO2',
      isAnonymous: false,
      userId: student.id,
      category: 'ELECTRICAL' as const,
      title: 'Corridor light not working',
      description: 'The corridor light on floor 2 Block A has been off for a week.',
      status: 'PENDING' as const,
    },
    {
      token: 'CPL-DEMO3',
      isAnonymous: true,
      category: 'CLEANING' as const,
      title: 'Common area needs cleaning',
      description: 'The common room has not been cleaned in 3 days.',
      status: 'RESOLVED' as const,
      adminNote: 'Cleaned on 24th March. Will schedule daily cleaning.',
    },
  ];

  for (const complaint of complaints) {
    await prisma.complaint.upsert({
      where: { token: complaint.token },
      update: complaint,
      create: complaint,
    });
  }

  const announcements = [
    {
      title: 'Water supply maintenance - Sunday 6 AM to 10 AM',
      content:
        'Water supply will be interrupted on Sunday morning for annual maintenance. Please store water in advance.',
      isUrgent: true,
      createdBy: 'admin@sau.ac.in',
    },
    {
      title: 'Mess menu updated for April',
      content:
        'The monthly mess menu has been updated. New items include regional cuisine on weekends. Check the notice board for details.',
      isUrgent: false,
      createdBy: 'warden@sau.ac.in',
    },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
  }

  const knowledgeEntries = [
    {
      content:
        'Breakfast: 7:30 AM - 9:00 AM. Lunch: 12:30 PM - 2:00 PM. Snacks: 4:30 PM - 5:30 PM. Dinner: 7:30 PM - 9:30 PM. Sunday brunch: 9:00 AM - 11:00 AM.',
      metadata: { type: 'meal_timings', title: 'Mess meal timings' },
    },
    {
      content:
        'Gate closing time is 10:30 PM on weekdays and 11:30 PM on weekends. Late entry must be approved by the warden in advance. Guests are allowed until 8 PM only in common areas.',
      metadata: { type: 'rules', title: 'Gate and guest rules' },
    },
    {
      content:
        'Monthly hostel fee is INR 8,500 including meals. Fees must be paid by the 10th of each month. Late payment incurs a penalty of INR 100 per day. Payment can be made online via the student portal.',
      metadata: { type: 'fees', title: 'Hostel fee structure' },
    },
    {
      content:
        'WiFi is available in all rooms and common areas. Network: SAU-Hostel. Contact IT helpdesk at it@sau.ac.in for issues. Speed: 100 Mbps shared. Downloading torrents or streaming for long periods is discouraged.',
      metadata: { type: 'facilities', title: 'WiFi and internet' },
    },
    {
      content:
        'Laundry room is in Block A basement, open 6 AM to 10 PM daily. Each resident gets 2 free washes per week. Additional washes cost INR 30. Ironing room is adjacent. Report damaged machines to the warden.',
      metadata: { type: 'facilities', title: 'Laundry facilities' },
    },
  ];

  for (const entry of knowledgeEntries) {
    await prisma.knowledgeBase.create({ data: entry });
  }

  console.log(
    'Seed complete. Demo credentials:\n  Admin: admin@sau.ac.in / admin123\n  Warden: warden@sau.ac.in / warden123\n  Student: student@sau.ac.in / student123',
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
