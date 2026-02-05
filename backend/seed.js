const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Service = require('./models/Service');
const Office = require('./models/Office');
const Document = require('./models/Document');
const Form = require('./models/Form');
const Region = require('./models/Region');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qedami');

    // Clear existing data
    await Category.deleteMany();
    await Service.deleteMany();
    await Office.deleteMany();
    await Document.deleteMany();
    await Form.deleteMany();
    await Region.deleteMany();

    console.log('Data cleared...');

    // 1. Create Category
    const category = await Category.create({ name: 'Legal', description: 'Legal and civil services' });

    // 2. Create Documents
    const doc1 = await Document.create({ name: 'Birth Certificate', isOriginalRequired: true });
    const doc2 = await Document.create({ name: 'ID Card', isOriginalRequired: false });

    // 3. Create Region
    const region = await Region.create({ name: 'Addis Ababa' });

    // 4. Create Office
    const office = await Office.create({
      name: 'Central Passport Office',
      location: { type: 'Point', coordinates: [38.74, 9.03] },
      address: 'Arat Kilo, Addis Ababa',
      hours: { monday: { open: '8:30', close: '17:30' } }
    });

    region.offices.push(office._id);
    await region.save();

    // 5. Create Service
    const service = await Service.create({
      name: 'Passport Renewal',
      description: 'Renew your Ethiopian passport',
      category: category._id,
      requirements: [doc1._id, doc2._id],
      offices: [office._id]
    });

    // 6. Create Form
    const form = await Form.create({
      title: 'Passport Application Form',
      downloadUrl: 'https://qedami.com/forms/passport.pdf',
      service: service._id
    });

    service.forms.push(form._id);
    await service.save();

    console.log('Sample data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
