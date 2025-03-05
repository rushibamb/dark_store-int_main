// src/models/warehouse.model.js
import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Warehouse name is required"],
    },
    products: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'product'
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        },
        subCategory: {
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory'
        },
        quantity: {
            type: Number,
            default: 0
        }
    }],
    storeManagers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    storeStaff: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String
    },
    country: {
        type: String
    }
}, {
    timestamps: true
});

const WarehouseModel = mongoose.model('warehouse', warehouseSchema);

export default WarehouseModel;
