import { PrismaClient } from '../generated/prisma/client';
import { CurrencyCreateInput } from '../generated/prisma/models/Currency';

const prisma = new PrismaClient();

const seedCycles = async () => {};

const seedCurrency = async () => {
  const currencies: CurrencyCreateInput[] = [
    {
      name: 'Alfa',
      symbol: 'ALFA',
      description: 'Валюта, которая добывает в цикл Альфы',
    },
    {
      name: 'Betta',
      symbol: 'BETTA',
      description: 'Валюта, которая добывает в цикл Беты',
    },
    {
      name: 'Omega',
      symbol: 'OMEGA',
      description: 'Валюта, которая добывает в цикл Омеги',
    },
  ];

  await prisma.currency.createMany({
    data: currencies,
  });
};

async function main() {
  const args = process.argv.slice(2);

  console.log('Start seed data...');
  console.log('args:', args);

  if (args.includes('currency')) {
    await seedCurrency();
  }

  if (args.includes('cycles')) {
    await seedCycles();
  }

  if (args.includes('all') || args.length === 0) {
    await seedCurrency();
    await seedCycles();
  }
  console.log('Data has been seeded!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
