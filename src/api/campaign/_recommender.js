const { DateTime } = require('luxon');
const { SOCIAL_MEDIA_PLATFORMS } = require('../../constants/enum');
const { APIError } = require('../../_error');

const timeRecommender = (
    day,
    platform,
) => {
    // TODO: differentiate by platform
    // https://sproutsocial.com/insights/best-times-to-post-on-social-media/
    // also need to get correct values

    const randomizer = Math.floor(Math.random() * 4);

    if (platform === SOCIAL_MEDIA_PLATFORMS.FACEBOOK) {
        switch (day) {
        case 0: // sunday -- 9 am
            return [[8, 0], [9, 0], [10, 0], [11, 0]][randomizer];
        case 1:
            return [[3, 0], [7, 0], [9, 0], [10, 0]][randomizer];
        case 2:
            return [[3, 0], [10, 0], [11, 0], [12, 0]][randomizer];
        case 3:
            return [[2, 0], [3, 0], [4, 0], [8, 0]][randomizer];
        case 4:
            return [[2, 0], [3, 0], [8, 0], [9, 0]][randomizer];
        case 5:
            return [[3, 0], [4, 0], [10, 0], [11, 0]][randomizer];
        case 6:
            return [[7, 0], [8, 0], [9, 0], [10, 0]][randomizer];
        default:
            return [3, 0];
        }
    } else if (platform === SOCIAL_MEDIA_PLATFORMS.TWITTER) {
        switch (day) {
        case 0: // sunday -- 9 am
            return [[9, 0], [10, 0], [11, 0], [19, 0]][randomizer];
        case 1:
            return [[8, 0], [9, 0], [10, 0], [11, 0]][randomizer];
        case 2:
            return [[9, 0], [10, 0], [11, 0], [12, 0]][randomizer];
        case 3:
            return [[8, 0], [9, 0], [10, 0], [11, 0]][randomizer];
        case 4:
            return [[9, 0], [10, 0], [13, 0], [21, 0]][randomizer];
        case 5:
            return [[7, 0], [9, 0], [10, 0], [11, 0]][randomizer];
        case 6:
            return [[7, 0], [8, 0], [9, 0], [10, 0]][randomizer];
        default:
            return [9, 0];
        }
    } else { // instagram
        switch (day) {
        case 0: // sunday -- 9 am
            return [[9, 0], [10, 0], [11, 0], [19, 0]][randomizer];
        case 1:
            return [[10, 0], [11, 0], [12, 0], [13, 0]][randomizer];
        case 2:
            return [[10, 0], [11, 0], [12, 0], [13, 0]][randomizer];
        case 3:
            return [[10, 0], [11, 0], [12, 0], [13, 0]][randomizer];
        case 4:
            return [[9, 0], [10, 0], [11, 0], [12, 0]][randomizer];
        case 5:
            return [[9, 0], [10, 0], [11, 0], [12, 0]][randomizer];
        case 6:
            return [[8, 0], [9, 0], [10, 0], [11, 0]][randomizer];
        default:
            return [9, 0];
        }
    }
};

const CAMPAIGN_DEFAULTS_REGULAR__DAILY_MAX = 180;

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

