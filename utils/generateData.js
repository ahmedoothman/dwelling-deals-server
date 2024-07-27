const mongoose = require('mongoose');
// import { faker } from '@faker-js/faker';
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

// Generate random data
async function generateRandomData() {
    // Create random users
    const userRoles = ['user', 'realtor'];
    const users = [];
    const tempPassword = faker.internet.password();
    for (let i = 0; i < 10; i++) {
        const user = new User({
            name: faker.internet.userName(),
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
        const house = new House({
            title: faker.lorem.words(),
            description: faker.lorem.paragraph(),
            price: faker.commerce.price(),
            type: houseTypes[Math.floor(Math.random() * houseTypes.length)],
            realtor: realtors[Math.floor(Math.random() * realtors.length)]._id,
            imageUrl: faker.image.imageUrl(600, 500, 'realtor'),
            images: [
                faker.image.imageUrl(600, 500, 'realtor'),
                faker.image.imageUrl(600, 500, 'realtor'),
                faker.image.imageUrl(600, 500, 'realtor'),
            ],
            rate: Math.floor(Math.random() * 6),
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

generateRandomData().catch((err) => {
    console.error(err);
    mongoose.disconnect();
});
