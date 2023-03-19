const { DateTime } = require('luxon');
const { APIError } = require('../../_error');

const DEFAULT_TIMEZONE = 'America/Vancouver';

const timeRecommender = (
    day,
    // medium,
) => {
    // TODO: differentiate by medium
    // https://sproutsocial.com/insights/best-times-to-post-on-social-media/
    // also need to get correct values
    switch (day) {
    case 0: // sunday -- 9 am
        return [9, 0];
    case 1:
        return [11, 0];
    case 2:
        return [10, 0];
    case 3:
        return [10, 0];
    case 4:
        return [11, 0];
    case 5:
        return [11, 0];
    case 6:
        return [9, 0];
    default:
        return [9, 0];
    }
};

const CAMPAIGN_DEFAULTS_REGULAR__WEEKLY = [
    // maximum 6 months
    0, 7, 14, 21, 28, 35, 42, 49,
    56, 63, 70, 77, 84, 91, 98,
    105, 112, 119, 126, 133, 140, 147,
    154, 161, 168, 175, 182,
];
const CAMPAIGN_DEFAULTS_REGULAR__MONTHLY = [
    // maximum 6 months
    0, 1, 2, 3, 4, 5, 6,
];

const CAMPAIGN_DEFAULTS_IRREGULAR__EVENT = [
    0, 1, 2, 3, 5, 7, 14, 21, 28,
];

const dateRecommenderMonthly = (medium, dateInfo) => {
    try {
        const {
            startDate,
            endDate = null,
            timezone = DEFAULT_TIMEZONE,
        } = dateInfo;

        const campaignList = [];
        const startTime = DateTime.fromMillis(startDate).setZone(timezone);
        const endTime = endDate ? DateTime.fromMillis(endDate).setZone(timezone) : null;

        for (let i = 0; i < CAMPAIGN_DEFAULTS_REGULAR__MONTHLY.length; i += 1) {
            const monthInterval = CAMPAIGN_DEFAULTS_REGULAR__MONTHLY[i];

            let currDate = startTime.plus({ months: monthInterval });
            const [timeHour, timeMin] = timeRecommender(currDate.day, timezone, medium);
            currDate = currDate.set({
                hour: timeHour,
                minute: timeMin,
                second: 0,
                millisecond: 0,
            });
            if (endTime && currDate > endTime) break;

            campaignList.push(currDate.toMillis());
        }

        return campaignList;
    } catch (err) {
        throw new APIError('Failed to create monthly campaign', 500);
    }
};

const dateRecommenderWeekly = (medium, dateInfo) => {
    try {
        const {
            startDate,
            endDate = null,
            timezone = DEFAULT_TIMEZONE,
        } = dateInfo;

        const campaignList = [];
        const startTime = DateTime.fromMillis(startDate).setZone(timezone);
        const endTime = endDate ? DateTime.fromMillis(endDate).setZone(timezone) : null;

        for (let i = 0; i < CAMPAIGN_DEFAULTS_REGULAR__WEEKLY.length; i += 1) {
            const dayInterval = CAMPAIGN_DEFAULTS_REGULAR__WEEKLY[i];

            let currDate = startTime.plus({ days: dayInterval });
            const [timeHour, timeMin] = timeRecommender(currDate, timezone, medium);
            currDate = currDate.set({
                hour: timeHour,
                minute: timeMin,
                second: 0,
                millisecond: 0,
            });
            if (endTime && currDate > endTime) break;

            campaignList.push(currDate.toMillis());
        }

        return campaignList;
    } catch (err) {
        throw new APIError('Failed to create weekly campaign', 500);
    }
};

const dateRecommenderEvent = (medium, dateInfo) => {
    try {
        const {
            startDate = null,
            endDate,
            timezone = DEFAULT_TIMEZONE,
        } = dateInfo;

        const endTime = DateTime.fromMillis(endDate).setZone(timezone);

        const campaignList = [];
        let daysBetween = 0;

        if (startDate) {
            const startTime = DateTime.fromMillis(startDate).setZone(timezone);
            if (endTime < startTime) return campaignList;

            daysBetween = endTime.diff(startTime, 'day');
        } else {
            daysBetween = endTime.diffNow('day');
        }

        for (let i = 0; i < CAMPAIGN_DEFAULTS_IRREGULAR__EVENT.length; i += 1) {
            const daysUntil = CAMPAIGN_DEFAULTS_IRREGULAR__EVENT[i];
            if (daysBetween != null && daysUntil > daysBetween) break;

            let currDate = endTime.minus({ days: daysUntil });
            const [timeHour, timeMin] = timeRecommender(currDate, timezone, medium);
            currDate = currDate.set({
                hour: timeHour,
                minute: timeMin,
                second: 0,
                millisecond: 0,
            });
            campaignList.push(currDate.toMillis());
        }

        return campaignList;
    } catch (err) {
        throw new APIError('Failed to create event campaign', 500);
    }
};

module.exports = {
    timeRecommender,
    dateRecommenderWeekly,
    dateRecommenderMonthly,
    dateRecommenderEvent,
};
