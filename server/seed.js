const mongoose = require('mongoose');
require('dotenv').config();

const User        = require('./models/User');
const Post        = require('./models/Post');
const Trip        = require('./models/Trip');
const Destination = require('./models/Destination');

const DESTINATIONS_DATA = [
  {
    name: "Santorini, Greece", category: "Beach", country: "Greece", budget: "Luxury",
    rating: 4.9, reviews: 2341,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    description: "Iconic white-washed buildings perched on volcanic cliffs above the Aegean Sea.",
    tags: ["Romantic", "Scenic", "Photography"]
  },
  {
    name: "Machu Picchu, Peru", category: "Historical", country: "Peru", budget: "Mid-range",
    rating: 4.8, reviews: 3102,
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80",
    description: "Ancient Inca citadel set high in the Andes Mountains above the Sacred Valley.",
    tags: ["Heritage", "Hiking", "History"]
  },
  {
    name: "Banff, Canada", category: "Mountain", country: "Canada", budget: "Mid-range",
    rating: 4.9, reviews: 1876,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    description: "Turquoise glacial lakes and dramatic Rocky Mountain scenery in Canada's oldest park.",
    tags: ["Nature", "Hiking", "Wildlife"]
  },
  {
    name: "Tokyo, Japan", category: "City", country: "Japan", budget: "Mid-range",
    rating: 4.8, reviews: 5421,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    description: "A dazzling fusion of ultramodern skyscrapers, neon lights, and ancient temples.",
    tags: ["Culture", "Food", "Shopping"]
  },
  {
    name: "Serengeti, Tanzania", category: "Nature", country: "Tanzania", budget: "Luxury",
    rating: 4.9, reviews: 987,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80",
    description: "Witness the Great Migration across endless golden savannahs teeming with wildlife.",
    tags: ["Safari", "Wildlife", "Adventure"]
  },
  {
    name: "Queenstown, NZ", category: "Adventure", country: "New Zealand", budget: "Mid-range",
    rating: 4.7, reviews: 2108,
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80",
    description: "The adventure capital of the world nestled beside a glacial lake and the Remarkables.",
    tags: ["Extreme Sports", "Scenic", "Skiing"]
  },
  {
    name: "Amalfi Coast, Italy", category: "Beach", country: "Italy", budget: "Luxury",
    rating: 4.8, reviews: 3300,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    description: "Dramatic cliffside villages, turquoise waters, and the finest Italian cuisine.",
    tags: ["Scenic", "Romantic", "Food"]
  },
  {
    name: "Patagonia, Argentina", category: "Adventure", country: "Argentina", budget: "Budget",
    rating: 4.8, reviews: 1205,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    description: "Raw, untouched wilderness at the end of the world — glaciers, peaks, and pumas.",
    tags: ["Trekking", "Wilderness", "Photography"]
  }
];

