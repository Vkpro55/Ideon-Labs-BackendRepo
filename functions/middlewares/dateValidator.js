const moment = require("moment");

function validateDate(req, res, next) {
    const { date } = req.query;
    const inputDate = moment(date, "YYYY-MM-DD", true);

    /* === Check if the date is valid === */
    if (!inputDate.isValid()) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    /* === Check if the date is in the future and within 5 days from today   === */
    const today = moment();
    const maxFutureDate = today.clone().add(4, 'days');
    if (inputDate.isBefore(today, 'day')) {
        return res.status(400).json({ error: "The selected date cannot be in the past." });
    }

    if (inputDate.isAfter(maxFutureDate, 'day')) {
        return res.status(400).json({ error: "The selected date cannot be more than 5 days in the future including today itself." });
    }

    /* === Check if the date is a weekend(Saturday or Sunday) === */
    if (inputDate.day() === 6 || inputDate.day() === 0) {
        return res.status(400).json({ error: "Bookings are only available from Monday to Friday." });
    }

    next();
}

module.exports = { validateDate };
