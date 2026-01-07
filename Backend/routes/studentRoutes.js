import express from 'express';
import {
  getStudentFullRegistry,
  updateStudentRegistry,
  deleteStudent,
  getStudentRegistry,
  addAttendanceSession,
  getAttendanceStatistics,
  bulkUpdateVehicleCategory,
  getMyStudentData
} from '../controllers/studentDataController.js';

const router = express.Router();

// Get all student data for the UI
router.get('/full-registry', getStudentFullRegistry);

// Update student registry (compatible with UI)
router.put('/update-registry', updateStudentRegistry);

// Delete student
router.delete('/delete/:id', deleteStudent);

// Get specific registry
router.get('/registry/:id', getStudentRegistry);

// Add attendance session
router.post('/:userId/attendance', addAttendanceSession);

// Get statistics
router.get('/statistics', getAttendanceStatistics);

// Bulk operations
router.put('/bulk/update-category', bulkUpdateVehicleCategory);

// Add to your routes
router.get('/my-data/:userId', getMyStudentData);

export default router;