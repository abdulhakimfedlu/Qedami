import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Define schemas matching the refined specification
const serviceSchema = new mongoose.Schema({
  identifiers: {
    en: String,
    am: String
  },
  category: String,
  description: {
    en: String,
    am: String
  },
  authorityLevel: [String],
  baseRequirements: {
    required: [{
      item: { en: String, am: String },
      description: { en: String, am: String }
    }],
    optional: [{
      item: { en: String, am: String },
      description: { en: String, am: String }
    }]
  },
  processingNotes: {
    en: String,
    am: String
  },
  keywords: [String],
  createdAt: Date,
  updatedAt: Date
});

const officeSchema = new mongoose.Schema({
  name: String,
  type: String,
  jurisdiction: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  address: {
    region: String,
    subcity: String,
    woreda: String,
    kebeleNumber: String,
    landmark: String,
    directions: { en: String, am: String }
  },
  contact: {
    phone: String,
    email: String
  },
  operatingHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean, note: String },
    saturday: { isOpen: Boolean },
    sunday: { isOpen: Boolean }
  },
  holidaySchedule: {
    isClosedToday: Boolean,
    reason: String
  },
  offerings: [{
    serviceId: mongoose.Schema.Types.ObjectId,
    isAvailable: Boolean,
    temporaryNote: String,
    additionalRequirements: [{
      item: { en: String, am: String },
      description: { en: String, am: String }
    }],
    operationalNotes: { en: String, am: String },
    fees: {
      amount: Number,
      currency: String,
      note: String
    },
    updatedAt: Date
  }],
  isActive: Boolean,
  lastVerifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
});

