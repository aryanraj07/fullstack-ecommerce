// import { PrismaClient } from "../generated/prisma/client";
// import slugify from "slugify";
// import { PrismaPg } from "@prisma/adapter-pg";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });
// const prisma = new PrismaClient({
//   adapter,
// });

// async function main() {
//   console.log("Seeding database...");

//   /* ---------------- SELLER ---------------- */

//   const seller = await prisma.seller.upsert({
//     where: { email: "seller@example.com" },
//     update: {},
//     create: {
//       name: "Amazon",
//       email: "seller@example.com",
//       rating: 4.8,
//       location: "USA",
//     },
//   });

//   /* ---------------- FETCH PRODUCTS ---------------- */
//   const limit = 100;
//   let skip = 0;
//   let products: any[] = [];
//   // const res = await fetch("https://dummyjson.com/products?limit=100");
//   // const data = await res.json();

//   // const products = data.products;

//   /* ---------------- CATEGORIES ---------------- */
//   while (true) {
//     const res = await fetch(
//       `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
//     );
//     const data = await res.json();
//     products.push(...data.products);
//     if (data.products.length < limit) break;
//     skip += limit;
//   }

//   const categoriesMap = new Map<string, number>();

//   for (const p of products) {
//     if (!categoriesMap.has(p.category)) {
//       const cat = await prisma.category.upsert({
//         where: { slug: slugify(p.category, { lower: true }) },
//         update: {},
//         create: {
//           name: p.category,
//           slug: slugify(p.category, { lower: true }),
//         },
//       });

//       categoriesMap.set(p.category, cat.id);
//     }
//   }

//   /* ---------------- BRANDS ---------------- */

//   const brandsMap = new Map<string, number>();

//   for (const p of products) {
//     if (p.brand && !brandsMap.has(p.brand)) {
//       const brand = await prisma.brand.create({
//         data: {
//           name: p.brand,
//           slug: slugify(p.brand, { lower: true }),
//         },
//       });

//       brandsMap.set(p.brand, brand.id);
//     }
//   }

//   /* ---------------- TAGS ---------------- */

//   const tagsMap = new Map<string, number>();

//   for (const p of products) {
//     for (const tag of p.tags) {
//       if (!tagsMap.has(tag)) {
//         const created = await prisma.tag.create({
//           data: { name: tag },
//         });

//         tagsMap.set(tag, created.id);
//       }
//     }
//   }

//   /* ---------------- PRODUCTS ---------------- */

//   for (const p of products) {
//     const product = await prisma.product.create({
//       data: {
//         title: p.title,
//         slug: `${slugify(p.title, { lower: true })}-${p.id}`,
//         description: p.description,

//         categoryId: categoriesMap.get(p.category)!,
//         sellerId: seller.id,

//         price: p.price,
//         discountPercentage: p.discountPercentage,

//         rating: p.rating,
//         totalReviews: p.reviews?.length ?? 0,

//         stock: p.stock,

//         sku: p.sku,

//         brandId: p.brand ? brandsMap.get(p.brand) : null,

//         weight: p.weight,

//         dimensions: p.dimensions,

//         returnPolicy: p.returnPolicy,
//         warrantyInformation: p.warrantyInformation,
//         shippingInformation: p.shippingInformation,

//         minimumOrderQuantity: p.minimumOrderQuantity,

//         availabilityStatus: p.availabilityStatus,

//         thumbnail: p.thumbnail,
//         images: p.images,

//         meta: p.meta,
//       },
//     });

//     /* ---------------- PRODUCT TAGS ---------------- */

//     for (const tag of p.tags) {
//       const tagId = tagsMap.get(tag)!;

//       await prisma.productTag.create({
//         data: {
//           productId: product.id,
//           tagId: tagId,
//         },
//       });
//     }

//     /* ---------------- REVIEWS ---------------- */

//     if (p.reviews) {
//       for (const review of p.reviews) {
//         await prisma.review.create({
//           data: {
//             rating: review.rating,
//             comment: review.comment,
//             reviewerName: review.reviewerName,
//             reviewerEmail: review.reviewerEmail,
//             productId: product.id,
//           },
//         });
//       }
//     }
//   }

//   console.log("Seeding finished");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
