const mongoose = require('mongoose');
// import { faker } from '@faker-js/faker';

const { faker } = require('@faker-js/faker');
const User = require('../model/userModel');
const House = require('../model/houseModel');

const dotenv = require('dotenv');
dotenv.config({ path: '.././config.env' }); // configuration of the environment file
const password = process.env.DATABASE_PASSWORD;
const dbURI = process.env.DATABASE.replace('<PASSWORD>', password);

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Generate random data
async function generateRandomData() {
    // Create random users
    const userRoles = ['user', 'realtor'];
    const users = [];
    const tempPassword = faker.internet.password();
    for (let i = 0; i < 10; i++) {
        const user = new User({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: tempPassword,
            passwordConfirm: tempPassword,
            savedPassword: tempPassword,
            phoneNumber: faker.phone.number(),
            role: userRoles[Math.floor(Math.random() * userRoles.length)],
            verified: true,
        });
        users.push(user);
        await user.save();
    }

    // Create random houses
    const houseTypes = ['rent', 'sale'];
    const houses = [];
    //read all realtors from the users array
    for (let i = 0; i < 100; i++) {
        const realtors = users.filter((user) => user.role === 'realtor');
        // at least two bedrooms
        const bedrooms = Math.floor(Math.random() * 4) + 2;
        const type = houseTypes[Math.floor(Math.random() * houseTypes.length)];
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
            realtor: realtors[Math.floor(Math.random() * realtors.length)]._id,
            imageUrl: faker.image.urlLoremFlickr({
                width: 600,
                height: 500,
                category: 'realtor',
            }),
            images: [
                faker.image.urlLoremFlickr({
                    width: 600,
                    height: 500,
                    category: 'realtor',
                }),
                faker.image.urlLoremFlickr({
                    width: 600,
                    height: 500,
                    category: 'realtor',
                }),
                faker.image.urlLoremFlickr({
                    width: 600,
                    height: 500,
                    category: 'realtor',
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

    console.log('Random data generated successfully');
    mongoose.disconnect();
}

// generateRandomData().catch((err) => {
//     console.error(err);
//     mongoose.disconnect();
// });
