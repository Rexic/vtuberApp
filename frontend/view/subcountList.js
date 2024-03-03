async function fetchSubCounts() {
    try {
        const response = await fetch('/api/fetchSubCounts');
        const data = await response.json();

        const tableBody = document.getElementById('subcountsBody');

        // Clear existing table rows
        tableBody.innerHTML = '';

        // Populate table with data
        data.forEach(row => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = row.channelname;

            if(row.channelname == 'Dokibird') {
                tr.classList.add('highlighted');
            }else{
                tr.classList.add('nonhighlighted');
            }

            tr.appendChild(tdName);

            const tdSubcount = document.createElement('td');
            tdSubcount.textContent = row.currentsubcount;
            tr.appendChild(tdSubcount);

            tableBody.appendChild(tr);
        });

        console.log('Successfully fetched and displayed subcounts for all YouTubers');
    } catch (error) {
        console.error('Error fetching or displaying subcounts:', error.message);
    }
}

fetchSubCounts();