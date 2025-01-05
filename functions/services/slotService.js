
const { db } = require("../config/firebaseConfig");
const { generateAllSlots, formatDate, normalizeTimeFormat } = require("../utils/slotUtils");

async function getAvailableSlots(date) {
    const dateDocRef = db.collection("appointments").doc(date);

    try {
        /*=== Fetch the slots for the specific date ===*/
        const slotsSnapshot = await dateDocRef.collection("slots").get();

        /*=== Initialize an array to store the extracted slot information ===*/
        const availableSlots = [];

        /*=== Iterate through the snapshot's documents === */
        slotsSnapshot.forEach(slotDoc => {
            const slotData = slotDoc.data();

            /*=== Extract the slot time from the document reference (it's used as the ID) === */
            const slotTime = slotDoc.id;   /*=== This will be something like "09:00 AM - 09:30 AM" === */

            /*=== Extract the booking details (booked status and userId) === */
            const booked = slotData.booked || false;
            const userId = slotData.userId || slotData.userID || null;

            availableSlots.push({
                slotTime,
                booked,
                userId
            });
        });

        return availableSlots;

    } catch (error) {
        throw new Error("Error fetching available slots from Firestore.");
    }
}

async function getUpdatedSlots(date, db) {
    /*=== Get available slots from Firestore === */
    const availableSlots = await getAvailableSlots(date);

    /*=== Step 2: Generate custom 30-minute time slots for the selected date === */
    const customSlots = generateAllSlots();

    /*=== Step 3: Update the custom slots with the data fetched from Firestore  === */
    customSlots.forEach(slot => {
        const normalizedSlotTime = normalizeTimeFormat(slot.time);
        const matchingSlot = availableSlots.find(s => normalizeTimeFormat(s.slotTime) === normalizedSlotTime);

        if (matchingSlot) {
            slot.booked = matchingSlot.booked;
            slot.userId = matchingSlot.userId;
        }
    });

    return customSlots;
}

async function bookSlot(date, slot, userId, db) {

    /* === Format date in YYYY-MM-DD format. === */
    const formattedDate = formatDate(date);

    /* === Custom booking ID: combine date and slot === */
    const bookingId = `${formattedDate}_${slot}`;

    const dateDocRef = db.collection('appointments').doc(formattedDate);
    const slotDocRef = dateDocRef.collection('slots').doc(slot);
    const userDocRef = db.collection('users').doc(userId).collection('bookings').doc(bookingId);

    try {
        /* === Start a Firestore transaction === */
        await db.runTransaction(async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);

            /* === Check if the slot is already booked === */
            if (slotDoc.exists && slotDoc.data().booked) {
                throw new Error('Slot is already booked.');
            }

            /* === Book the slot in appointments === */
            transaction.set(slotDocRef, { booked: true, userId }, { merge: true });

            /* === Record the booking for the user with a custom booking ID === */
            transaction.set(userDocRef, {
                date: formattedDate,
                slot,
                bookedAt: new Date().toDateString(),
                userId,
            });
        });

        return 'Slot booked successfully!';
    } catch (error) {
        if (error.message === 'Slot is already booked.') {
            return error.message;
        }
        throw new Error('Failed to book slot.');
    }
};

async function cancelSlot(date, slot, userId, db) {

    const formattedDate = formatDate(date);
    const normalizedSlot = slot.trim();
    const bookingId = `${formattedDate}_${normalizedSlot}`;

    const dateDocRef = db.collection('appointments').doc(formattedDate);
    const slotDocRef = dateDocRef.collection('slots').doc(normalizedSlot);
    const userDocRef = db.collection('users').doc(userId).collection('bookings').doc(bookingId);

    try {
        await db.runTransaction(async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);
            const userBookingDoc = await transaction.get(userDocRef);

            console.log("Slot Doc Data:", slotDoc.exists ? slotDoc.data() : 'Slot document does not exist');
            console.log("User Booking Doc Data:", userBookingDoc.exists ? userBookingDoc.data() : 'User booking document does not exist');

            if (!slotDoc.exists || !slotDoc.data().booked) {
                throw new Error('Slot is not booked.');
            }

            if (userBookingDoc.exists && userBookingDoc.data().userId !== userId) {
                throw new Error('You can only cancel your own booking.');
            }

            console.log("Slot Data:", slotDoc.data());
            console.log("User Booking Data:", userBookingDoc.data());

            /*=== Update slot and delete user booking === */
            transaction.update(slotDocRef, { booked: false, userId: null });
            transaction.delete(userDocRef);
        });

        return 'Slot canceled successfully!';
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error canceling the slot.');
    }
}

async function getAllBookingsForUser(userId, db) {
    try {
        const bookingsCollection = db.collection('users').doc(userId).collection('bookings');
        const snapshot = await bookingsCollection.get();

        /*=== Check User booking is empty or not=== */
        if (snapshot.empty) {
            return `No bookings found for user: ${userId}`;
        }

        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        return bookings;
    } catch (error) {
        throw new Error(`Error fetching bookings for user ${userId}: ${error.message}`);
    }
}


module.exports = { getAvailableSlots, getUpdatedSlots, bookSlot, cancelSlot, getAllBookingsForUser };
