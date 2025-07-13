import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezonePlugin from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(customParseFormat);

// Get the timezone from the page props (set in the controller)
const appTimezone = document.querySelector('meta[name="app-timezone"]')?.getAttribute('content') || 'UTC';

// Set the default timezone
dayjs.tz.setDefault(appTimezone);

export default dayjs;