const dateRecommenderMonthly = (platform, dateInfo) => {
    try {
        const {
            startDate,
            endDate = null,
            timezone,
            maxPosts = null,
        } = dateInfo;

        const campaignList = [];
        const startTime = DateTime.fromMillis(startDate).setZone(timezone);
        const endTime = endDate ? DateTime.fromMillis(endDate).setZone(timezone) : null;

        let totalPosts = CAMPAIGN_DEFAULTS_REGULAR__MONTHLY.length;
        if (maxPosts && maxPosts < totalPosts) totalPosts = maxPosts;

        for (let i = 0; i < totalPosts; i += 1) {
            const monthInterval = CAMPAIGN_DEFAULTS_REGULAR__MONTHLY[i];

            let currDate = startTime.plus({ months: monthInterval });
            const [timeHour, timeMin] = timeRecommender(currDate.weekday, timezone, platform);
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

const sanitizeStartDate = (startDateInMillis, timezone) => {
    if (!startDateInMillis) return null;
    const currTime = DateTime.now();
    let startDate = DateTime.fromMillis(startDateInMillis).setZone(timezone);
    startDate = startDate.set({ hour: 0, minute: 0 });
    if (startDate < currTime) {
        return currTime;
    }
    return startDate;
};

const sanitizeEndDate = (endDateFromMillis, timezone) => {
    if (!endDateFromMillis) return null;
    let endDate = DateTime.fromMillis(endDateFromMillis).setZone(timezone);
    endDate = endDate.set({ hour: 23, minute: 59 });

    return endDate;
};

const dateRecommenderWeekly = (platform, dateInfo) => {
    try {
        const {
            startDate,
            endDate = null,
            timezone,
            maxPosts = null,
        } = dateInfo;

        const campaignList = [];
        const startTime = sanitizeStartDate(startDate);
        const endTime = sanitizeEndDate(endDate);

        let totalPosts = CAMPAIGN_DEFAULTS_REGULAR__WEEKLY.length;
        if (maxPosts && maxPosts < totalPosts) totalPosts = maxPosts;

        for (let i = 0; i < totalPosts; i += 1) {
            const dayInterval = CAMPAIGN_DEFAULTS_REGULAR__WEEKLY[i];

            let recommended = startTime.plus({ days: dayInterval });
            const [timeHour, timeMin] = timeRecommender(recommended.weekday, timezone, platform);
            recommended = recommended.set({
                hour: timeHour,
                minute: timeMin,
                second: 0,
                millisecond: 0,
            });
            if (endTime && recommended > endTime) break;

            if (recommended >= startTime) {
                campaignList.push(recommended.toMillis());
            }
        }

        return campaignList;
    } catch (err) {
        throw new APIError('Failed to create weekly campaign', 500);
    }
};

const dateRecommenderDaily = (platform, dateInfo) => {
    try {
        const {
            startDate,
            endDate = null,
            timezone,
            maxPosts = null,
        } = dateInfo;

        const campaignList = [];
        const startTime = sanitizeStartDate(startDate);
        const endTime = sanitizeEndDate(endDate);

        let totalPosts = CAMPAIGN_DEFAULTS_REGULAR__DAILY_MAX;
        if (maxPosts && maxPosts < totalPosts) totalPosts = maxPosts;

        if (endTime) {
            totalPosts = Math.min(endTime.diff(startTime, ['days']).days, totalPosts);
        }

        for (let i = 0; i < totalPosts; i += 1) {
            let recommended = startTime.plus({ days: i });
            const [timeHour, timeMin] = timeRecommender(recommended.weekday, timezone, platform);
            recommended = recommended.set({
                hour: timeHour,
                minute: timeMin,
                second: 0,
                millisecond: 0,
            });
            if (endTime && recommended > endTime) break;

            if (recommended >= startTime) {
                campaignList.push(recommended.toMillis());
            }
        }

        return campaignList;
    } catch (err) {
        throw new APIError('Failed to create daily campaign', 500);
    }
};

const dateRecommenderEvent = (platform, dateInfo) => {
    try {
        const {
            startDate = null,
            endDate,
            timezone,
            maxPosts = null,
        } = dateInfo;

        const startTime = sanitizeStartDate(startDate);
        const endTime = sanitizeEndDate(endDate);

        const campaignList = [];
        let daysBetween = 0;

        if (startDate) {
            if (endTime < startTime) return campaignList;
            daysBetween = endTime.diff(startTime, 'day');
        } else {
            daysBetween = endTime.diffNow('day');
        }

        let totalPosts = CAMPAIGN_DEFAULTS_IRREGULAR__EVENT.length;
        if (maxPosts && maxPosts < totalPosts) totalPosts = maxPosts;

        for (let i = 0; i < totalPosts; i += 1) {
            const daysUntil = CAMPAIGN_DEFAULTS_IRREGULAR__EVENT[i];
            if (daysBetween != null && daysUntil > daysBetween) break;

            let recommended = endTime.minus({ days: daysUntil });
            const [timeHour, timeMin] = timeRecommender(recommended.weekday, timezone, platform);
            recommended = recommended.set({
                hour: timeHour,
                minute: timeMin,
                second: 0,
                millisecond: 0,
            });
            if (recommended >= startTime) {
                campaignList.push(recommended.toMillis());
            }
        }

        return campaignList;
    } catch (err) {
        throw new APIError('Failed to create event campaign', 500);
    }
};

const dateRecommenderToday = (platform, timezone) => {
    try {
        const currDate = DateTime.now().setZone(timezone);
        const [timeHour, timeMin] = timeRecommender(currDate.weekDay, timezone, platform);
        const recommended = currDate.set({
            hour: timeHour,
            minute: timeMin,
            second: 0,
            millisecond: 0,
        });

        if (currDate <= recommended) {
            return recommended.toMillis();
        }
        return null;
    } catch (err) {
        throw new APIError('Failed to get recommended post time today', 500);
    }
};

module.exports = {
    timeRecommender,
    dateRecommenderDaily,
    dateRecommenderWeekly,
    dateRecommenderMonthly,
    dateRecommenderEvent,
    dateRecommenderToday,
};
