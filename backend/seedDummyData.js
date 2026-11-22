import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Offer from './models/Offer.js';

dotenv.config();

const influencers = [
    { name: 'Alex Rivera', email: 'alex.fashion@example.com', password: 'password123', role: 'influencer', niche: 'Fashion', followers: '1.2M', platform: 'Instagram', title: 'High-Fashion Model & Stylist', location: 'New York, USA', verified: true, skills: ['Styling', 'Photography', 'Brand Ambassadorship'], bio: 'Creating high-end fashion content for modern luxury brands.' },
    { name: 'Sarah Chen', email: 'sarah.foodie@example.com', password: 'password123', role: 'influencer', niche: 'Food', followers: '850K', platform: 'TikTok', title: 'Culinary Explorer & Reviewer', location: 'Los Angeles, USA', verified: true, skills: ['Recipe Creation', 'Food Vlogging', 'Restaurant Reviews'], bio: 'Exploring the best culinary experiences around the world.' },
    { name: 'David Tech', email: 'david.tech@example.com', password: 'password123', role: 'influencer', niche: 'Tech', followers: '2.5M', platform: 'YouTube', title: 'Tech Reviewer & Gadget Expert', location: 'San Francisco, USA', verified: true, skills: ['Video Production', 'Tech Reviews', 'Unboxing'], bio: 'In-depth reviews of the latest gadgets and consumer technology.' },
    { name: 'Emma Fitness', email: 'emma.fit@example.com', password: 'password123', role: 'influencer', niche: 'Fitness', followers: '3.1M', platform: 'Instagram', title: 'Certified Personal Trainer & Athlete', location: 'Miami, USA', verified: true, skills: ['Workout Plans', 'Nutrition', 'Activewear Modeling'], bio: 'Empowering millions to live a healthier, active lifestyle.' },
    // Adding more influencers to match the new businesses
    { name: 'GamerX', email: 'gamerx@example.com', password: 'password123', role: 'influencer', niche: 'Gaming', followers: '4.5M', platform: 'Twitch', title: 'Pro Esports Player & Streamer', location: 'Austin, USA', verified: true, skills: ['Live Streaming', 'Game Reviews', 'Esports'], bio: 'Top-tier competitive gameplay and entertaining variety streams.' },
    { name: 'Wanderlust Mia', email: 'mia.travels@example.com', password: 'password123', role: 'influencer', niche: 'Travel', followers: '950K', platform: 'Instagram', title: 'Luxury Travel Blogger', location: 'Bali, Indonesia', verified: true, skills: ['Drone Photography', 'Travel Guides', 'Hotel Reviews'], bio: 'Discovering hidden gems and luxury escapes around the globe.' }
];

