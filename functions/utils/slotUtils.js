function generateAllSlots() {
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
        const ampm = hour < 12 ? 'AM' : 'PM';
        const startHour12 = hour % 12 || 12;     /*=== Convert hour to 12-hour format === */
        const endHour12 = (hour + 1) % 12 || 12; /*=== Next hour in 12-hour format === */

        /*=== Adding both half of one hour like=> 9:00 AM - 9:30 AM and 9:30 AM - 10:00 AM intervals === */
        slots.push(
            {
                time: `${startHour12}:00 ${ampm} - ${startHour12}:30 ${ampm}`,
                booked: false,
                userId: null
            },
            {
                time: `${startHour12}:30 ${ampm} - ${endHour12}:00 ${ampm}`,
                booked: false,
                userId: null
            }
        );
    }

    return slots;
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function normalizeTimeFormat(time) {
    return time.replace(/\b(\d):/g, '0$1:');
}

module.exports = { generateAllSlots, formatDate, normalizeTimeFormat };
