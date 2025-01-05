const express = require('express');
const cors = require('cors');  // Import the CORS middleware
const { config } = require("dotenv");
const { db, auth } = require('./config/firebaseConfig');
const { validateDate } = require('./middlewares/dateValidator');
const { fetchAvailableSlots, bookSlotController, cancelSlotController, getOneUserBookings } = require('./controllers/slotController');

config();

const app = express();

// Enable CORS for all origins (you can modify this to allow specific domains in production)
app.use(cors());  // Add this line to allow cross-origin requests

app.use(express.json());

/*=== Get Updated 30 minutes all slots for particular date in YYYY-MM-DD format. === */
app.get('/availableSlots', async (req, res) => {
    validateDate(req, res, async () => {
        await fetchAvailableSlots(req, res, db);
    });
});

/*=== Book a slot requested by the user=== */
app.post('/bookSlot', async (req, res) => {
    await bookSlotController(req, res, db, auth);
});

/*=== Cancel the slot requested by the user === */
app.post('/cancelSlot', async (req, res) => {
    await cancelSlotController(req, res, db);
});

/* === To verify all the bookings of single user === */
app.get('/userBookings', async (req, res) => {
    await getOneUserBookings(req, res, db, auth); // Pass db and auth instances
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
