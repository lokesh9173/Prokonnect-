import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedLokesh = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        // Check if user exists
        const userExists = await User.findOne({ email: 'lokeshsharma2567@gmail.com' });
        if (userExists) {
            console.log('User already exists, updating fields...');
            userExists.password = 'password123';
            userExists.phone = '+91 9173737940';
            userExists.instagram = 'https://www.instagram.com/lokesh.shaxrma?igsh=bmpocWoxcGFkOG1j';
            userExists.website = 'https://www.instagram.com/lokesh.shaxrma?igsh=bmpocWoxcGFkOG1j';
            await userExists.save();
            console.log('User updated successfully.');
        } else {
            const user = await User.create({
                name: 'Lokesh Sharma',
                email: 'lokeshsharma2567@gmail.com',
                password: 'password123',
                role: 'influencer',
                phone: '+91 9173737940',
                instagram: 'https://www.instagram.com/lokesh.shaxrma?igsh=bmpocWoxcGFkOG1j',
                website: 'https://www.instagram.com/lokesh.shaxrma?igsh=bmpocWoxcGFkOG1j',
            });
            console.log('Created user Lokesh Sharma successfully!');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedLokesh();
