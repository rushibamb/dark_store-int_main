// src/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refresh_token: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [{
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    }],
    shopping_cart: [{
        type: mongoose.Schema.ObjectId,
        ref: 'cartProduct'
    }],
    orderHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'order'
    }],
    role: {
        type: String,
        enum: ['ADMIN', "USER", "STORE_MANAGER", "STORE_STAFF"],
        default: "USER"
    },
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'warehouse' // Reference to the Warehouse model
    },
    shift: {
        type: String,
        enum: ['Day', 'Night'],
        default: 'Day' // Default shift
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model("User", userSchema)

export default UserModel
