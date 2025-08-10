import express from 'express';
import dotenv from 'dotenv';
import stripePackage from 'stripe';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Resolve the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to serve static files
app.use(express.static(join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/campusbite", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error", error);
    console.error("Network Error");
  }
};

connectDB();

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Serve login page at root
app.get('/', (req, res) => {
  res.sendFile('login.html', { root: join(__dirname, 'public') });
});

// Redirect to index.html after login (you need to implement authentication logic)
app.post('/login', async (req, res) => {
  // Here, you should handle the login logic and check user credentials
  const { email, password } = req.body;

  // Example: Find the user in the database
  const user = await User.findOne({ email, password }); // This is just an example; never use plain text passwords!

  if (user) {
    // If login is successful, redirect to index.html
    res.redirect('/index.html'); // Make sure index.html exists in your public directory
  } else {
    // If login fails, you can send an error response or redirect back to login
    res.status(401).send('Login failed');
  }
});

// Existing routes for success and cancel
app.get('/success', (req, res) => {
  res.sendFile('success.html', { root: join(__dirname, 'public') });
});

app.get('/cancel', (req, res) => {
  res.sendFile('cancel.html', { root: join(__dirname, 'public') });
});

// Stripe setup and routes
const stripe = stripePackage(process.env.stripe_api);
const DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async (req, res) => {
  try {
    const lineItems = req.body.items.map((item) => {
      const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);
      return {
        price_data: {
          currency: 'INR',
          product_data: {
            name: item.title,
            images: [item.productImg]
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/cancel`,
      line_items: lineItems,
      billing_address_collection: 'required'
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error });
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
