import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@taskmanager.com',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Seed ejecutado correctamente');
}

main().finally(() => prisma.$disconnect());
