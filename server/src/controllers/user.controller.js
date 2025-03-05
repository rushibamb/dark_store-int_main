// src/controller/user.controller.js
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OrderModel from '../models/order.model.js'; // Import OrderModel
import UserModel from '../models/user.model.js';
import WarehouseModel from '../models/warehouse.model.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import genertedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageClodinary from '../utils/uploadImageClodinary.js';

// Register User Controller
export async function registerUserController(request, response) {
    try {
        const {
            name,
            email,
            password
        } = request.body

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "provide email, name, password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({
            email
        })

        if (user) {
            return response.json({
                message: "Already register email",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        return response.json({
            message: "User register successfully",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Login controller
export async function loginController(request, response) {
    try {
        const {
            email,
            password
        } = request.body

        if (!email || !password) {
            return response.status(400).json({
                message: "provide email, password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({
            email
        })

        if (!user) {
            return response.status(400).json({
                message: "User not register",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        response.cookie('accessToken', accesstoken, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)

        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Logout controller
export async function logoutController(request, response) {
    try {
        const userid = request.userId //middleware

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie("accessToken", cookiesOption)
        response.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Upload user avatar
export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId // auth middlware
        const image = request.file // multer middleware

        const upload = await uploadImageClodinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return response.json({
            message: "upload profile",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Update user details
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId //auth middleware
        const {
            name,
            email,
            mobile,
            password
        } = request.body

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({
            _id: userId
        }, {
            ...(name && {
                name: name
            }),
            ...(email && {
                email: email
            }),
            ...(mobile && {
                mobile: mobile
            }),
            ...(password && {
                password: hashPassword
            })
        })

        return response.json({
            message: "Updated successfully",
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// Refresh token controler
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1] /// [ Bearer token]

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Get login user details
export async function userDetails(request, response) {
    try {
        const userId = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message: 'user details',
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false
        })
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Warehouse Management Controllers (Admin Only)
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Add a new warehouse
export async function addWarehouseController(request, response) {
    try {
        const {
            name,
            address,
            city,
            state,
            pincode,
            country
        } = request.body;

        // Verify user role is ADMIN
        if (request.user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Unauthorized: Only admins can add warehouses",
                error: true,
                success: false
            });
        }

        const newWarehouse = new WarehouseModel({
            name,
            address,
            city,
            state,
            pincode,
            country
        });
        const savedWarehouse = await newWarehouse.save();

        return response.status(201).json({
            message: "Warehouse added successfully",
            error: false,
            success: true,
            data: savedWarehouse
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Update a warehouse's details (Admin Only)
export async function updateWarehouseController(request, response) {
    try {
        const {
            warehouseId
        } = request.params;
        const updateData = request.body;

        // Verify user role is ADMIN
        if (request.user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Unauthorized: Only admins can update warehouses",
                error: true,
                success: false
            });
        }

        const updatedWarehouse = await WarehouseModel.findByIdAndUpdate(warehouseId, updateData, {
            new: true
        });

        if (!updatedWarehouse) {
            return response.status(404).json({
                message: "Warehouse not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Warehouse updated successfully",
            error: false,
            success: true,
            data: updatedWarehouse
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Assign a store manager to a warehouse (Admin Only)
export async function assignStoreManagerController(request, response) {
    try {
        const {
            warehouseId,
            storeManagerId
        } = request.body;

        // Verify user role is ADMIN
        if (request.user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Unauthorized: Only admins can assign store managers",
                error: true,
                success: false
            });
        }

        // Check if warehouse and user exist
        const warehouse = await WarehouseModel.findById(warehouseId);
        const storeManager = await UserModel.findById(storeManagerId);

        if (!warehouse || !storeManager) {
            return response.status(404).json({
                message: "Warehouse or Store Manager not found",
                error: true,
                success: false
            });
        }

        // Check if the user is a store manager
        if (storeManager.role !== 'STORE_MANAGER') {
            return response.status(400).json({
                message: "User is not a store manager",
                error: true,
                success: false
            });
        }

        // Assign the store manager to the warehouse
        warehouse.storeManagers.push(storeManagerId);
        await warehouse.save();

        // Update the user's warehouse field
        storeManager.warehouse = warehouseId;
        await storeManager.save();

        return response.json({
            message: "Store Manager assigned to warehouse successfully",
            error: false,
            success: true,
            data: warehouse
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Store Manager Controllers (Store Manager Only)
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Update stock quantity in the warehouse
export async function updateStockQuantityController(request, response) {
    try {
        const {
            warehouseId,
            productId,
            quantity
        } = request.body;
        const managerId = request.userId; // Assuming you have middleware to get the logged-in user's ID

        // Verify user role is STORE_MANAGER
        if (request.user.role !== 'STORE_MANAGER') {
            return response.status(403).json({
                message: "Unauthorized: Only store managers can update stock quantity",
                error: true,
                success: false
            });
        }

        // Check if the user is assigned to the warehouse
        const warehouse = await WarehouseModel.findOne({
            _id: warehouseId,
            storeManagers: managerId
        });

        if (!warehouse) {
            return response.status(403).json({
                message: "Unauthorized: You are not assigned to this warehouse",
                error: true,
                success: false
            });
        }

        // Find the product in the warehouse and update the quantity
        const productIndex = warehouse.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) {
            return response.status(404).json({
                message: "Product not found in the warehouse",
                error: true,
                success: false
            });
        }

        warehouse.products[productIndex].quantity = quantity;
        await warehouse.save();

        return response.json({
            message: "Stock quantity updated successfully",
            error: false,
            success: true,
            data: warehouse
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Change shift of a store staff (Store Manager Only)
export async function changeStaffShiftController(request, response) {
    try {
        const {
            staffId,
            shift
        } = request.body;
        const managerId = request.userId; // Assuming you have middleware to get the logged-in user's ID

        // Verify user role is STORE_MANAGER
        if (request.user.role !== 'STORE_MANAGER') {
            return response.status(403).json({
                message: "Unauthorized: Only store managers can change staff shifts",
                error: true,
                success: false
            });
        }

        // Validate shift value
        if (!['Day', 'Night'].includes(shift)) {
            return response.status(400).json({
                message: "Invalid shift value. Must be 'Day' or 'Night'",
                error: true,
                success: false
            });
        }

        // Check if the staff is assigned to the same warehouse as the manager
        const staff = await UserModel.findOne({
            _id: staffId,
            role: 'STORE_STAFF',
            warehouse: request.user.warehouse // Assuming the manager's warehouse is stored in request.user
        });

        if (!staff) {
            return response.status(404).json({
                message: "Staff not found or not assigned to the same warehouse",
                error: true,
                success: false
            });
        }

        // Update the staff's shift
        staff.shift = shift;
        await staff.save();

        return response.json({
            message: "Staff shift updated successfully",
            error: false,
            success: true,
            data: staff
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Store Staff Controllers (Store Staff Only)
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Update order preparation status (Store Staff Only)
export async function updateOrderPreparationStatusController(request, response) {
    try {
        const {
            orderId,
            status
        } = request.body; // Status can be "Pending", "Packing", "Completed"
        const staffId = request.userId; // Assuming you have middleware to get the logged-in user's ID

        // Verify user role is STORE_STAFF
        if (request.user.role !== 'STORE_STAFF') {
            return response.status(403).json({
                message: "Unauthorized: Only store staff can update order preparation status",
                error: true,
                success: false
            });
        }

        // Validate status value
        if (!['Pending', 'Packing', 'Completed'].includes(status)) {
            return response.status(400).json({
                message: "Invalid status value. Must be 'Pending', 'Packing', or 'Completed'",
                error: true,
                success: false
            });
        }

        // Find the order
        const order = await OrderModel.findById({
            _id: orderId
        });

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Update the order's status (add a field for order preparation status in your Order model)
        order.preparation_status = status;
        await order.save();

        return response.json({
            message: "Order preparation status updated successfully",
            error: false,
            success: true,
            data: order
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Decrease stock level after a sale (Store Staff Only)
export async function decreaseStockLevelController(request, response) {
    try {
        const {
            productId,
            quantity
        } = request.body;
        const staffId = request.userId; // Assuming you have middleware to get the logged-in user's ID

        // Verify user role is STORE_STAFF
        if (request.user.role !== 'STORE_STAFF') {
            return response.status(403).json({
                message: "Unauthorized: Only store staff can decrease stock level",
                error: true,
                success: false
            });
        }

        // Find the warehouse the staff is assigned to
        const warehouse = await WarehouseModel.findOne({
            storeStaff: staffId
        });

        if (!warehouse) {
            return response.status(403).json({
                message: "Unauthorized: You are not assigned to any warehouse",
                error: true,
                success: false
            });
        }

        // Find the product in the warehouse and decrease the quantity
        const productIndex = warehouse.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) {
            return response.status(404).json({
                message: "Product not found in the warehouse",
                error: true,
                success: false
            });
        }

        if (warehouse.products[productIndex].quantity < quantity) {
            return response.status(400).json({
                message: "Not enough stock",
                error: true,
                success: false
            });
        }

        warehouse.products[productIndex].quantity -= quantity;
        await warehouse.save();

        return response.json({
            message: "Stock level decreased successfully",
            error: false,
            success: true,
            data: warehouse
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
