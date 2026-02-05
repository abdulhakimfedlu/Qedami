// MongoDB Shell Seed Script
// Usage: mongosh "YOUR_MONGODB_URI" seed.js

const dbName = 'qedami'; 
const db = db.getSiblingDB(dbName);

print("Cleaning existing data...");
db.services.deleteMany({});
db.offices.deleteMany({});

print("Seeding services...");
const services = [
  {
    identifiers: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" },
    category: "vital",
    description: { en: "Official document certifying the birth of a child", am: "የልጅ ልደትን የሚያረጋግጥ ይፋዊ ሰነድ" },
    authorityLevel: ["kebele", "municipal"],
    baseRequirements: {
      required: [
        { item: { en: "Hospital Notification Letter", am: "የሆስፒታል የወሊድ ማሳወቂያ ደብዳቤ" }, description: { en: "Original stamped document from hospital", am: "የማህተም ያለው ዋናው ደብዳቤ ከሆስፒታል" }, verificationStandard: { en: "Must have hospital seal and signature", am: "የሆስፒታል ማህተም እና ፊርማ ሊኖረው ይገባል" } },
        { item: { en: "Parents' ID Cards", am: "የወላጆች መታወቂያ ካርድ" }, description: { en: "Both parents' valid kebele ID cards", am: "የሁለቱም ወላጆች የሚሰራ ቀበሌ መታወቂያ" }, verificationStandard: { en: "Original documents required", am: "ዋናው ሰነድ ያስፈልጋል" } },
      ],
      optional: [
        { item: { en: "Marriage Certificate", am: "የጋብቻ ሰርቲፊኬት" }, description: { en: "If parents are legally married", am: "ወላጆች በሕግ ከተጋቡ" }, condition: { en: "Only if parents are legally married", am: "ወላጆች በሕግ ከተጋቡ ብቻ" } },
      ],
    },
    estimatedProcessingTime: "1-3 days",
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
        { item: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" }, description: { en: "Original birth certificate", am: "ዋናው የወሊድ ሰርቲፊኬት" }, verificationStandard: { en: "Must be certified", am: "የተረጋገጠ መሆን አለበት" } },
        { item: { en: "Passport Photos", am: "ፓስፖርት ፎቶዎች" }, description: { en: "Recent passport-size photos", am: "የቅርብ ጊዜ ፓስፖርት መጠን ፎቶዎች" }, verificationStandard: { en: "3x4cm, white background", am: "3x4 ሴ.ሜ፣ ነጭ ባክግራውንድ" } },
        { item: { en: "Proof of Residence", am: "የመኖሪያ ማረጋገጫ" }, description: { en: "Utility bill or house ownership document", am: "የመብራት/ውሃ ደረሰኝ ወይም የቤት ባለቤትነት ሰነድ" }, verificationStandard: { en: "Recent document within 3 months", am: "ባለፉት 3 ወራት ውስጥ" } },
      ],
      optional: [],
    },
    estimatedProcessingTime: "Same day",
    keywords: ["id", "identity", "identification", "card", "kebele", "residence"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    identifiers: { en: "ID Renewal", am: "የመታወቂያ እድሳት" },
    category: "identity",
    description: { en: "Renewal of expired or damaged ID card", am: "የተበላሸ ወይም ያበቃ መታወቂያ ማደስ" },
    authorityLevel: ["kebele"],
    baseRequirements: {
      required: [
        { item: { en: "Old ID Card", am: "አሮጌ መታወቂያ ካርድ" }, description: { en: "Current ID card (even if expired/damaged)", am: "አሁን ያለው መታወቂያ (ቢበላሽም/ቢያበቃም)" }, verificationStandard: { en: "Original required", am: "ዋናው ያስፈልጋል" } },
        { item: { en: "Passport Photos", am: "ፓስፖርት ፎቶዎች" }, description: { en: "2 recent passport photos", am: "2 የቅርብ ጊዜ ፓስፖርት ፎቶዎች" }, verificationStandard: { en: "3x4cm size", am: "3x4 ሴ.ሜ መጠን" } },
      ],
      optional: [
        { item: { en: "Police Report", am: "የፖሊስ ሪፖርት" }, description: { en: "If ID was lost or stolen", am: "መታወቂያ ከጠፋ ወይም ከተሰረቀ" }, condition: { en: "Required only if ID was lost", am: "መታወቂያ ከጠፋ ብቻ" } },
      ],
    },
    estimatedProcessingTime: "1-2 hours",
    keywords: ["renewal", "renew", "id", "expired", "damaged", "replace"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    identifiers: { en: "Ordinary Passport", am: "ሕጋዊ ፓስፖርት" },
    category: "identity",
    description: { en: "Ethiopian travel passport for citizens", am: "ለኢትዮጵያ ዜጎች የጉዞ ፓስፖርት" },
    authorityLevel: ["federal"],
    baseRequirements: {
      required: [
        { item: { en: "National ID Card", am: "የመታወቂያ ካርድ" }, description: { en: "Valid kebele ID", am: "የሚሰራ ቀበሌ መታወቂያ" }, verificationStandard: { en: "Original and copy", am: "ዋናው እና ቅጂ" } },
        { item: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" }, description: { en: "Original birth certificate", am: "ዋናው የወሊድ ሰርቲፊኬት" }, verificationStandard: { en: "Certified copy required", am: "የተረጋገጠ ቅጂ ያስፈልጋል" } },
        { item: { en: "Passport Photos", am: "ፓስፖርት ፎቶዎች" }, description: { en: "4 recent passport photos", am: "4 የቅርብ ጊዜ ፓስፖርት ፎቶዎች" }, verificationStandard: { en: "White background, 4x6cm", am: "ነጭ ባክግራውንድ፣ 4x6 ሴ.ሜ" } },
        { item: { en: "Application Form", am: "የማመልከቻ ቅጽ" }, description: { en: "Completed passport application form", am: "የተሞላ የፓስፖርት ማመልከቻ ቅጽ" }, verificationStandard: { en: "Available at office", am: "በቢሮ ይገኛል" } },
      ],
      optional: [],
    },
    estimatedProcessingTime: "2-4 weeks",
    keywords: ["passport", "travel", "international", "document", "federal"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    identifiers: { en: "Death Certificate", am: "የሞት ሰርቲፊኬት" },
    category: "vital",
    description: { en: "Official document certifying the death of a person", am: "የሰው ሞትን የሚያረጋግጥ ይፋዊ ሰነድ" },
    authorityLevel: ["kebele", "municipal"],
    baseRequirements: {
      required: [
        { item: { en: "Medical Death Certificate", am: "የሕክምና የሞት ማረጋገጫ" }, description: { en: "From hospital or health center", am: "ከሆስፒታል ወይም ከጤና ጣቢያ" }, verificationStandard: { en: "Signed by doctor", am: "በሐኪም የተፈረመ" } },
        { item: { en: "Deceased's ID", am: "የሟች መታወቂያ" }, description: { en: "Original ID of the deceased", am: "የሟች ዋናው መታወቂያ" }, verificationStandard: { en: "Original required", am: "ዋናው ያስፈልጋል" } },
        { item: { en: "Applicant's ID", am: "የአመልካች መታወቂያ" }, description: { en: "ID of family member applying", am: "የሚያመለክት የቤተሰብ አባል መታወቂያ" }, verificationStandard: { en: "Must be relative", am: "ዘመድ መሆን አለበት" } },
      ],
      optional: [],
    },
    estimatedProcessingTime: "1-2 days",
    keywords: ["death", "deceased", "certificate", "vital", "mortality"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

db.services.insertMany(services);
const createdServices = db.services.find().toArray();

const birthCert = createdServices.find(s => s.identifiers.en === "Birth Certificate")._id;
const nationalId = createdServices.find(s => s.identifiers.en === "National ID Card")._id;
const idRenewal = createdServices.find(s => s.identifiers.en === "ID Renewal")._id;
const passport = createdServices.find(s => s.identifiers.en === "Ordinary Passport")._id;
const deathCert = createdServices.find(s => s.identifiers.en === "Death Certificate")._id;

const standardHours = {
  monday: { open: "08:30", close: "17:30", isOpen: true },
  tuesday: { open: "08:30", close: "17:30", isOpen: true },
  wednesday: { open: "08:30", close: "17:30", isOpen: true },
  thursday: { open: "08:30", close: "17:30", isOpen: true },
  friday: { open: "08:30", close: "11:30", isOpen: true, note: "Half day" },
  saturday: { isOpen: false },
  sunday: { isOpen: false },
};

print("Seeding offices...");
const offices = [
  {
    name: "Kirkos Kebele 05",
    type: "Kebele",
    jurisdiction: "Addis Ababa",
    location: { type: "Point", coordinates: [38.7635, 9.01] },
    address: { region: "Addis Ababa", subcity: "Kirkos", woreda: "08", kebeleNumber: "05", landmark: "Near St. Urael Church", directions: { en: "Behind the police station", am: "ከፖሊስ ጣቢያ በኋላ" } },
    contact: { phone: "011 234 5678", email: "kirkos05@addis.gov.et" },
    operatingHours: standardHours,
    offerings: [
      { serviceId: birthCert, isAvailable: true, additionalRequirements: [{ item: { en: "Two Passport Photos", am: "ሁለት ፓስፖርት ፎቶግራፎች" }, description: { en: "4x6cm, blue background", am: "4x6 ሴ.ሜ፣ ሰማያዊ ባክግራውንድ" }, warning: { en: "White background rejected", am: "ነጭ ባክግራውንድ ይውደማል" } }], operationalNotes: { en: "Blue background photos required", am: "ሰማያዊ ባክግራውንድ ፎቶ ያስፈልጋል" }, fees: { amount: 50, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: nationalId, isAvailable: true, fees: { amount: 100, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: idRenewal, isAvailable: false, temporaryNote: "System upgrade in progress", updatedAt: new Date() },
      { serviceId: deathCert, isAvailable: true, fees: { amount: 50, currency: "ETB" }, updatedAt: new Date() },
    ],
    isActive: true,
    lastVerifiedAt: new Date("2024-01-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bole Kebele 03",
    type: "Kebele",
    jurisdiction: "Addis Ababa",
    location: { type: "Point", coordinates: [38.7896, 8.9806] },
    address: { region: "Addis Ababa", subcity: "Bole", woreda: "03", kebeleNumber: "03", landmark: "Behind Bole Medhanialem Church", directions: { en: "Behind Edna Mall, 200m left", am: "ከኤድና ሞል በኋላ 200 ሜትር በግራ" } },
    contact: { phone: "011 662 1234", email: "bole03@addis.gov.et" },
    operatingHours: standardHours,
    offerings: [
      { serviceId: birthCert, isAvailable: true, additionalRequirements: [{ item: { en: "Two Passport Photos", am: "ሁለት ፓስፖርት ፎቶግራፎች" }, description: { en: "4x6cm, white background", am: "4x6 ሴ.ሜ፣ ነጭ ባክግራውንድ" }, warning: { en: "Blue background rejected here", am: "ሰማያዊ ባክግራውንድ እዚህ ይውደማል" } }], operationalNotes: { en: "White background photos required", am: "ነጭ ባክግራውንድ ፎቶ ያስፈልጋል" }, fees: { amount: 50, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: nationalId, isAvailable: true, fees: { amount: 100, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: idRenewal, isAvailable: true, fees: { amount: 75, currency: "ETB" }, updatedAt: new Date() },
    ],
    isActive: true,
    lastVerifiedAt: new Date("2024-01-22"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Yeka Kebele 12",
    type: "Kebele",
    jurisdiction: "Addis Ababa",
    location: { type: "Point", coordinates: [38.8012, 9.0345] },
    address: { region: "Addis Ababa", subcity: "Yeka", woreda: "12", kebeleNumber: "12", landmark: "Near CMC roundabout", directions: { en: "500m from CMC towards Ayat", am: "ከCMC 500 ሜትር ወደ አያት" } },
    contact: { phone: "011 646 7890" },
    operatingHours: standardHours,
    offerings: [
      { serviceId: birthCert, isAvailable: true, fees: { amount: 50, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: nationalId, isAvailable: true, fees: { amount: 100, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: idRenewal, isAvailable: true, fees: { amount: 75, currency: "ETB" }, updatedAt: new Date() },
      { serviceId: deathCert, isAvailable: true, fees: { amount: 50, currency: "ETB" }, updatedAt: new Date() },
    ],
    isActive: true,
    lastVerifiedAt: new Date("2024-01-18"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Federal Immigration and Nationality Main Office",
    type: "Federal",
    jurisdiction: "Federal",
    location: { type: "Point", coordinates: [38.7578, 9.0189] },
    address: { region: "Addis Ababa", subcity: "Arada", landmark: "Near National Theatre", directions: { en: "Opposite National Theatre", am: "ከብሔራዊ ትያትር ፊት ለፊት" } },
    contact: { phone: "011 155 1234", email: "info@immigration.gov.et", website: "https://www.immigration.gov.et" },
    operatingHours: {
      monday: { open: "08:00", close: "17:00", isOpen: true },
      tuesday: { open: "08:00", close: "17:00", isOpen: true },
      wednesday: { open: "08:00", close: "17:00", isOpen: true },
      thursday: { open: "08:00", close: "17:00", isOpen: true },
      friday: { open: "08:00", close: "17:00", isOpen: true },
      saturday: { isOpen: false },
      sunday: { isOpen: false },
    },
    offerings: [{ serviceId: passport, isAvailable: true, operationalNotes: { en: "Appointments recommended", am: "ቀጠሮ ይመከራል" }, fees: { amount: 3000, currency: "ETB", note: "Express: 6000 ETB" }, bestTimeToVisit: "Tuesday/Wednesday AM", updatedAt: new Date() }],
    isActive: true,
    lastVerifiedAt: new Date("2024-01-25"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Addis Ababa Vital Events Registration Office",
    type: "Municipal",
    jurisdiction: "Addis Ababa",
    location: { type: "Point", coordinates: [38.7489, 9.0054] },
    address: { region: "Addis Ababa", subcity: "Lideta", landmark: "Mexico Square area", directions: { en: "Near Mexico Square, behind stadium", am: "ከሜክሲኮ አደባባይ አቅራቢያ" } },
    contact: { phone: "011 551 2233", email: "vital.events@addis.gov.et" },
    operatingHours: standardHours,
    offerings: [
      { serviceId: birthCert, isAvailable: true, operationalNotes: { en: "Expedited processing available", am: "ፈጣን አገልግሎት ይገኛል" }, fees: { amount: 150, currency: "ETB", note: "Expedited municipal" }, updatedAt: new Date() },
      { serviceId: deathCert, isAvailable: true, operationalNotes: { en: "Central registry for all Addis", am: "ለአዲስ አበባ ሁሉ ማዕከላዊ መዝገብ" }, fees: { amount: 100, currency: "ETB" }, updatedAt: new Date() },
    ],
    isActive: true,
    lastVerifiedAt: new Date("2024-01-23"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

db.offices.insertMany(offices);

db.offices.createIndex({ location: "2dsphere" });
db.offices.createIndex({ "offerings.serviceId": 1 });

print("✅ Seed completed successfully!");
print("- Services: " + db.services.countDocuments());
print("- Offices: " + db.offices.countDocuments());
