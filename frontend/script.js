document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const q = document.getElementById('q').value;
    const category = document.getElementById('category').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const resultsTable = document.getElementById('results-table');
    const resultsBody = document.getElementById('results-body');
    const noResultsText = document.getElementById('no-results');
    const errorMessage = document.getElementById('error-message');

    resultsBody.innerHTML = '';
    resultsTable.classList.add('hidden');
    noResultsText.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const response = await fetch(`https://zeerostock-fullstack-nxt-assgin-1.onrender.com/search?${params.toString()}`);
        const data = await response.json();

    if (!response.ok) {
        errorMessage.textContent = data.error || 'An error occurred';
        errorMessage.classList.remove('hidden');
        return;
    }

    if (data.length === 0) {
        noResultsText.classList.remove('hidden'); 
    } else {
        data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.category}</td>
            <td>$${item.price}</td>
            <td>${item.supplier}</td>
        `;
        resultsBody.appendChild(row);
        });
        resultsTable.classList.remove('hidden'); 
    }
    } catch (error) {
        console.error("Failed to fetch data:", error);
        errorMessage.textContent = "Failed to connect to the server. Is the backend running?";
        errorMessage.classList.remove('hidden');
    }
});