const USERS_DATA = [
  { username: "sophie", name: "Sophie Kowalski", password: "password123", initials: "SK", country: "Poland", visited: ["Iceland", "Norway", "Japan"], avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&q=80", bio: "Chasing the Northern Lights ✨", followers: 1204, tripsCount: 28, color: "var(--teal)" },
  { username: "kenji", name: "Kenji Tanaka", password: "password123", initials: "KT", country: "Japan", visited: ["Peru", "India", "Ethiopia"], avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", bio: "Every country has its own story 📖", followers: 3401, tripsCount: 41, color: "var(--blue)" },
  { username: "amara", name: "Amara Diallo", password: "password123", initials: "AD", country: "Senegal", visited: ["France", "Brazil", "Morocco"], avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80", bio: "Food, music, sunsets 🌍", followers: 876, tripsCount: 19, color: "var(--orange)" },
  { username: "isabella", name: "Isabella Rossi", password: "password123", initials: "IR", country: "Italy", visited: ["Greece", "Turkey", "Indonesia"], avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80", bio: "Slow travel, deep connections 🍃", followers: 2190, tripsCount: 33, color: "var(--pink)" },
  { username: "omar", name: "Omar Hassan", password: "password123", initials: "OH", country: "Egypt", visited: ["Jordan", "Spain", "Thailand"], avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80", bio: "Adventure is calling 🏔️", followers: 1560, tripsCount: 22, color: "var(--purple)" },
  { username: "yuki", name: "Yuki Park", password: "password123", initials: "YP", country: "South Korea", visited: ["New Zealand", "Canada", "Colombia"], avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80", bio: "Photography & wanderlust 📷", followers: 4120, tripsCount: 37, color: "var(--cyan)" },
  
  // Extra users from post authors
  { username: "emma", name: "Emma Rodriguez", password: "password123", initials: "ER", country: "Spain", visited: ["Bali", "Thailand"], avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", bio: "Passionate about travel & photography", followers: 450, tripsCount: 12, color: "var(--red)" },
  { username: "james", name: "James Chen", password: "password123", initials: "JC", country: "Canada", visited: ["Japan", "China"], avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", bio: "Documenting cultural journeys", followers: 1890, tripsCount: 25, color: "var(--green)" },
  { username: "priya", name: "Priya Sharma", password: "password123", initials: "PS", country: "India", visited: ["India", "Nepal"], avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", bio: "Wandering soul, festival explorer", followers: 3200, tripsCount: 15, color: "var(--indigo)" },
  { username: "lucas", name: "Lucas Martins", password: "password123", initials: "LM", country: "Brazil", visited: ["Brazil", "Peru"], avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", bio: "Nature lover, wildlife advocate", followers: 730, tripsCount: 8, color: "var(--yellow)" },

  // Admin user
  { username: "admin", name: "Admin", password: "admin123", initials: "AD", isAdmin: true, country: "United States", bio: "System Administrator", followers: 0, tripsCount: 0 }
];

const TRIPS_DATA = [
  {
    title: "Northern Lights Hunt", destination: "Iceland", date: "Feb 10–18, 2026",
    spots: 3, total: 12, price: "$2,800",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80",
    organizer: "Sophie K.", level: "Easy",
    description: "Chase the Aurora Borealis across Iceland's volcanic landscapes, geysers, and hot springs.",
    itinerary: ["Day 1–2: Reykjavik arrival & Golden Circle", "Day 3–4: Jökulsárlón Glacier Lagoon", "Day 5–6: Snæfellsnes Peninsula", "Day 7–8: Aurora hunting in Akureyri"],
    includes: ["Accommodation", "Aurora expert guide", "Northern lights jeep tours", "Geothermal spa entry"],
    gallery: [
      { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=85", caption: "Aurora over Icelandic wilderness" },
      { url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=900&q=85", caption: "Jökulsárlón Glacier Lagoon at twilight" },
      { url: "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=900&q=85", caption: "Golden Circle — Geysir eruption" },
      { url: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=900&q=85", caption: "Ice cave exploration" },
      { url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=85", caption: "Snowy volcanic peaks at sunrise" },
      { url: "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=900&q=85", caption: "Blue Lagoon geothermal spa" },
    ]
  },
  {
    title: "Kilimanjaro Summit", destination: "Tanzania", date: "Mar 5–14, 2026",
    spots: 2, total: 8, price: "$3,200",
    image: "https://images.unsplash.com/photo-1621414050946-1e5f79a9f43b?w=600&q=80",
    organizer: "Mike O.", level: "Hard",
    description: "Reach Africa's highest peak with an experienced guide and a team of fellow adventurers.",
    itinerary: ["Day 1: Moshi & briefing", "Day 2–3: Machame Gate to Shira Camp", "Day 4–5: Lava Tower acclimatization", "Day 6: Summit night — Uhuru Peak 5,895m", "Day 7: Descent & celebration"],
    includes: ["Certified mountain guides", "All camping gear", "Park fees & rescue cover", "Certificate of completion"],
    gallery: [
      { url: "https://images.unsplash.com/photo-1621414050946-1e5f79a9f43b?w=900&q=85", caption: "Kilimanjaro summit at dawn" },
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&q=85", caption: "Serengeti plains below the mountain" },
      { url: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=900&q=85", caption: "Cloud sea from Lava Tower camp" },
      { url: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=900&q=85", caption: "Glaciers on the crater rim" },
      { url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=85", caption: "Machame rainforest trail" },
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&q=85", caption: "Team at Uhuru Peak 5,895m" },
    ]
  },
  {
    title: "Silk Road Discovery", destination: "Uzbekistan", date: "Apr 12–22, 2026",
    spots: 5, total: 14, price: "$1,900",
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600&q=80",
    organizer: "Aisha M.", level: "Easy",
    description: "Explore ancient Samarkand, Bukhara, and Khiva along the legendary Silk Road trade route.",
    itinerary: ["Day 1–2: Tashkent — museums & bazaars", "Day 3–4: Samarkand — Registan Square", "Day 5–6: Bukhara — Ark Fortress", "Day 7–8: Khiva — walled old city", "Day 9–10: Desert camp & farewell"],
    includes: ["Boutique hotels", "Local guides", "All entrance fees", "Traditional dinner experiences"],
    gallery: [
      { url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=900&q=85", caption: "Registan Square, Samarkand" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85", caption: "Tilework of the Kalon Mosque" },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=85", caption: "Khiva old city at golden hour" },
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=85", caption: "Bukhara bazaar spice stalls" },
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&q=85", caption: "Kyzylkum Desert sunset camp" },
      { url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=85", caption: "Silk Road camel caravan" },
    ]
  },
  {
    title: "Patagonia Trek", destination: "Argentina & Chile", date: "Nov 3–15, 2026",
    spots: 4, total: 10, price: "$4,100",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    organizer: "Carlos R.", level: "Moderate",
    description: "Trek the W Circuit in Torres del Paine with epic glacier and mountain views.",
    itinerary: ["Day 1–2: Puerto Natales & gear check", "Day 3–4: Mirador Las Torres", "Day 5–6: Valle del Francés", "Day 7–8: Grey Glacier", "Day 9–10: El Chaltén & Fitz Roy", "Day 11–12: Return & celebration"],
    includes: ["Mountain refugios & camping", "Certified Patagonia guide", "Park entry fees", "Emergency rescue insurance"],
    gallery: [
      { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85", caption: "Torres del Paine towers at sunrise" },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85", caption: "Grey Glacier — electric blue ice" },
      { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=85", caption: "Milky Way over Patagonian peaks" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85", caption: "Fitz Roy at first light, El Chaltén" },
      { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85", caption: "Lago Nordenskjöld turquoise waters" },
      { url: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=900&q=85", caption: "Condors soaring over Valle Francés" },
    ]
  }
];

const POSTS_DATA = [
  {
    authorUsername: "emma",
    location: "Bali, Indonesia",
    caption: "Just watched the most incredible sunrise from Mount Batur. The trek started at 2am but it was completely worth it — the sky turned every shade of orange and pink! 🌅",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80",
    tags: ["#Bali", "#Sunrise", "#Hiking"]
  },
  {
    authorUsername: "james",
    location: "Kyoto, Japan",
    caption: "Cherry blossom season in Kyoto is everything people say it is and more. Walked through Maruyama Park at dusk and it felt like stepping into a painting. Absolutely magical. 🌸",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=700&q=80",
    tags: ["#Kyoto", "#Sakura", "#Japan"]
  },
  {
    authorUsername: "priya",
    location: "Rajasthan, India",
    caption: "The colors of Holi in Jaipur — I had no words, just pure joy. Our whole group was drenched in pink and yellow by 9am. Hands-down the most joyful day of my life 🎨",
    image: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=700&q=80",
    tags: ["#Holi", "#India", "#Festival"]
  },
  {
    authorUsername: "lucas",
    location: "Amazon, Brazil",
    caption: "Three days deep in the Amazon rainforest. No signal, no tourists — just howler monkeys, pink river dolphins, and a sky full of stars every night. Life-changing experience 🌿",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&q=80",
    tags: ["#Amazon", "#Nature", "#Wildlife"]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tourismconnect');
    console.log('✅ Connected.');

    // Clear existing data
    console.log('Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Trip.deleteMany({}),
      Destination.deleteMany({})
    ]);
    console.log('✅ Collections cleared.');

    // Seed Destinations
    console.log('Seeding destinations...');
    await Destination.insertMany(DESTINATIONS_DATA);
    console.log('✅ Seeded destinations.');

    // Seed Users
    console.log('Seeding users...');
    const createdUsers = [];
    for (const u of USERS_DATA) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`✅ Seeded ${createdUsers.length} users.`);

    // Seed Trips
    console.log('Seeding group trips...');
    const memberIds = createdUsers.filter(u => !u.isAdmin).map(u => u._id);
    for (const t of TRIPS_DATA) {
      // Pick some random members
      const shuffled = [...memberIds].sort(() => 0.5 - Math.random());
      const selectedMembers = shuffled.slice(0, t.total - t.spots);
      
      await Trip.create({
        ...t,
        members: selectedMembers,
        createdBy: createdUsers[0]._id // Creator is the first user
      });
    }
    console.log('✅ Seeded group trips.');

    // Seed Posts
    console.log('Seeding posts...');
    for (const p of POSTS_DATA) {
      const user = createdUsers.find(u => u.username === p.authorUsername);
      if (!user) continue;

      // Create a few random likes and comments
      const likeUsers = createdUsers.filter(u => Math.random() > 0.5).map(u => u._id);
      const comments = [
        { text: "Wow, this is beautiful!", user: createdUsers[0]._id },
        { text: "Stunning shot! Adding to my bucket list.", user: createdUsers[1]._id }
      ];

      await Post.create({
        user: user._id,
        location: p.location,
        caption: p.caption,
        image: p.image,
        tags: p.tags,
        likes: likeUsers,
        comments: comments
      });
    }
    console.log('✅ Seeded posts.');

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
