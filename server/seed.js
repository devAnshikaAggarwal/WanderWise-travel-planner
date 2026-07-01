const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Destination = require("./models/Destination");
const Emergency = require("./models/Emergency");

dotenv.config();

const sampleDestinations = [
  {
    name: "Bali",
    country: "Indonesia",
    description:
      "A tropical paradise known for its beaches, temples, and vibrant culture.",
    image: "",
    bestTime: "April to October",
    climate: "Tropical",
    photos: [],
    coordinates: { lat: -8.3405, lng: 115.092 },
  },
  {
    name: "Santorini",
    country: "Greece",
    description:
      "Famous for its white-washed buildings, blue domes, and stunning sunsets.",
    image: "",
    bestTime: "June to September",
    climate: "Mediterranean",
    photos: [],
    coordinates: { lat: 36.3932, lng: 25.4615 },
  },
  {
    name: "Kyoto",
    country: "Japan",
    description:
      "A city of traditional temples, cherry blossoms, and rich cultural heritage.",
    image: "",
    bestTime: "March to May",
    climate: "Temperate",
    photos: [],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    name: "Maldives",
    country: "Maldives",
    description:
      "A luxury island getaway with crystal clear waters and overwater bungalows.",
    image: "",
    bestTime: "November to April",
    climate: "Tropical",
    photos: [],
    coordinates: { lat: 3.2028, lng: 73.2207 },
  },
  {
    name: "Rajasthan",
    country: "India",
    description:
      "Known for majestic forts, desert landscapes, and royal heritage.",
    image: "",
    bestTime: "October to March",
    climate: "Arid",
    photos: [],
    coordinates: { lat: 27.0238, lng: 74.2179 },
  },
  {
    name: "Paris",
    country: "France",
    description:
      "The city of lights, known for the Eiffel Tower, art, and cuisine.",
    image: "",
    bestTime: "April to June",
    climate: "Temperate",
    photos: [],
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    name: "Manali",
    country: "India",
    description:
      "A scenic hill station in the Himalayas, popular for adventure sports.",
    image: "",
    bestTime: "March to June",
    climate: "Alpine",
    photos: [],
    coordinates: { lat: 32.2432, lng: 77.1892 },
  },
  {
    name: "Dubai",
    country: "UAE",
    description:
      "A modern desert metropolis known for luxury shopping and skyscrapers.",
    image: "",
    bestTime: "November to March",
    climate: "Desert",
    photos: [],
    coordinates: { lat: 25.2048, lng: 55.2708 },
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
