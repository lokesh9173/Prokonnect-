import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/User.js';
import Offer from './models/Offer.js';

dotenv.config();

const users = [
    {
        name: 'Grand Hotel City Center',
        email: 'info@grandhotel.com',
        password: 'password123',
        role: 'business',
    },
    {
        name: 'The Brew Bean Cafe',
        email: 'hello@brewbean.com',
        password: 'password123',
        role: 'business',
    },
    {
        name: 'Urban Streetwear',
        email: 'contact@urbanstreet.com',
        password: 'password123',
        role: 'business',
    },
    {
        name: 'FitLife Gym & Spa',
        email: 'admin@fitlife.com',
        password: 'password123',
        role: 'business',
    },
    {
        name: 'Sarah Jenkins',
        email: 'sarah@influencer.com',
        password: 'password123',
        role: 'influencer',
        niche: 'Travel',
        followers: '125K',
        platform: 'Instagram',
        verified: true
    },
    {
        name: 'Mike TechVlog',
        email: 'mike@techvlog.com',
        password: 'password123',
        role: 'influencer',
        niche: 'Tech',
        followers: '450K',
        platform: 'YouTube',
        verified: true
    },
    {
        name: 'Foodie Tom',
        email: 'tom@foodie.com',
        password: 'password123',
        role: 'influencer',
        niche: 'Food',
        followers: '85K',
        platform: 'Instagram',
        verified: false
    },
    {
        name: 'Travel Bug Anna',
        email: 'anna@travelbug.com',
        password: 'password123',
        role: 'influencer',
        niche: 'Travel',
        followers: '210K',
        platform: 'Instagram',
        verified: true
    },
    {
        name: 'Gym Rat Alex',
        email: 'alex@gym.com',
        password: 'password123',
        role: 'influencer',
        niche: 'Fitness',
        followers: '120K',
        platform: 'Instagram',
        verified: true
    },
    {
        name: 'Fashion Nova',
        email: 'fashion@nova.com',
        password: 'password123',
        role: 'influencer',
        niche: 'Fashion',
        followers: '25K',
        platform: 'TikTok',
        verified: true
    }
];

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();
        
        await Offer.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.create(users);

        const businessUsers = createdUsers.filter(u => u.role === 'business');
        
        // Sample offers
        const offers = [
            {
                title: 'Summer Staycation Deal',
                description: 'We are looking for travel influencers to review our new summer suites. Includes 2 nights stay + breakfast.',
                businessId: businessUsers[0]._id, // Grand Hotel
                category: 'hotel',
                type: 'barter',
                targetAudience: 'influencers',
                price: 0,
                status: 'active'
            },
            {
                title: 'New Cold Brew Launch',
                description: 'Come taste our new nitro cold brew and post a story! Free drink + 20% off voucher for followers.',
                businessId: businessUsers[1]._id, // Brew Bean
                category: 'cafe',
                type: 'barter',
                targetAudience: 'students',
                price: 0,
                status: 'active'
            },
            {
                title: 'Winter Collection Shoot',
                description: 'Looking for 2 male and 2 female models/influencers for our winter lookbook.',
                businessId: businessUsers[2]._id, // Urban Streetwear
                category: 'brand',
                type: 'paid',
                targetAudience: 'everyone',
                price: 500,
                status: 'active'
            },
            {
                title: 'Gym Membership Giveaway',
                description: 'Partner with us to give away 3 month memberships to your followers.',
                businessId: businessUsers[3]._id, // FitLife
                category: 'other',
                type: 'barter',
                targetAudience: 'influencers',
                price: 150,
                status: 'active'
            }
        ];

        await Offer.create(offers);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await Offer.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
