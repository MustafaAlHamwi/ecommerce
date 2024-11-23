import { faker, fakerAR, fakerEN, tr } from "@faker-js/faker";
import { permissions, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { add, addDays, addYears, setHours, setMinutes } from "date-fns";

import { ALLPUBLICDOMAINS } from "../ALLPUBLICDOMAINS";

const productImages = [
  // Shirts & Tops
  {
    id: 1,
    name: "Classic White Shirt",
    imageUrl: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176",
    category: "shirts",
    price: 89.99,
  },
  {
    id: 2,
    name: "Striped Oxford Shirt",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
    category: "shirts",
    price: 79.99,
  },
  {
    id: 3,
    name: "Casual Linen Shirt",
    imageUrl: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a",
    category: "shirts",
    price: 69.99,
  },

  // Outerwear
  {
    id: 4,
    name: "Classic Denim Jacket",
    imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
    category: "jackets",
    price: 129.99,
  },
  {
    id: 5,
    name: "Leather Biker Jacket",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    category: "jackets",
    price: 299.99,
  },
  {
    id: 6,
    name: "Wool Peacoat",
    imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb",
    category: "jackets",
    price: 249.99,
  },

  // Dresses
  {
    id: 7,
    name: "Floral Summer Dress",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
    category: "dresses",
    price: 119.99,
  },
  {
    id: 8,
    name: "Evening Cocktail Dress",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
    category: "dresses",
    price: 179.99,
  },

  // Pants & Bottoms
  {
    id: 9,
    name: "Slim Fit Jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    category: "pants",
    price: 99.99,
  },
  {
    id: 10,
    name: "Chino Trousers",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
    category: "pants",
    price: 89.99,
  },

  // Shoes
  {
    id: 11,
    name: "Classic Leather Boots",
    imageUrl: "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
    category: "shoes",
    price: 199.99,
  },
  {
    id: 12,
    name: "Canvas Sneakers",
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    category: "shoes",
    price: 79.99,
  },

  // Accessories
  {
    id: 13,
    name: "Leather Tote Bag",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    category: "accessories",
    price: 149.99,
  },
  {
    id: 14,
    name: "Silk Scarf",
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d",
    category: "accessories",
    price: 49.99,
  },

  // Sportswear
  {
    id: 15,
    name: "Athletic Performance Shirt",
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c",
    category: "sportswear",
    price: 59.99,
  },
  {
    id: 16,
    name: "Running Shorts",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570",
    category: "sportswear",
    price: 45.99,
  },
];

const prisma = new PrismaClient();
async function main() {
  const audit = { createdBy: "1", updatedBy: "1" };
  await prisma.cartItem.deleteMany({});
  await prisma.shoppingCart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({ where: { id: "1" } });
  await prisma.ecommerce.deleteMany({ where: { id: "1" } });

  let ecommerce = await prisma.ecommerce.findFirst({
    where: { id: "1" },
  });

  let superAdmin = await prisma.user.findFirst({
    where: { id: "1" },
  });

  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        id: "1",
        firstName: "super",
        lastName: "admin",
      },
    });
  }

  let ecommerce1: string | undefined;

  if (!ecommerce) {
    const createdEcommerce = prisma.ecommerce.create({
      data: {
        id: "1",
        name: "ecommerce",
      },
    });
    ecommerce1 = (await createdEcommerce).id;
  }

  console.log(">>>> ecommece Seeded");

  await prisma.publicEmailProvider.deleteMany({});
  await prisma.emailVerify.deleteMany({});
  await prisma.user.deleteMany({});

  // publicEmailProviders seed
  await prisma.publicEmailProvider.createMany({
    data: [
      ...ALLPUBLICDOMAINS.map((domain) => {
        return { domain: domain, createdBy: "1", updatedBy: "1" };
      }),
    ],
  });
  console.log(">>>> publicDomains seeded");

  //seed Employee table
  const hashedPassword = await bcrypt.hash("asddsa", 10);

  const testUser = await prisma.user.create({
    data: {
      firstName: "Manager",
      lastName: "Test",
      email: "manager@test.com",
      emailVerified: new Date("2024-11-21"),
      Accounts: {
        create: {
          password: hashedPassword,
          provider: "credentials",
          type: "credentials",
        },
      },
    },
    // select: { id: true },
  });
  console.log(">>>> testUser seeded");
  const createdProuducts = await prisma.$transaction([
    ...Array.from({ length: 20 }, () => {
      const category = faker.helpers.arrayElement(productImages).category;
      const name = faker.helpers.arrayElement(productImages).name;
      const price = faker.helpers.arrayElement(productImages).price;
      const description = faker.commerce.productDescription();
      const image = faker.helpers.arrayElement(productImages).imageUrl;
      const countInStock = faker.number.int({ min: 1, max: 100 });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return prisma.product.create({
        data: {
          category,
          name,
          price,
          description,
          image,
          countInStock,
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        },
      });
    }),
  ]);
  console.log(">>>> Prouduct Seeded");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
