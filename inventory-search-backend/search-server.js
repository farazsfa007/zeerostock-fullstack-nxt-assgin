const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const inventory = [
    { id: 1, productName: "Ergonomic Office Chair", category: "Furniture", price: 1990, supplier: "Acme Corp" },
    { id: 2, productName: "Wooden Desk", category: "Furniture", price: 2500, supplier: "Acme Corp" },
    { id: 3, productName: "Wireless Mouse", category: "Electronics", price: 250, supplier: "TechGear" },
    { id: 4, productName: "Mechanical Keyboard", category: "Electronics", price: 850, supplier: "TechGear" },
    { id: 5, productName: "Standing Desk", category: "Furniture", price: 3500, supplier: "Acme Corp" },
    { id: 6, productName: "Noise Cancelling Headphones", category: "Electronics", price: 1500, supplier: "SoundMax" },
    { id: 7, productName: "Whiteboard", category: "Office Supplies", price: 400, supplier: "EduSupplies" },
    { id: 8, productName: "Pack of Blue Pens", category: "Office Supplies", price: 90, supplier: "EduSupplies" },
    { id: 9, productName: "Desk Lamp", category: "Furniture", price: 1200, supplier: "Acme Corp" },
    { id: 10, productName: "Laptop Stand", category: "Electronics", price: 450, supplier: "TechGear" }
];

app.get('/search', (req, res) => {
    const { q, category, minPrice, maxPrice } = req.query;

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({ error: "Invalid price range: minPrice cannot be greater than maxPrice." });
    }

    const results = inventory.filter(item => {

        if (q) {
        const searchTerm = q.toLowerCase();
        const nameMatch = item.productName.toLowerCase().includes(searchTerm);
        if (!nameMatch) return false;
    }

    if (category) {
        if (item.category.toLowerCase() !== category.toLowerCase()) return false;
    }

    if (minPrice) {
        if (item.price < Number(minPrice)) return false;
    }

    if (maxPrice) {
        if (item.price > Number(maxPrice)) return false;
    }

    return true;
    });

    res.status(200).json(results);
});

const PORT = 4001; 
app.listen(PORT, () => {
    console.log(`Search API is running on PORT - ${PORT}`);
});