const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../model/userModel');
const House = require('../model/houseModel');

mongoose.connect(
    'mongodb+srv://ahmedoothman:dataconnect@myprojects.iryt0op.mongodb.net/DwellingDeals?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// Generate random houses for existing users
async function generateRandomData() {
    try {
        // Fetch all realtors from the users collection
        const realtors = await User.find({ role: 'realtor' });
        if (realtors.length === 0) {
            console.log(
                'No realtors found. Please ensure there are users with the role "realtor" in the database.'
            );
            return;
        }

        // Create random houses
        const houseTypes = ['rent', 'sale'];
        const houses = [];

        for (let i = 0; i < 100; i++) {
            // At least two bedrooms
            const bedrooms = Math.floor(Math.random() * 4) + 2;
            const type =
                houseTypes[Math.floor(Math.random() * houseTypes.length)];
            const house = new House({
                title: faker.lorem.words(),
                description: faker.lorem.paragraph(),
                price:
                    type === 'rent'
                        ? faker.commerce.price({
                              min: 1000,
                              max: 5000,
                          })
                        : faker.commerce.price({
                              min: 600000,
                              max: 1500000,
                          }),
                type: type,
                realtor:
                    realtors[Math.floor(Math.random() * realtors.length)]._id,
                imageUrl: faker.image.urlLoremFlickr({
                    width: 600,
                    height: 500,
                    category: 'realtor',
                }),
                images: [
                    faker.image.urlLoremFlickr({
                        width: 600,
                        height: 500,
                        category: 'realestatelisting',
                    }),
                    faker.image.urlLoremFlickr({
                        width: 600,
                        height: 500,
                        category: 'realestatelisting',
                    }),
                    faker.image.urlLoremFlickr({
                        width: 600,
                        height: 500,
                        category: 'realestatelisting',
                    }),
                ],
                rate: Math.floor(Math.random() * 6),
                bedrooms: bedrooms,
                bathrooms: Math.floor(Math.random() * bedrooms) + 1,
                area: Math.floor(Math.random() * 500) + 90,
                address: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    governorate: faker.location.state(),
                },
                approved: true,
            });
            houses.push(house);
            await house.save();
        }

        console.log('Random houses generated successfully');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

generateRandomData().catch((err) => {
    console.error(err);
    mongoose.disconnect();
});
