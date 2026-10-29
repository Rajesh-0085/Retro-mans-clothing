const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config({ path: __dirname + '/../.env' });

const sampleProducts = [
  {
    name: 'Vintage Selvedge Denim Jacket',
    category: 'Jackets',
    price: 3499,
    originalPrice: 4999,
    description: 'Constructed from 14.5oz Japanese red-line selvedge denim. Boxy vintage 1960s trucker silhouette, dual chest flap pockets, antique copper hardware, and subtle handcrafted distressing for authentic character.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Washed Indigo', 'Vintage Black', 'Raw Blue'],
    stock: 22,
    featured: true,
    rating: 4.9,
    numReviews: 48
  },
  {
    name: 'Classic Oxford Button-Down Shirt',
    category: 'Shirts',
    price: 1899,
    originalPrice: 2499,
    description: 'Tailored from 100% heavyweight combed cotton oxford cloth. Features an unlined button-down collar with an authentic roll, rear box pleat, and mother-of-pearl buttons. Perfect for layering under vintage knitwear or work jackets.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Chalk White', 'Oxford Blue', 'Sage Green'],
    stock: 35,
    featured: true,
    rating: 4.8,
    numReviews: 32
  },
  {
    name: 'Relaxed-Fit Retro Graphic T-Shirt',
    category: 'T-Shirts',
    price: 1299,
    originalPrice: 1799,
    description: '280 GSM heavyweight dry-hand organic cotton jersey. Vintage wash treatment giving a soft worn-in feel, vintage typography screen print inspired by 1970s Tokyo record bars. Seamless tubular body construction.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Washed Charcoal', 'Ecru Off-White', 'Muted Olive'],
    stock: 45,
    featured: true,
    rating: 4.7,
    numReviews: 64
  },
  {
    name: 'Straight-Fit Vintage Wash Jeans',
    category: 'Jeans',
    price: 2799,
    originalPrice: 3699,
    description: 'Mid-rise classic straight leg jeans crafted from 13.5oz ring-spun cotton denim. Stone-washed for 4 hours to achieve authentic 90s vintage marbling. Button fly, reinforced pocket bags, and classic chainstitch hem.',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Medium Stonewash', 'Faded Blue', 'Solid Black'],
    stock: 18,
    featured: true,
    rating: 4.9,
    numReviews: 41
  },
  {
    name: 'Wide-Wale Corduroy Trousers',
    category: 'Jeans',
    price: 2499,
    originalPrice: 3299,
    description: 'Heavy 8-wale textured cotton corduroy with deep velvet ridges. Cut in a relaxed pleated taper with tailored interior waistband and horn buttons. Brings rich vintage tactile warmth to casual everyday outfits.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Tan', 'Forest Olive', 'Espresso Brown'],
    stock: 14,
    featured: true,
    rating: 4.8,
    numReviews: 29
  },
  {
    name: 'Minimalist Wool Blend Overshirt',
    category: 'Jackets',
    price: 3999,
    originalPrice: 5299,
    description: 'Archival workwear jacket reimagined in a soft recycled wool blend. Clean square hem, drop shoulders, concealed snap placket, and oversized chest utility pockets. An essential transitional layer.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Oatmeal Heather', 'Deep Navy', 'Charcoal'],
    stock: 16,
    featured: true,
    rating: 4.9,
    numReviews: 38
  },
  {
    name: 'Retro Striped Knit Polo',
    category: 'Shirts',
    price: 1999,
    originalPrice: 2699,
    description: 'Fine-gauge knit polo inspired by 1960s mod cinema. Horizontal chest contrast jacquard stripe, open Johnny collar, and ribbed cuffs and hem. Knitted from breathable high-twist long-staple cotton.',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Mustard / Navy', 'Cream / Olive', 'Burgundy / Sand'],
    stock: 25,
    featured: false,
    rating: 4.6,
    numReviews: 19
  },
  {
    name: 'Vintage Distressed Leather Bomber',
    category: 'Jackets',
    price: 6499,
    originalPrice: 8999,
    description: 'Hand-buffed full-grain lambskin leather treated with artisanal distressing for instant heirloom character. Heavy brass YKK zipper, custom quilted thermal lining, and durable wool-blend ribbed storm collar and cuffs.',
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Antiqued Brown', 'Washed Pitch Black'],
    stock: 8,
    featured: true,
    rating: 5.0,
    numReviews: 53
  },
  {
    name: 'Heavyweight Flannel Plaid Overshirt',
    category: 'Shirts',
    price: 2199,
    originalPrice: 2899,
    description: 'Thick double-brushed cotton flannel designed for crisp seasonal weather. Custom archival houndstooth/plaid weave with genuine corozo nut buttons and twin flap utility pockets.',
    images: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Rust Ochre Plaid', 'Forest Green Plaid', 'Vintage Monochrome'],
    stock: 28,
    featured: false,
    rating: 4.7,
    numReviews: 22
  },
  {
    name: 'Heritage Low-Top Retro Court Sneakers',
    category: 'Accessories',
    price: 3299,
    originalPrice: 4299,
    description: '1980s court silhouette with premium off-white nappa leather uppers and hairy suede toe cap accents. Vulcanized gum rubber sole with cupsole cushioning for all-day comfort.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Chalk White / Forest Green', 'Vintage Ecru / Navy'],
    stock: 19,
    featured: true,
    rating: 4.8,
    numReviews: 35
  },
  {
    name: 'Heavy Washed Carpenter Pants',
    category: 'Jeans',
    price: 2599,
    originalPrice: 3499,
    description: 'Durable 12oz cotton duck canvas with reinforced double-knee panels, authentic hammer loop, and utility tool pockets. Relaxed loose silhouette designed for modern streetwear styling.',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Caramel Tan', 'Washed Olive', 'Faded Black'],
    stock: 20,
    featured: false,
    rating: 4.7,
    numReviews: 18
  },
  {
    name: 'Washed Cotton Vintage Dad Cap',
    category: 'Accessories',
    price: 899,
    originalPrice: 1299,
    description: 'Unstructured six-panel low-profile cap crafted from pigment-dyed washed cotton twill. Antique brass slide buckle closure and subtle tonal RETRO archival monogram embroidery.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Faded Navy', 'Stone Khaki', 'Washed Black'],
    stock: 40,
    featured: false,
    rating: 4.9,
    numReviews: 50
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/retro-mens-clothing';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('[Seed] Cleared existing users, products, orders');

    // Seed Admin & Demo Customer
    const adminUser = await User.create({
      name: 'Retro Store Admin',
      email: 'saruksha0@gmail.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9952232370'
    });

    // Seed Products with unique slugs
    const productsWithSlugs = sampleProducts.map((p, idx) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + (1000 + idx),
    }));
    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`[Seed] Successfully seeded ${createdProducts.length} menswear products`);

    console.log('[Seed] Admin user created: saruksha0@gmail.com');
    console.log('[Seed] Database seeding completed successfully (no demo data)!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { seedDB, sampleProducts };
