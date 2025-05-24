const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === Routes ===
const authRoutes = require('./routes/auth');
const internRoutes = require('./routes/internRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salaries', salaryRoutes);

const mongoOptions = [
    { label: 'Local DB', uri: process.env.MONGO_URI_LOCAL },
    { label: 'Cloud Cluster (MongoDB Atlas)', uri: process.env.MONGO_URI_ONLINE }
];

const cacheFilePath = path.join(__dirname, '.db_cache');

function connectToMongo(uriLabel, uri) {
    mongoose.connect(uri)
        .then(() => {
            console.log(`✅ Connected to MongoDB: ${uriLabel}`);
            app.listen(5000, () => console.log('🚀 Server running on port 5000'));
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err);
            process.exit(1);
        });
}

if (fs.existsSync(cacheFilePath)) {
    const savedIndex = parseInt(fs.readFileSync(cacheFilePath, 'utf-8'));
    const selected = mongoOptions[savedIndex - 1];

    if (!selected || !selected.uri) {
        console.log('❌ Invalid saved selection. Delete .db_cache to reselect.');
        process.exit(1);
    }

    connectToMongo(selected.label, selected.uri);
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Select MongoDB URI:');
    mongoOptions.forEach((opt, i) => {
        console.log(`${i + 1}: ${opt.label}`);
    });

    rl.question('Enter 1 or 2 to select the database URI: ', (answer) => {
        const selected = mongoOptions[parseInt(answer) - 1];

        if (!selected || !selected.uri) {
            console.log('❌ Invalid selection. Exiting...');
            rl.close();
            process.exit(1);
        }

        fs.writeFileSync(cacheFilePath, answer);
        rl.close();
        connectToMongo(selected.label, selected.uri);
    });
}