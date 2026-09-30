import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean old data if any
  await prisma.analyticsEvent.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);
  const ownerPasswordHash = await bcrypt.hash('demo123', salt);

  // 1. Create Admin
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@qrapp.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // 2. Create Business Owner
  const ownerUser = await prisma.user.create({
    data: {
      name: 'Marco Rossi',
      email: 'demo@artisan.com',
      passwordHash: ownerPasswordHash,
      role: 'OWNER',
    },
  });

  // 3. Create Flagship Business with the exact prompt public ID: BUS_8F72K9
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const publicId = 'BUS_8F72K9';

  const business = await prisma.business.create({
    data: {
      publicId,
      name: 'Artisan Woodfire & Specialty Cafe',
      category: 'Restaurant',
      tagline: 'Artisanal sourdough pizzas, hand-pulled pasta & single-origin coffee',
      description:
        'Crafted with slow-fermented organic sourdough, authentic San Marzano tomatoes, and artisanal fior di latte. Paired with third-wave specialty coffees brewed to perfection.',
      phone: '+1 234 567 8900',
      whatsapp: '+1 234 567 8900',
      email: 'hello@artisanwoodfire.com',
      website: 'https://artisanwoodfire.com',
      address: '42 Heritage Boulevard, Gourmet Quarter',
      city: 'Downtown',
      googleMapsUrl: 'https://maps.google.com/?q=42+Heritage+Boulevard',
      instagram: 'artisanwoodfire',
      facebook: 'artisanwoodfirecafe',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      currency: '₹',
      status: 'ACTIVE',
      ownerId: ownerUser.id,
      subscription: {
        create: {
          planName: 'PRO',
          status: 'ACTIVE',
          features: JSON.stringify(['unlimited_products', 'custom_qr', 'analytics', 'offers']),
        },
      },
      qrCode: {
        create: {
          targetUrl: `${clientUrl}/m/${publicId}`,
          downloadCount: 24,
          scansCount: 1842,
          qrStyle: JSON.stringify({
            fgColor: '#111111',
            bgColor: '#FFFFFF',
            level: 'H',
            includeMargin: true,
          }),
        },
      },
      hours: {
        create: [
          { dayOfWeek: 1, dayName: 'Monday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 2, dayName: 'Tuesday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 3, dayName: 'Wednesday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 4, dayName: 'Thursday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 5, dayName: 'Friday', openTime: '08:30', closeTime: '23:30', isClosed: false },
          { dayOfWeek: 6, dayName: 'Saturday', openTime: '08:00', closeTime: '23:30', isClosed: false },
          { dayOfWeek: 0, dayName: 'Sunday', openTime: '08:30', closeTime: '22:30', isClosed: false },
        ],
      },
    },
  });

  // 4. Create Categories
  const catPizzas = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Artisan Wood-Fired Pizzas',
      description: 'Slow-fermented for 48 hours and baked in our 450°C Italian stone oven.',
      sortOrder: 0,
      isActive: true,
    },
  });

  const catPasta = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Handmade Pastas & Mains',
      description: 'Freshly rolled daily with organic semolina and pasture-raised eggs.',
      sortOrder: 1,
      isActive: true,
    },
  });

  const catCoffee = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Specialty Coffee & Brews',
      description: 'Single-origin Ethiopian and Colombian beans roasted in-house.',
      sortOrder: 2,
      isActive: true,
    },
  });

  const catDesserts = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Artisan Desserts',
      description: 'Classic desserts made from authentic European recipes.',
      sortOrder: 3,
      isActive: true,
    },
  });

  // 5. Create Products
  const productsData = [
    // Pizzas
    {
      categoryId: catPizzas.id,
      name: 'Margherita Burrata Speciale',
      description: 'San Marzano DOP tomatoes, imported fresh burrata heart, aged balsamic reduction, fresh sweet basil.',
      price: 499,
      discountPrice: 399,
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: true,
      dietaryType: 'VEG',
      sortOrder: 0,
    },
    {
      categoryId: catPizzas.id,
      name: 'Truffle Wild Mushroom Pizza',
      description: 'Fior di latte, roasted portobello, porcini crema, white truffle oil, and wild thyme.',
      price: 549,
      discountPrice: 489,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: true,
      dietaryType: 'VEG',
      sortOrder: 1,
    },
    {
      categoryId: catPizzas.id,
      name: 'Diavola Spicy Salami',
      description: 'Spicy calabrian salami, crushed red pepper, smoked provolone, and hot wildflower honey drizzle.',
      price: 569,
      discountPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: false,
      dietaryType: 'NON_VEG',
      sortOrder: 2,
    },
    {
      categoryId: catPizzas.id,
      name: 'Garden Primavera Vegan',
      description: 'Grilled artichoke hearts, sun-dried tomatoes, cashew mozzarella, and pistachio pesto.',
      price: 479,
      discountPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: false,
      dietaryType: 'VEGAN',
      sortOrder: 3,
    },

    // Pasta
    {
      categoryId: catPasta.id,
      name: 'Handcrafted Tagliatelle al Tartufo',
      description: 'Silky egg ribbon pasta tossed in black summer truffle butter, parmesan reggiano 24-months, fresh parsley.',
      price: 589,
      discountPrice: 499,
      imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: true,
      dietaryType: 'VEG',
      sortOrder: 0,
    },
    {
      categoryId: catPasta.id,
      name: 'Slow-Cooked Chianti Beef Ragu',
      description: 'Braised beef shank simmered for 8 hours with Chianti red wine, served over thick pappardelle.',
      price: 649,
      discountPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: true,
      dietaryType: 'NON_VEG',
      sortOrder: 1,
    },

    // Coffee
    {
      categoryId: catCoffee.id,
      name: 'Cortado Reserva',
      description: 'Equal parts single-origin espresso and silky textured micro-foamed milk.',
      price: 180,
      discountPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: false,
      dietaryType: 'VEG',
      sortOrder: 0,
    },
    {
      categoryId: catCoffee.id,
      name: 'Iced Vanilla Oat Shakerato',
      description: 'Double shot espresso shaken with organic Madagascar vanilla bean and creamy oat milk.',
      price: 240,
      discountPrice: 199,
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: true,
      dietaryType: 'VEGAN',
      sortOrder: 1,
    },

    // Desserts
    {
      categoryId: catDesserts.id,
      name: 'Authentic Venetian Tiramisu',
      description: 'Savoiardi soaked in fresh espresso and Marsala, layered with whipped mascarpone cream and Valrhona cocoa.',
      price: 290,
      discountPrice: 249,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: true,
      dietaryType: 'VEG',
      sortOrder: 0,
    },
    {
      categoryId: catDesserts.id,
      name: 'Warm Pistachio Lava Tart',
      description: 'Buttery shortcrust filled with Sicilian molten pistachio cream, served with Madagascar vanilla gelato.',
      price: 340,
      discountPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isFeatured: false,
      dietaryType: 'VEG',
      sortOrder: 1,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({
      data: {
        ...prod,
        businessId: business.id,
      },
    });
  }

  // 6. Create Active Offers
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  await prisma.offer.create({
    data: {
      businessId: business.id,
      title: '20% OFF Artisan Pizzas & Pastas',
      description: 'Celebrate the Italian culinary season with 20% discount on all handcrafted pizzas and pastas.',
      discountType: 'PERCENTAGE',
      discountAmount: 20,
      promoCode: 'ARTISAN20',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: nextMonth,
      isActive: true,
    },
  });

  await prisma.offer.create({
    data: {
      businessId: business.id,
      title: 'Complimentary Dessert on Orders over ₹999',
      description: 'Get our award-winning Venetian Tiramisu free when you dine or order above ₹999.',
      discountType: 'FIXED',
      discountAmount: 290,
      promoCode: 'SWEETTREAT',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      endDate: twoWeeks,
      isActive: true,
    },
  });

  // 7. Seed realistic analytics events over past 7 days
  const eventTypes = ['QR_SCAN', 'PAGE_VIEW', 'PRODUCT_VIEW', 'CATEGORY_CLICK', 'OFFER_VIEW', 'CONTACT_CLICK'];
  const sampleEvents = [];

  for (let d = 6; d >= 0; d--) {
    const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const count = 40 + Math.floor(Math.random() * 30);
    for (let j = 0; j < count; j++) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const hourOffset = Math.floor(Math.random() * 14) + 9; // 9am to 11pm
      const eventTime = new Date(dayDate);
      eventTime.setHours(hourOffset, Math.floor(Math.random() * 60));

      sampleEvents.push({
        businessId: business.id,
        eventType: type,
        createdAt: eventTime,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)',
      });
    }
  }

  for (const ev of sampleEvents) {
    await prisma.analyticsEvent.create({ data: ev });
  }

  console.log('✅ Seeding complete!');
  console.log(`Demo Owner Login: demo@artisan.com / demo123`);
  console.log(`Admin Login: admin@qrapp.com / admin123`);
  console.log(`Public Business URL: ${clientUrl}/m/${publicId}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
