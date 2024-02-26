const youtubeKey = 'AIzaSyD6GYnOCkc0GN1T5nx3RYQCGZ0ulfpvnoo';

// Define the getSubscribers function
export const getSubscribers = (youtubeUser, callback) => {
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youtubeUser}&key=${youtubeKey}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        callback(null, data["items"][0].statistics.subscriberCount);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        callback(error, null);
    });
};