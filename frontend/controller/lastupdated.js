const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    timeZoneName: 'short'
};

export async function fetchLastUpdated() {
    try {
        const response = await fetch('/app/fetchLastUpdated');
        const data = await response.json();
        const dateObject = new Date(data[0][0].timestamp).toLocaleString('en-US', options);
        return dateObject;
    } catch (error) {
        console.error('Error fetching or displaying time:', error.message);
        throw error;
    }
}