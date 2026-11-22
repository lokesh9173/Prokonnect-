import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { dbName: 'prokonnect' }).then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('1234', salt);
    const result = await mongoose.connection.collection('users').updateOne(
        { email: 'lokeshshar9173@gmail.com' },
        { $set: { password: hash } }
    );
    console.log(result);
    process.exit(0);
}).catch(console.error);
