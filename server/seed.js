const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Destination = require("./models/Destination");
const Emergency = require("./models/Emergency");

dotenv.config();

// Helper to build Unsplash URLs at card + detail sizes
const u = (id, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const sampleDestinations = [
  // ---------- ASIA ----------
  {
    name: "Bali",
    country: "Indonesia",
    description:
      "A tropical paradise known for its beaches, temples, and vibrant culture.",
    image: u("photo-1537996194471-e657df975ab4"),
    bestTime: "April to October",
    climate: "Tropical",
    photos: [
      u("photo-1537996194471-e657df975ab4", 1200),
      u("photo-1555400038-63f5ba517a47", 1200),
    ],
    coordinates: { lat: -8.3405, lng: 115.092 },
  },
  {
    name: "Kyoto",
    country: "Japan",
    description:
      "A city of traditional temples, cherry blossoms, and rich cultural heritage.",
    image: u("photo-1493976040374-85c8e12f0c0e"),
    bestTime: "March to May",
    climate: "Temperate",
    photos: [u("photo-1493976040374-85c8e12f0c0e", 1200)],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    name: "Tokyo",
    country: "Japan",
    description:
      "A dazzling blend of ultramodern life and ancient tradition — neon streets, sushi, and shrines.",
    image: u("photo-1540959733332-eab4deabeeaf"),
    bestTime: "March to May",
    climate: "Temperate",
    photos: [u("photo-1540959733332-eab4deabeeaf", 1200)],
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    name: "Maldives",
    country: "Maldives",
    description:
      "A luxury island getaway with crystal clear waters and overwater bungalows.",
    image: u("photo-1514282401047-d79a71a590e8"),
    bestTime: "November to April",
    climate: "Tropical",
    photos: [u("photo-1514282401047-d79a71a590e8", 1200)],
    coordinates: { lat: 3.2028, lng: 73.2207 },
  },
  {
    name: "Bangkok",
    country: "Thailand",
    description:
      "Golden temples, floating markets, and legendary street food in Thailand's buzzing capital.",
    image: u("photo-1508009603885-50cf7c579365"),
    bestTime: "November to February",
    climate: "Tropical",
    photos: [u("photo-1508009603885-50cf7c579365", 1200)],
    coordinates: { lat: 13.7563, lng: 100.5018 },
  },
  {
    name: "Singapore",
    country: "Singapore",
    description:
      "A futuristic garden city famous for Marina Bay, hawker food, and spotless streets.",
    image: u("photo-1525625293386-3f8f99389edd"),
    bestTime: "February to April",
    climate: "Tropical",
    photos: [u("photo-1525625293386-3f8f99389edd", 1200)],
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    name: "Dubai",
    country: "UAE",
    description:
      "A modern desert metropolis known for luxury shopping and skyscrapers.",
    image: u("photo-1512453979798-5ea266f8880c"),
    bestTime: "November to March",
    climate: "Desert",
    photos: [
      u("photo-1512453979798-5ea266f8880c", 1200),
      u("photo-1518684079-3c830dcef090", 1200),
    ],
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
  {
    name: "Istanbul",
    country: "Turkey",
    description:
      "Where East meets West — grand mosques, bazaars, and Bosphorus views across two continents.",
    image: u("photo-1524231757912-21f4fe3a7200"),
    bestTime: "April to May",
    climate: "Mediterranean",
    photos: [u("photo-1524231757912-21f4fe3a7200", 1200)],
    coordinates: { lat: 41.0082, lng: 28.9784 },
  },

  // ---------- INDIA ----------
  {
    name: "Rajasthan",
    country: "India",
    description:
      "Known for majestic forts, desert landscapes, and royal heritage.",
    image: u("photo-1599661046289-e31897846e41"),
    bestTime: "October to March",
    climate: "Arid",
    photos: [u("photo-1599661046289-e31897846e41", 1200)],
    coordinates: { lat: 27.0238, lng: 74.2179 },
  },
  {
    name: "Manali",
    country: "India",
    description:
      "A scenic hill station in the Himalayas, popular for adventure sports.",
    image: u("photo-1506905925346-21bda4d32df4"),
    bestTime: "March to June",
    climate: "Alpine",
    photos: [u("photo-1506905925346-21bda4d32df4", 1200)],
    coordinates: { lat: 32.2432, lng: 77.1892 },
  },
  {
    name: "Agra",
    country: "India",
    description:
      "Home of the Taj Mahal — one of the seven wonders of the world and a monument to love.",
    image: u("photo-1564507592333-c60657eea523"),
    bestTime: "October to March",
    climate: "Semi-arid",
    photos: [u("photo-1564507592333-c60657eea523", 1200)],
    coordinates: { lat: 27.1767, lng: 78.0081 },
  },
  {
    name: "Goa",
    country: "India",
    description:
      "Sun-soaked beaches, Portuguese heritage, and a laid-back coastal vibe.",
    image: u("photo-1512343879784-a960bf40e7f2"),
    bestTime: "November to February",
    climate: "Tropical",
    photos: [u("photo-1512343879784-a960bf40e7f2", 1200)],
    coordinates: { lat: 15.2993, lng: 74.124 },
  },

  // ---------- EUROPE ----------
  {
    name: "Santorini",
    country: "Greece",
    description:
      "Famous for its white-washed buildings, blue domes, and stunning sunsets.",
    image: u("photo-1613395877344-13d4a8e0d49e"),
    bestTime: "June to September",
    climate: "Mediterranean",
    photos: [
      u("photo-1613395877344-13d4a8e0d49e", 1200),
      u("photo-1570077188670-e3a8d69ac5ff", 1200),
    ],
    coordinates: { lat: 36.3932, lng: 25.4615 },
  },
  {
    name: "Paris",
    country: "France",
    description:
      "The city of lights, known for the Eiffel Tower, art, and cuisine.",
    image: u("photo-1502602898657-3e91760cbb34"),
    bestTime: "April to June",
    climate: "Temperate",
    photos: [
      u("photo-1502602898657-3e91760cbb34", 1200),
      u("photo-1499856871958-5b9627545d1a", 1200),
    ],
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    name: "Rome",
    country: "Italy",
    description:
      "The eternal city — ancient ruins, Renaissance art, and world-famous pasta.",
    image: u("photo-1552832230-c0197dd311b5"),
    bestTime: "April to June",
    climate: "Mediterranean",
    photos: [u("photo-1552832230-c0197dd311b5", 1200)],
    coordinates: { lat: 41.9028, lng: 12.4964 },
  },
  {
    name: "Venice",
    country: "Italy",
    description:
      "A floating city of canals, gondolas, and centuries of romantic charm.",
    image: u("photo-1514890547357-a9ee288728e0"),
    bestTime: "April to June",
    climate: "Mediterranean",
    photos: [u("photo-1514890547357-a9ee288728e0", 1200)],
    coordinates: { lat: 45.4408, lng: 12.3155 },
  },
  {
    name: "London",
    country: "United Kingdom",
    description:
      "Royal palaces, iconic red buses, world-class museums, and historic charm.",
    image: u("photo-1513635269975-59663e0ac1ad"),
    bestTime: "May to September",
    climate: "Temperate",
    photos: [u("photo-1513635269975-59663e0ac1ad", 1200)],
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    name: "Barcelona",
    country: "Spain",
    description:
      "Gaudí's surreal architecture, Mediterranean beaches, and legendary tapas culture.",
    image: u("photo-1583422409516-2895a77efded"),
    bestTime: "May to June",
    climate: "Mediterranean",
    photos: [u("photo-1583422409516-2895a77efded", 1200)],
    coordinates: { lat: 41.3874, lng: 2.1686 },
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    description:
      "Picturesque canals, cycling culture, tulips, and cozy brown cafés.",
    image: u("photo-1534351590666-13e3e96b5017"),
    bestTime: "April to May",
    climate: "Temperate",
    photos: [u("photo-1534351590666-13e3e96b5017", 1200)],
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },
  {
    name: "Prague",
    country: "Czech Republic",
    description:
      "A fairy-tale city of gothic spires, cobbled lanes, and a thousand years of history.",
    image: u("photo-1541849546-216549ae216d"),
    bestTime: "May to September",
    climate: "Temperate",
    photos: [u("photo-1541849546-216549ae216d", 1200)],
    coordinates: { lat: 50.0755, lng: 14.4378 },
  },
  {
    name: "Interlaken",
    country: "Switzerland",
    description:
      "Alpine adventure hub between two lakes, framed by the mighty Jungfrau mountains.",
    image: u("photo-1527668752968-14dc70a27c95"),
    bestTime: "June to September",
    climate: "Alpine",
    photos: [u("photo-1527668752968-14dc70a27c95", 1200)],
    coordinates: { lat: 46.6863, lng: 7.8632 },
  },

  // ---------- AMERICAS / AFRICA / OCEANIA ----------
  {
    name: "New York",
    country: "USA",
    description:
      "The city that never sleeps — skyscrapers, Broadway, Central Park, and endless energy.",
    image: u("photo-1496442226666-8d4d0e62e6e9"),
    bestTime: "April to June",
    climate: "Temperate",
    photos: [u("photo-1496442226666-8d4d0e62e6e9", 1200)],
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    description:
      "Carnival spirit, Copacabana beach, and Christ the Redeemer above it all.",
    image: u("photo-1483729558449-99ef09a8c325"),
    bestTime: "December to March",
    climate: "Tropical",
    photos: [u("photo-1483729558449-99ef09a8c325", 1200)],
    coordinates: { lat: -22.9068, lng: -43.1729 },
  },
  {
    name: "Sydney",
    country: "Australia",
    description:
      "Harbour city icon — the Opera House, Bondi Beach, and a sunny outdoor lifestyle.",
    image: u("photo-1506973035872-a4ec16b8e8d9"),
    bestTime: "September to November",
    climate: "Temperate",
    photos: [u("photo-1506973035872-a4ec16b8e8d9", 1200)],
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },
];

const sampleEmergency = [
  {
    country: "India",
    policeNo: "100",
    ambulanceNo: "108",
    fireNo: "101",
    touristHelpline: "1363",
  },
  {
    country: "Indonesia",
    policeNo: "110",
    ambulanceNo: "118",
    fireNo: "113",
    touristHelpline: "+62-21-5650-5050",
  },
  {
    country: "Greece",
    policeNo: "100",
    ambulanceNo: "166",
    fireNo: "199",
    touristHelpline: "171",
  },
  {
    country: "Japan",
    policeNo: "110",
    ambulanceNo: "119",
    fireNo: "119",
    touristHelpline: "+81-3-3501-0110",
  },
  {
    country: "Maldives",
    policeNo: "119",
    ambulanceNo: "102",
    fireNo: "118",
    touristHelpline: "+960-332-2752",
  },
  {
    country: "France",
    policeNo: "17",
    ambulanceNo: "15",
    fireNo: "18",
    touristHelpline: "3975",
  },
  {
    country: "UAE",
    policeNo: "999",
    ambulanceNo: "998",
    fireNo: "997",
    touristHelpline: "800-4438",
  },
  {
    country: "Thailand",
    policeNo: "191",
    ambulanceNo: "1669",
    fireNo: "199",
    touristHelpline: "1155",
  },
  {
    country: "Singapore",
    policeNo: "999",
    ambulanceNo: "995",
    fireNo: "995",
    touristHelpline: "1800-736-2000",
  },
  {
    country: "Turkey",
    policeNo: "155",
    ambulanceNo: "112",
    fireNo: "110",
    touristHelpline: "+90-212-527-4503",
  },
  {
    country: "Italy",
    policeNo: "113",
    ambulanceNo: "118",
    fireNo: "115",
    touristHelpline: "112",
  },
  {
    country: "United Kingdom",
    policeNo: "999",
    ambulanceNo: "999",
    fireNo: "999",
    touristHelpline: "101",
  },
  {
    country: "Spain",
    policeNo: "091",
    ambulanceNo: "061",
    fireNo: "080",
    touristHelpline: "112",
  },
  {
    country: "Netherlands",
    policeNo: "112",
    ambulanceNo: "112",
    fireNo: "112",
    touristHelpline: "0900-8844",
  },
  {
    country: "Czech Republic",
    policeNo: "158",
    ambulanceNo: "155",
    fireNo: "150",
    touristHelpline: "112",
  },
  {
    country: "Switzerland",
    policeNo: "117",
    ambulanceNo: "144",
    fireNo: "118",
    touristHelpline: "112",
  },
  {
    country: "USA",
    policeNo: "911",
    ambulanceNo: "911",
    fireNo: "911",
    touristHelpline: "311",
  },
  {
    country: "Brazil",
    policeNo: "190",
    ambulanceNo: "192",
    fireNo: "193",
    touristHelpline: "+55-61-2023-8888",
  },
  {
    country: "Australia",
    policeNo: "000",
    ambulanceNo: "000",
    fireNo: "000",
    touristHelpline: "1300-363-979",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Destination.deleteMany({});
    await Destination.insertMany(sampleDestinations);
    console.log(`Seeded ${sampleDestinations.length} destinations ✅`);

    await Emergency.deleteMany({});
    await Emergency.insertMany(sampleEmergency);
    console.log(`Seeded ${sampleEmergency.length} emergency contacts ✅`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();
