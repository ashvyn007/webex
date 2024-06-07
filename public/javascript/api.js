console.log("im api")
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/student-user')
        .then(response => {
            console.log("im fetch")
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                // Assuming the first entry in data has the latitude and longitude
                // const { latitude, longitude } = data[0];
                // initMap(latitude, longitude);
                console.log(data)
                // console.log(data.student_lat +"and long is"+data.student_long)
                // console.log(data.student_lat +"and long is"+data.student_long)

            } else {
                console.error('No location data available');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

        