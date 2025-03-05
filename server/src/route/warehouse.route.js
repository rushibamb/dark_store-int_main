// src/route/warehouse.route.js
import {
    Router
} from 'express';
import {
    addWarehouseController,
    assignStoreManagerController,
    changeStaffShiftController,
    decreaseStockLevelController,
    updateOrderPreparationStatusController,
    updateStockQuantityController,
    updateWarehouseController
} from '../controllers/user.controller.js';
import {
    admin
} from '../middleware/Admin.js';
import auth from '../middleware/auth.js';

const warehouseRouter = Router();

// Admin routes
warehouseRouter.post('/add-warehouse', auth, admin, addWarehouseController);
warehouseRouter.put('/update-warehouse/:warehouseId', auth, admin, updateWarehouseController);
warehouseRouter.post('/assign-store-manager', auth, admin, assignStoreManagerController);

// Store Manager routes
warehouseRouter.put('/update-stock-quantity', auth, updateStockQuantityController);
warehouseRouter.put('/change-staff-shift', auth, changeStaffShiftController);

// Store Staff routes
warehouseRouter.put('/update-order-preparation-status', auth, updateOrderPreparationStatusController);
warehouseRouter.put('/decrease-stock-level', auth, decreaseStockLevelController);

export default warehouseRouter;
