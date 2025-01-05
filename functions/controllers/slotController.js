const { getUpdatedSlots, bookSlot, cancelSlot, getAllBookingsForUser } = require("../services/slotService");

async function fetchAvailableSlots(req, res, db) {
    const { date } = req.query;

    try {
        const slots = await getUpdatedSlots(date, db);
        return res.status(200).json({ date, slots });
    } catch (error) {
        console.error("Error fetching slots:", error);
        return res.status(500).json({ error: 'Failed to fetch available slots.' });
    }
}

async function bookSlotController(req, res, db, auth) {
    try {
        const { date, slot, userId } = req.body;
        if (!date || !slot || !userId) {
            return res.status(400).json({ error: 'Missing required fields: date, slot, or userId.' });
        }

        const result = await bookSlot(date, slot, userId, db, auth);
        return res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error booking slot:", error);
        return res.status(400).json({ error: 'Failed to book slot.' });
    }
}

async function cancelSlotController(req, res, db) {
    try {
        const { date, slot, userId } = req.body;
        if (!date || !slot || !userId) {
            return res.status(400).json({ error: 'Missing required fields: date, slot, or userId.' });
        }

        const result = await cancelSlot(date, slot, userId, db);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error cancelling slot:", error);
        return res.status(400).json({ error: 'Failed to cancel slot.' });
    }
}

async function getOneUserBookings(req, res, db, auth) {
    try {
        const { userId } = req.query; 
        if (!userId) {
            return res.status(400).json({ error: 'Missing required fields: userId.' });
        }

        const result = await getAllBookingsForUser(userId, db, auth);
        res.status(200).json({ bookings: result });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(400).json({ error: 'Failed to fetch user bookings.' });
    }
}

/* === Real-time listener to check slot availability 
This will start listening for any change when 'slot: 02:00 PM - 02:30 PM' slot on date: 2025-01-08. Whenever the slot is updated (booked or canceled), the real-time listener will output the status to the console. Very Helpful.
=== */
async function listenForSlotChanges(date, slot) {
    const dateDocRef = db.collection('appointments').doc(date);
    const slotDocRef = dateDocRef.collection('slots').doc(slot);

    slotDocRef.onSnapshot((doc) => {
        if (doc.exists) {
            const slotData = doc.data();
            console.log(`Slot ${slot} is ${slotData.booked ? 'booked' : 'available'}`);
            // You can send notifications or perform any other actions here
        } else {
            console.log(`Slot ${slot} does not exist.`);
        }
    });
};


module.exports = { fetchAvailableSlots, bookSlotController, cancelSlotController, getOneUserBookings, listenForSlotChanges };

