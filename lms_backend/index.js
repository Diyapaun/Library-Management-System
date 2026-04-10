require('dotenv').config(); 
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected!"))
    .catch(err => console.log("❌ DB Error: " + err));

// --- MODELS ---

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Matches 'user' collection in Compass
const users = mongoose.model('user', userSchema, 'user');

// Matches 'books' collection in Compass
const books = mongoose.model('books', mongoose.Schema({ 
    image: String, 
    bookName: String, 
    author: String, 
    category: String,
    price: Number 
}), 'books');

// ✅ FIXED: Matches 'Favourites' exactly as seen in your screenshot
const favorites = mongoose.model('favorites', mongoose.Schema({ 
    username: String, 
    bookName: String, 
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'books' } 
}), 'Favourites');

// ✅ FIXED: Matches 'Issued books' exactly as seen in your screenshot
const issuedBooks = mongoose.model('Issued books', mongoose.Schema({ 
    username: String, 
    bookName: String, 
    issueDate: { type: Date, default: Date.now }, 
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'books' } 
}), 'Issued books');

// --- AUTH MIDDLEWARE ---

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.userId = decoded.id;
        req.userIsAdmin = decoded.isAdmin; 
        next();
    });
};

const isAdminMiddleware = (req, res, next) => {
    if (!req.userIsAdmin) return res.status(403).json({ message: "Access Denied" });
    next();
};

// --- ROUTES ---

app.get('/', (req, res) => res.send('LMS Backend Secure Server 🚀'));

app.get('/books', async (req, res) => {
    try {
        const allBooks = await books.find({});
        res.json(allBooks);
    } catch (err) { res.status(500).json(err); }
});

app.post('/Signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new users({ name, email, password, isAdmin: false });
        await newUser.save();
        res.json({ success: true, message: "User registered successfully" });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/Login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- FAVORITES LOGIC ---

  app.post('/addFavorite', verifyToken, async (req, res) => {
    try {
        const { username, bookId, bookName } = req.body;
        const bId = new mongoose.Types.ObjectId(bookId);

        // This line prevents duplicates:
        const existing = await favorites.findOne({ username, bookId: bId });
        
        if (existing) {
            return res.json({ success: true, message: "Already in favorites" });
        }

        const newFav = new favorites({ username, bookId: bId, bookName });
        await newFav.save();
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ success: false }); 
    }
});

app.get('/getFavorites/:username', verifyToken, async (req, res) => {
    try {
        const data = await favorites.find({ username: req.params.username }).populate('bookId');
        const bookDetails = data.map(item => item.bookId).filter(b => b != null);
        res.json(bookDetails);
    } catch (err) { res.status(500).json({ success: false }); }
});

app.delete('/removeFavorite/:username/:bookId', verifyToken, async (req, res) => {
    try {
        const bId = new mongoose.Types.ObjectId(req.params.bookId);
        await favorites.findOneAndDelete({ username: req.params.username, bookId: bId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- ISSUED BOOKS LOGIC ---

app.post('/issueBook', verifyToken, async (req, res) => {
    try {
        const { username, bookName, bookId } = req.body;
        
        const newIssue = new issuedBooks({
            username,
            bookName,
            bookId: new mongoose.Types.ObjectId(bookId),
            issueDate: new Date()
        });

        await newIssue.save();
        res.json({ success: true });
    } catch (err) { 
        console.error("Issue Book Error:", err);
        res.status(500).json({ success: false }); 
    }
});

app.get('/myIssuedBooks/:username', verifyToken, async (req, res) => {
    try {
        const data = await issuedBooks.find({ username: req.params.username });
        res.json(data);
    } catch (err) { res.status(500).json({ success: false }); }
});

app.delete('/removeIssuedBook/:id', verifyToken, async (req, res) => {
    try {
        await issuedBooks.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- ADMIN CONTROLS ---

app.get('/admin/stats', verifyToken, isAdminMiddleware, async (req, res) => {
    try {
        const totalBooks = await books.countDocuments();
        const totalIssued = await issuedBooks.countDocuments();
        const totalUsers = await users.countDocuments({ isAdmin: false });
        res.json({ success: true, stats: { totalBooks, totalIssued, totalUsers } });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/addBook', verifyToken, isAdminMiddleware, async (req, res) => {
    try {
        const newBook = new books(req.body);
        await newBook.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.delete('/removeBook/:id', verifyToken, isAdminMiddleware, async (req, res) => {
    try {
        await books.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`📡 Secure Server running on http://localhost:${PORT}`));