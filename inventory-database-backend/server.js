require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Supplier = require('./models/Supliers');
const Inventory = require('./models/Inventory');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));

// POST /supplier
app.post('/supplier', async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).json(supplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /inventory
app.post('/inventory', async (req, res) => {
    try {
        const { supplier_id, product_name, quantity, price } = req.body;

        // Rule: Inventory must belong to a valid supplier
        const supplierExists = await Supplier.findById(supplier_id);
        if (!supplierExists) {
        return res.status(400).json({ error: 'Invalid supplier_id. Supplier does not exist.' });
        }

        const inventory = new Inventory({ supplier_id, product_name, quantity, price });
        await inventory.save();
        res.status(201).json(inventory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /inventory
app.get('/inventory', async (req, res) => {
    try {
        // MongoDB Aggregation Pipeline for the required grouped query
        const groupedInventory = await Inventory.aggregate([
        {
            $group: {
            _id: '$supplier_id',
            total_inventory_value: { $sum: { $multiply: ['$quantity', '$price'] } },
            items: { $push: '$$ROOT' }
            }
        },
        {
            // Join with the Suppliers collection to get the name and city
            $lookup: {
            from: 'suppliers', // Mongoose automatically lowercases and pluralizes collection names
            localField: '_id',
            foreignField: '_id',
            as: 'supplier_details'
            }
        },
        // Deconstruct the array created by $lookup
        { $unwind: '$supplier_details' },
        {
            // Sort by total inventory value descending
            $sort: { total_inventory_value: -1 }
        },
        {
            // Format the final output
            $project: {
            _id: 0,
            supplier: {
                id: '$supplier_details._id',
                name: '$supplier_details.name',
                city: '$supplier_details.city'
            },
            total_inventory_value: 1,
            items: 1
            }
        }
        ]);

        res.status(200).json(groupedInventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});