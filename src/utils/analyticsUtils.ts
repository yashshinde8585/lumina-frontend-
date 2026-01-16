
import { BoardColumn } from '../types';

type TimeFilter = '7days' | '30days' | '3months' | 'all';

export function calculateVelocityData(columns: BoardColumn[], timeFilter: TimeFilter) {
    // 1. Flatten all jobs from all columns EXCEPT 'saved' (Wishlist)
    const allJobs = columns
        .filter(col => col.id !== 'saved') // Exclude Wishlist/Saved items
        .flatMap(col => col.items || []);

    // 2. Determine date range
    const now = new Date();
    const startDate = new Date();
    let loopCount = 0;
    let dateFormat: Intl.DateTimeFormatOptions = { weekday: 'short' }; // Mon, Tue

    switch (timeFilter) {
        case '7days':
            // Current Week (Mon - Sun)
            const day = now.getDay(); // 0 is Sun, 1 is Mon
            const diff = day === 0 ? 6 : day - 1; // Calculate days back to Monday
            startDate.setDate(now.getDate() - diff); // Set to Monday
            loopCount = 6; // 0 to 6 = 7 days
            dateFormat = { weekday: 'short' };
            break;
        case '30days':
            startDate.setDate(now.getDate() - 29);
            loopCount = 29;
            dateFormat = { month: 'short', day: 'numeric' }; // Jan 12
            break;
        case '3months':
            startDate.setDate(now.getDate() - 90);
            loopCount = 90;
            dateFormat = { month: 'short', day: 'numeric' };
            break;
        case 'all':
            startDate.setDate(now.getDate() - 180);
            loopCount = 180; // Cap at 6 months
            dateFormat = { month: 'short', year: '2-digit' };
            break;
    }

    startDate.setHours(0, 0, 0, 0); // Start of day

    // Helper to get local YYYY-MM-DD
    const getLocalDateKey = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    // 3. Create map of dates in range
    const chartData: { fullDate: string, day: string, applications: number }[] = [];

    // Initialize all days in range with 0
    for (let i = 0; i <= loopCount; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = getLocalDateKey(d);

        // Format label for display
        const label = new Intl.DateTimeFormat('en-US', dateFormat).format(d);

        chartData.push({
            fullDate: key,
            day: label,
            applications: 0
        });
    }

    // 4. Fill with actual data
    allJobs.forEach(job => {
        if (!job.date) return;
        const jobDate = new Date(job.date);
        if (isNaN(jobDate.getTime())) return;

        const key = getLocalDateKey(jobDate);

        // If job date is within our range map, increment
        const index = chartData.findIndex(d => d.fullDate === key);
        if (index !== -1) {
            chartData[index].applications += 1;
        }
    });

    return chartData;
}
