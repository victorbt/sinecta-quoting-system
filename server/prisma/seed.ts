import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/edge'
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const sellerPass = await bcrypt.hash('seller123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sinecta.dev' },
    update: {},
    create: { email: 'admin@sinecta.dev', name: 'Admin', role: 'ADMIN', passwordHash: adminPass }
  });
  await prisma.user.upsert({
    where: { email: 'seller@sinecta.dev' },
    update: {},
    create: { email: 'seller@sinecta.dev', name: 'Seller', role: 'SELLER', passwordHash: sellerPass }
  });

  await prisma.quote.createMany({
    data: [
      { clientName: 'Rancho El Sol', crop: 'MAIZ', state: 'JALISCO', areaHa: 20.5, insuredAmount: 150000, validFrom: new Date('2025-08-01'), validTo: new Date('2026-08-01'), polygon: {"type":"Polygon","coordinates":[[[-103.5,20.6],[-103.5,20.61],[-103.49,20.61],[-103.49,20.6],[-103.5,20.6]]]}, ownerId: admin.id },
      { clientName: 'Campo Norte', crop: 'TRIGO', state: 'CHIHUAHUA', areaHa: 8, insuredAmount: 75000, validFrom: new Date('2025-09-01'), validTo: new Date('2026-09-01'), polygon: {"type":"Polygon","coordinates":[[[-106.1,28.6],[-106.1,28.605],[-106.095,28.605],[-106.095,28.6],[-106.1,28.6]]]}, ownerId: admin.id },
      { clientName: 'Agave Azul', crop: 'AGAVE', state: 'SONORA', areaHa: 520, insuredAmount: 980000, validFrom: new Date('2025-07-15'), validTo: new Date('2026-07-15'), polygon: {"type":"Polygon","coordinates":[[[-110.95,29.05],[-110.95,29.06],[-110.94,29.06],[-110.94,29.05],[-110.95,29.05]]]}, ownerId: admin.id }
    ]
  });
}
main().finally(() => prisma.$disconnect());