const businesses = [
    { name: 'Vogue Apparel', email: 'contact@vogueapparel.com', password: 'password123', role: 'business', niche: 'Fashion', location: 'Paris, France', title: 'Luxury Streetwear Brand', website: 'www.vogueapparel.com', verified: true, bio: 'Redefining modern streetwear with sustainable luxury materials.' },
    { name: 'BiteBox Delivered', email: 'partners@bitebox.com', password: 'password123', role: 'business', niche: 'Food', location: 'Chicago, USA', title: 'Premium Meal Kit Delivery', website: 'www.bitebox.com', verified: true, bio: 'Delivering chef-crafted meal kits right to your doorstep.' },
    { name: 'Nova Electronics', email: 'marketing@nova-tech.com', password: 'password123', role: 'business', niche: 'Tech', location: 'Tokyo, Japan', title: 'Innovative Smart Devices', website: 'www.nova-tech.com', verified: true, bio: 'Pioneering the next generation of smart home and wearable tech.' },
    // Brand new businesses
    { name: 'Apex Gaming Gear', email: 'sponsorships@apexgaming.com', password: 'password123', role: 'business', niche: 'Gaming', location: 'Seattle, USA', title: 'High-Performance Peripherals', website: 'www.apexgaminggear.com', verified: true, bio: 'Engineered for esports professionals and hardcore gamers.' },
    { name: 'Aura Cosmetics', email: 'collabs@aurabeauty.com', password: 'password123', role: 'business', niche: 'Beauty', location: 'Seoul, South Korea', title: 'K-Beauty Skincare & Makeup', website: 'www.auracosmetics.kr', verified: true, bio: 'Cruelty-free, vegan skincare combining nature and science.' },
    { name: 'Wander Stays', email: 'marketing@wanderstays.com', password: 'password123', role: 'business', niche: 'Travel', location: 'London, UK', title: 'Boutique Hotel Network', website: 'www.wanderstays.com', verified: true, bio: 'Curated boutique hotels for the modern aesthetic traveler.' },
    { name: 'FitCore Nutrition', email: 'athletes@fitcore.com', password: 'password123', role: 'business', niche: 'Fitness', location: 'Denver, USA', title: 'Premium Sports Supplements', website: 'www.fitcore.com', verified: true, bio: 'Clean, transparent, and effective supplements for athletes.' },
    { name: 'Drive Elite', email: 'pr@driveelite.com', password: 'password123', role: 'business', niche: 'Automotive', location: 'Stuttgart, Germany', title: 'Luxury Car Rentals', website: 'www.driveelite.com', verified: true, bio: 'Experience the thrill of driving the world\'s most exotic supercars.' },
    { name: 'FinSmart App', email: 'creators@finsmart.com', password: 'password123', role: 'business', niche: 'Finance', location: 'New York, USA', title: 'Personal Finance & Investing', website: 'www.finsmartapp.com', verified: true, bio: 'Making investing accessible and simple for Gen Z and Millennials.' }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        // Delete previous dummy data to avoid duplicates
        const allEmails = [...influencers, ...businesses].map(u => u.email);
        await User.deleteMany({ email: { $in: allEmails } });

        // Insert Users
        const createdInfluencers = await User.insertMany(influencers);
        console.log(`Created ${createdInfluencers.length} influencers!`);

        const createdBusinesses = await User.insertMany(businesses);
        console.log(`Created ${createdBusinesses.length} businesses!`);

        // Delete previous offers from these businesses to start fresh
        const businessIds = createdBusinesses.map(b => b._id);
        await Offer.deleteMany({ businessId: { $in: businessIds } });

        // Create Diverse Offers
        const offers = [
            // Original Offers
            { title: 'Winter Collection Shoot - Paid Collab', description: 'We are looking for fashion influencers to showcase our new winter luxury streetwear collection.', businessId: createdBusinesses[0]._id, category: 'brand', type: 'paid', price: 1500, requirements: 'Must have at least 100K followers.', targetAudience: 'influencers' },
            { title: 'Review Our New Vegan Meal Kit', description: 'Seeking food reviewers and lifestyle vloggers to try our new 100% plant-based meal kits.', businessId: createdBusinesses[1]._id, category: 'brand', type: 'barter', price: 0, requirements: 'Will provide 1 month of free meal kits in exchange for 2 TikToks.', targetAudience: 'influencers' },
            { title: 'Tech Review: Nova Smartwatch Pro', description: 'Tech YouTubers needed for an honest unboxing and review of our flagship smartwatch.', businessId: createdBusinesses[2]._id, category: 'brand', type: 'paid', price: 3000, requirements: 'Must shoot in 4K. Minimum average views 50K.', targetAudience: 'influencers' },
            
            // New Diverse Offers
            { title: 'Apex Pro Keyboard Launch Stream', description: 'Seeking Twitch streamers to showcase our new mechanical keyboard during live gameplay.', businessId: createdBusinesses[3]._id, category: 'brand', type: 'paid', price: 2500, requirements: 'Minimum 5,000 average concurrent viewers. Must play FPS games.', targetAudience: 'influencers' },
            { title: 'Aura Glass-Skin Routine TikTok', description: 'Looking for beauty creators to try our 3-step glass skin routine and post a 60s review.', businessId: createdBusinesses[4]._id, category: 'brand', type: 'barter', price: 0, requirements: 'We will send a $300 PR package. Need 1 aesthetic TikTok video.', targetAudience: 'influencers' },
            { title: 'Luxury Villa Stay & Review in Bali', description: 'Travel influencers wanted for a 3-night fully paid stay at our newest Bali cliffside villa.', businessId: createdBusinesses[5]._id, category: 'hotel', type: 'barter', price: 0, requirements: 'Need 1 dedicated YouTube vlog and 3 Instagram Reels. Flights not included.', targetAudience: 'influencers' },
            { title: 'FitCore Pre-Workout Ambassador', description: 'Looking for fitness athletes for a long-term monthly ambassadorship.', businessId: createdBusinesses[6]._id, category: 'brand', type: 'paid', price: 1000, requirements: 'Monthly deliverables: 4 stories, 1 post. Includes unique discount code.', targetAudience: 'influencers' },
            { title: 'Exotic Supercar Weekend Experience', description: 'Automotive and lifestyle vloggers wanted to test drive a Lamborghini Huracan for a weekend.', businessId: createdBusinesses[7]._id, category: 'brand', type: 'barter', price: 0, requirements: 'Must have valid license. High-quality cinematic production required.', targetAudience: 'influencers' },
            { title: 'FinSmart App Install Campaign', description: 'Educate your audience on smart investing using our app. Performance-based pay available.', businessId: createdBusinesses[8]._id, category: 'brand', type: 'paid', price: 2000, requirements: 'Must have a highly engaged Gen-Z audience. Finance/Lifestyle niche.', targetAudience: 'influencers' }
        ];

        const createdOffers = await Offer.insertMany(offers);
        console.log(`Created ${createdOffers.length} promotional offers!`);

        console.log('Data Seeding Completed Successfully! 🚀');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
