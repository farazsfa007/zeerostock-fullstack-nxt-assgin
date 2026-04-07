const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    supplier_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier', 
        required: true 
    },
    product_name: { type: String, required: true },
    quantity: { 
        type: Number, 
        required: true, 
        min: [0, 'Quantity must be 0 or greater'] 
    },
    price: { 
        type: Number, 
        required: true, 
        min: [0.01, 'Price must be greater than 0'] 
    }
});

module.exports = mongoose.model('Inventory', inventorySchema);