const Service = mongoose.model('Service', serviceSchema);
const Office = mongoose.model('Office', officeSchema);

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('Connected successfully!');

    console.log('Cleaning existing data...');
    await Service.deleteMany({});
    await Office.deleteMany({});

    console.log('Seeding services...');
    const services = [
      {
        identifiers: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" },
        category: "vital",
        description: { en: "Official document certifying the birth of a child", am: "የልጅ ልደትን የሚያረጋግጥ ይፋዊ ሰነድ" },
        authorityLevel: ["kebele", "municipal"],
        baseRequirements: {
          required: [
            { item: { en: "Hospital Notification Letter", am: "የሆስፒታል የወሊድ ማሳወቂያ ደብዳቤ" }, description: { en: "Original stamped document from hospital", am: "የማህተም ያለው ዋናው ደብዳቤ ከሆስፒታል" } },
            { item: { en: "Parents' ID Cards", am: "የወላጆች መታወቂያ ካርድ" }, description: { en: "Both parents' valid kebele ID cards", am: "የሁለቱም ወላጆች የሚሰራ ቀበሌ መታወቂያ" } }
          ],
          optional: [
            { item: { en: "Marriage Certificate", am: "የጋብቻ ሰርቲፊኬት" }, description: { en: "Only if parents are legally married", am: "ወላጆች በሕግ ከተጋቡ ብቻ" } }
          ]
        },
        processingNotes: { en: "Same day if submitted before 12:00 PM", am: "ከጠዋቱ 12 ሰዓት በፊት ከቀረበ በአንድ ቀን ይሰጣል" },
        keywords: ["birth", "newborn", "baby", "delivery", "certificate", "vital"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        identifiers: { en: "National ID Card", am: "የመታወቂያ ካርድ" },
        category: "identity",
        description: { en: "Official government-issued identification card", am: "በመንግስት የተሰጠ ይፋዊ መታወቂያ ካርድ" },
        authorityLevel: ["kebele"],
        baseRequirements: {
          required: [
            { item: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" }, description: { en: "Original birth certificate", am: "ዋናው የወሊድ ሰርቲፊኬት" } },
            { item: { en: "Passport Photos", am: "ፓስፖርት ፎቶዎች" }, description: { en: "Recent passport-size photos", am: "የቅርብ ጊዜ ፓስፖርት መጠን ፎቶዎች" } }
          ],
          optional: []
        },
        processingNotes: { en: "Same day processing", am: "በአንድ ቀን ይሰጣል" },
        keywords: ["id", "identity", "identification", "card", "kebele"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        identifiers: { en: "Ordinary Passport", am: "ህጋዊ ፓስፖርት" },
        category: "identity",
        description: { en: "Ethiopian travel passport for citizens", am: "ለኢትዮጵያ ዜጎች የጉዞ ፓስፖርት" },
        authorityLevel: ["federal"],
        baseRequirements: {
          required: [
            { item: { en: "National ID Card", am: "የመታወቂያ ካርድ" }, description: { en: "Valid kebele ID", am: "የሚሰራ ቀበሌ መታወቂያ" } },
            { item: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" }, description: { en: "Original birth certificate", am: "ዋናው የወሊድ ሰርቲፊኬት" } }
          ],
          optional: []
        },
        processingNotes: { en: "2-4 weeks processing time", am: "ከ2-4 ሳምንት ይወስዳል" },
        keywords: ["passport", "travel", "international", "document", "federal"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        identifiers: { en: "Residence Certificate", am: "የመኖሪያ ማረጋገጫ" },
        category: "vital",
        description: { en: "Certificate confirming residence in specific area", am: "በተወሰነ አካባቢ መኖርን የሚያረጋግጥ ሰርቲፊኬት" },
        authorityLevel: ["kebele"],
        baseRequirements: {
          required: [
            { item: { en: "Rental Agreement", am: "የቤት ኪራይ ውል" }, description: { en: "Valid rental contract", am: "የሚሰራ የቤት ኪራይ ውል" } },
            { item: { en: "National ID Card", am: "የመታወቂያ ካርድ" }, description: { en: "Valid kebele ID", am: "የሚሰራ ቀበሌ መታወቂያ" } }
          ],
          optional: []
        },
        processingNotes: { en: "Same day processing", am: "በአንድ ቀን ይሰጣል" },
        keywords: ["residence", "address", "proof", "kebele"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        identifiers: { en: "Business License", am: "የንግድ ፈቃድ" },
        category: "business",
        description: { en: "License to operate a business", am: "ንግድ ለመስራት የሚያስፈልግ ፈቃድ" },
        authorityLevel: ["kebele", "municipal"],
        baseRequirements: {
          required: [
            { item: { en: "Business Plan", am: "የንግድ እቅድ" }, description: { en: "Detailed business plan", am: "ዝርዝር የንግድ እቅድ" } },
            { item: { en: "National ID Card", am: "የመታወቂያ ካርድ" }, description: { en: "Valid kebele ID", am: "የሚሰራ ቀበሌ መታወቂያ" } }
          ],
          optional: []
        },
        processingNotes: { en: "3-5 days processing", am: "ከ3-5 ቀን ይወስዳል" },
        keywords: ["business", "license", "trade", "permit"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`Created ${createdServices.length} services`);

    const birthCert = createdServices.find(s => s.identifiers.en === "Birth Certificate")._id;
    const nationalId = createdServices.find(s => s.identifiers.en === "National ID Card")._id;
    const passport = createdServices.find(s => s.identifiers.en === "Ordinary Passport")._id;
    const residenceCert = createdServices.find(s => s.identifiers.en === "Residence Certificate")._id;
    const businessLicense = createdServices.find(s => s.identifiers.en === "Business License")._id;

    const standardHours = {
      monday: { open: "08:30", close: "17:30", isOpen: true },
      tuesday: { open: "08:30", close: "17:30", isOpen: true },
      wednesday: { open: "08:30", close: "17:30", isOpen: true },
      thursday: { open: "08:30", close: "17:30", isOpen: true },
      friday: { open: "08:30", close: "11:30", isOpen: true, note: "Half day" },
      saturday: { isOpen: false },
      sunday: { isOpen: false }
    };

    const federalHours = {
      monday: { open: "08:00", close: "17:00", isOpen: true },
      tuesday: { open: "08:00", close: "17:00", isOpen: true },
      wednesday: { open: "08:00", close: "17:00", isOpen: true },
      thursday: { open: "08:00", close: "17:00", isOpen: true },
      friday: { open: "08:00", close: "17:00", isOpen: true },
      saturday: { isOpen: false },
      sunday: { isOpen: false }
    };

    console.log('Seeding offices...');
    const offices = [
      // Kebele Office 1: Kirkos Kebele 05 (Blue photos for birth cert)
      {
        name: "Kirkos Kebele 05",
        type: "Kebele",
        jurisdiction: "Addis Ababa",
        location: { type: "Point", coordinates: [38.7635, 9.01] },
        address: { 
          region: "Addis Ababa", 
          subcity: "Kirkos", 
          woreda: "08", 
          kebeleNumber: "05", 
          landmark: "Near St. Urael Church", 
          directions: { en: "Behind the police station", am: "ከፖሊስ ጣቢያ በኋላ" } 
        },
        contact: { phone: "011 234 5678", email: "kirkos05@addis.gov.et" },
        operatingHours: standardHours,
        holidaySchedule: { isClosedToday: false },
        offerings: [
          { 
            serviceId: birthCert, 
            isAvailable: true, 
            additionalRequirements: [
              { 
                item: { en: "Two Passport Photos", am: "ሁለት ፓስፖርት ፎቶግራፎች" }, 
                description: { en: "4x6cm size, blue background mandatory", am: "4x6 ሴ.ሜ መጠን፣ ሰማያዊ ባክግራውንድ ከማይረጥብ" }
              }
            ], 
            operationalNotes: { en: "Blue background photos required. Arrive before 11 AM for same-day processing.", am: "ሰማያዊ ባክግራውንድ ፎቶዎች ያስፈልጋሉ። በአንድ ቀን እንዲሰራ ከጠዋቱ 11 ሰዓት በፊት ይምጡ።" }, 
            fees: { amount: 50, currency: "ETB", note: "Exact change" }, 
            updatedAt: new Date() 
          },
          { 
            serviceId: nationalId, 
            isAvailable: true, 
            fees: { amount: 100, currency: "ETB" }, 
            updatedAt: new Date() 
          }
        ],
        isActive: true,
        lastVerifiedAt: new Date("2024-01-20"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Kebele Office 2: Bole Kebele 06 (White photos for birth cert - demonstrates variation)
      {
        name: "Bole Kebele 06",
        type: "Kebele",
        jurisdiction: "Addis Ababa",
        location: { type: "Point", coordinates: [38.7896, 8.9806] },
        address: { 
          region: "Addis Ababa", 
          subcity: "Bole", 
          woreda: "03", 
          kebeleNumber: "06", 
          landmark: "Behind Bole Medhanialem Church"
        },
        contact: { phone: "011 662 1234", email: "bole06@addis.gov.et" },
        operatingHours: standardHours,
        holidaySchedule: { isClosedToday: false },
        offerings: [
          { 
            serviceId: birthCert, 
            isAvailable: true, 
            additionalRequirements: [
              { 
                item: { en: "Two Passport Photos", am: "ሁለት ፓስፖርት ፎቶግራፎች" }, 
                description: { en: "4x6cm size, white background mandatory", am: "4x6 ሴ.ሜ መጠን፣ ነጭ ባክግራውንድ ከማይረጥብ" }
              }
            ], 
            operationalNotes: { en: "White background photos required", am: "ነጭ ባክግራውንድ ፎቶዎች ያስፈልጋሉ" }, 
            fees: { amount: 50, currency: "ETB" }, 
            updatedAt: new Date() 
          },
          { 
            serviceId: nationalId, 
            isAvailable: true, 
            fees: { amount: 100, currency: "ETB" }, 
            updatedAt: new Date() 
          }
        ],
        isActive: true,
        lastVerifiedAt: new Date("2024-01-22"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Kebele Office 3: Arada Kebele 08 (Different services)
      {
        name: "Arada Kebele 08",
        type: "Kebele",
        jurisdiction: "Addis Ababa",
        location: { type: "Point", coordinates: [38.7578, 9.0189] },
        address: { 
          region: "Addis Ababa", 
          subcity: "Arada", 
          woreda: "02", 
          kebeleNumber: "08", 
          landmark: "Near Piassa Market"
        },
        contact: { phone: "011 155 7890", email: "arada08@addis.gov.et" },
        operatingHours: standardHours,
        holidaySchedule: { isClosedToday: false },
        offerings: [
          { 
            serviceId: residenceCert, 
            isAvailable: true, 
            operationalNotes: { en: "Rent agreement must be recent", am: "የቤት ኪራይ ውል የቅርብ ጊዜ መሆን አለበት" }, 
            fees: { amount: 40, currency: "ETB" }, 
            updatedAt: new Date() 
          },
          { 
            serviceId: businessLicense, 
            isAvailable: true, 
            fees: { amount: 200, currency: "ETB" }, 
            updatedAt: new Date() 
          }
        ],
        isActive: true,
        lastVerifiedAt: new Date("2024-01-25"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Federal Office: Immigration (Passport only)
      {
        name: "Federal Immigration and Citizenship Affairs",
        type: "Federal",
        jurisdiction: "Federal",
        location: { type: "Point", coordinates: [38.7896, 8.9950] },
        address: { 
          region: "Addis Ababa", 
          subcity: "Bole", 
          landmark: "Near Bole International Airport"
        },
        contact: { phone: "011 155 1234", email: "info@immigration.gov.et" },
        operatingHours: federalHours,
        holidaySchedule: { isClosedToday: false },
        offerings: [
          { 
            serviceId: passport, 
            isAvailable: true, 
            additionalRequirements: [
              { 
                item: { en: "Six Passport Photos", am: "ስድስት ፓስፖርት ፎቶግራፎች" }, 
                description: { en: "Recent photos, white background", am: "የቅርብ ጊዜ ፎቶዎች፣ ነጭ ባክግራውንድ" }
              }
            ], 
            operationalNotes: { en: "Appointments mandatory. Call ahead.", am: "ቀጠሮ ማድረግ ግዴታ ነው። በቅድሚያ ይደውሉ።" }, 
            fees: { amount: 600, currency: "ETB", note: "Express service: 1200 ETB" }, 
            updatedAt: new Date() 
          }
        ],
        isActive: true,
        lastVerifiedAt: new Date("2024-01-25"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Municipal Office: Premium birth certificate service
      {
        name: "Addis Ababa Vital Records Department",
        type: "Municipal",
        jurisdiction: "Addis Ababa",
        location: { type: "Point", coordinates: [38.7578, 9.0300] },
        address: { 
          region: "Addis Ababa", 
          subcity: "Arada", 
          landmark: "City Hall Annex Building"
        },
        contact: { phone: "011 155 5678", email: "vital@addis.gov.et" },
        operatingHours: federalHours,
        holidaySchedule: { isClosedToday: false },
        offerings: [
          { 
            serviceId: birthCert, 
            isAvailable: true, 
            additionalRequirements: [
              { 
                item: { en: "Two Passport Photos", am: "ሁለት ፓስፖርት ፎቶግራፎች" }, 
                description: { en: "4x6cm size, blue background", am: "4x6 ሴ.ሜ መጠን፣ ሰማያዊ ባክግራውንድ" }
              }
            ], 
            operationalNotes: { en: "Premium expedited service available", am: "ፈጣን አገልግሎት ይገኛል" }, 
            fees: { amount: 200, currency: "ETB", note: "Premium service - faster processing" }, 
            updatedAt: new Date() 
          }
        ],
        isActive: true,
        lastVerifiedAt: new Date("2024-01-26"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdOffices = await Office.insertMany(offices);
    console.log(`Created ${createdOffices.length} offices`);

    // Create indexes
    await Office.collection.createIndex({ location: "2dsphere" });
    await Office.collection.createIndex({ "offerings.serviceId": 1 });

    console.log('✅ Seed completed successfully!');
    console.log(`- Services: ${await Service.countDocuments()}`);
    console.log(`- Offices: ${await Office.countDocuments()}`);
    console.log('\n📋 Seeded Services:');
    console.log('  • Birth Certificate (Kebele, Municipal)');
    console.log('  • National ID Card (Kebele)');
    console.log('  • Ordinary Passport (Federal)');
    console.log('  • Residence Certificate (Kebele)');
    console.log('  • Business License (Kebele, Municipal)');
    console.log('\n🏢 Seeded Offices:');
    console.log('  • Kirkos Kebele 05 (Blue photos for birth cert)');
    console.log('  • Bole Kebele 06 (White photos for birth cert)');
    console.log('  • Arada Kebele 08 (Residence & Business)');
    console.log('  • Federal Immigration (Passport only)');
    console.log('  • Municipal Vital Records (Premium birth cert)');
    console.log('\n🎯 Key Demonstrations:');
    console.log('  • Same service, different requirements by location');
    console.log('  • Federal-only services (Passport)');
    console.log('  • Premium vs standard service levels');
    console.log('  • Proximity-based search results');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();