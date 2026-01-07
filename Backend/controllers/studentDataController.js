import { StudentRegistry } from '../models/StudentRegistry.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Payment } from '../models/Payment.js';

// Get full registry data
export const getStudentFullRegistry = async (req, res) => {
  try {
    console.log('Fetching full registry data...');
    
    // Get all data from different collections
    const [users, profiles, payments, registries] = await Promise.all([
      User.find().lean(),
      Profile.find().lean(),
      Payment.find().lean(),
      StudentRegistry.find().lean()
    ]);

    console.log(`Found: ${users.length} users, ${profiles.length} profiles, ${payments.length} payments, ${registries.length} registries`);

    // Combine data for each student
    const combinedData = users.map(user => {
      const profile = profiles.find(p => p.userId && p.userId.toString() === user._id.toString());
      const payment = payments.find(p => p.userId && p.userId.toString() === user._id.toString());
      const registry = registries.find(r => r.userId && r.userId.toString() === user._id.toString());

      return {
        _id: user._id,
        fullName: user.fullName || '',
        phoneNumber: profile?.phoneNumber || profile?.phone || user.phoneNumber || '',
        dob: profile?.dob || '',
        appNumber: registry?.applicationNumber || profile?.appNumber || '',
        
        // From registry
        vehicleCategory: registry?.vehicleCategory || payment?.vehicleCategory || 'four-wheeler',
        llDate: registry?.testDates?.llDate || '',
        dlDate: registry?.testDates?.dlDate || '',
        validity: registry?.licenseValidity || '',
        
        // Sessions from registry
        sessions: registry?.attendanceSessions?.map(session => ({
          _id: session._id,
          date: session.date,
          ground: session.ground || 0,
          simulation: session.simulation || 0,
          road: session.road || 0,
          vehicleType: session.vehicleType || registry?.vehicleCategory
        })) || [],
        
        // Financials
        paidAmount: payment?.paidAmount || 0,
        remainingAmount: payment?.remainingAmount || 0,
        
        // Registry stats
        attendanceStats: registry?.attendanceStats || {},
        status: registry?.status || 'active',
        
        // Timestamps
        createdAt: user.createdAt || new Date(),
        updatedAt: registry?.updatedAt || user.updatedAt || new Date()
      };
    });

    console.log('Combined data ready, sending response...');
    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching full registry:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update student registry
export const updateStudentRegistry = async (req, res) => {
  const {
    id, // User ID
    studentName,
    phone,
    dob,
    appNumber,
    llDate,
    dlDate,
    validity,
    feePaid,
    balance,
    category,
    sessions
  } = req.body;

  console.log('📥 Received update request for user:', id);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if user exists
    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateTime = new Date();
    const updatePromises = [];

    // 1. Update User (name only)
    if (studentName && studentName !== userExists.fullName) {
      console.log(`Updating User name: ${studentName}`);
      updatePromises.push(
        User.findByIdAndUpdate(id, { 
          fullName: studentName,
          updatedAt: updateTime
        })
      );
    }

    // 2. Update Profile (phone and dob)
    if (phone !== undefined || dob !== undefined) {
      console.log(`Updating Profile: phone=${phone}, dob=${dob}`);
      updatePromises.push(
        Profile.findOneAndUpdate(
          { userId: id },
          { 
            phoneNumber: phone,
            phone: phone,
            dob: dob,
            updatedAt: updateTime
          },
          { 
            upsert: true,
            new: true,
            setDefaultsOnInsert: true 
          }
        )
      );
    }

    // 3. Update Payment (if provided)
    if (feePaid !== undefined || balance !== undefined) {
      console.log(`Updating Payment: feePaid=${feePaid}, balance=${balance}`);
      updatePromises.push(
        Payment.findOneAndUpdate(
          { userId: id },
          {
            paidAmount: Number(feePaid) || 0,
            remainingAmount: Number(balance) || 0,
            totalAmount: (Number(feePaid) || 0) + (Number(balance) || 0),
            vehicleCategory: category || 'four-wheeler',
            updatedAt: updateTime
          },
          { 
            upsert: true,
            new: true 
          }
        )
      );
    }

    // 4. Update Student Registry
    let registry = await StudentRegistry.findOne({ userId: id });
    console.log(`Registry found: ${!!registry}`);

    if (registry) {
      // Update existing registry
      console.log('Updating existing registry...');
      if (appNumber && appNumber !== registry.applicationNumber) {
        registry.applicationNumber = appNumber;
      }
      if (category && category !== registry.vehicleCategory) {
        registry.vehicleCategory = category;
      }
      
      // Update test dates
      if (llDate || dlDate) {
        registry.testDates = {
          llDate: llDate || registry.testDates?.llDate || null,
          dlDate: dlDate || registry.testDates?.dlDate || null
        };
      }
      
      // Update license validity
      if (validity) {
        registry.licenseValidity = validity;
      }
      
      // Update financial summary
      registry.financialSummary = {
        totalFee: (Number(feePaid) || registry.financialSummary?.feePaid || 0) + 
                 (Number(balance) || registry.financialSummary?.balance || 0),
        feePaid: Number(feePaid) || registry.financialSummary?.feePaid || 0,
        balance: Number(balance) || registry.financialSummary?.balance || 0
      };
      
      // Update sessions if provided
      if (sessions && Array.isArray(sessions)) {
        console.log(`Updating ${sessions.length} sessions`);
        registry.attendanceSessions = sessions.map(session => ({
          date: session.date || new Date(),
          ground: Number(session.ground) || 0,
          simulation: Number(session.simulation) || 0,
          road: Number(session.road) || 0,
          vehicleType: session.vehicleType || category || registry.vehicleCategory || 'four-wheeler'
        }));
      }
      
      registry.updatedAt = updateTime;
      updatePromises.push(registry.save());
    } else {
      // Create new registry if doesn't exist
      console.log('Creating new registry...');
      registry = new StudentRegistry({
        userId: id,
        applicationNumber: appNumber || `APP-${Date.now()}`,
        vehicleCategory: category || 'four-wheeler',
        testDates: {
          llDate: llDate || null,
          dlDate: dlDate || null
        },
        licenseValidity: validity || null,
        financialSummary: {
          totalFee: (Number(feePaid) || 0) + (Number(balance) || 0),
          feePaid: Number(feePaid) || 0,
          balance: Number(balance) || 0
        },
        attendanceSessions: (sessions || []).map(session => ({
          date: session.date || new Date(),
          ground: Number(session.ground) || 0,
          simulation: Number(session.simulation) || 0,
          road: Number(session.road) || 0,
          vehicleType: session.vehicleType || category || 'four-wheeler'
        })),
        status: 'active',
        createdBy: req.user?._id
      });
      updatePromises.push(registry.save());
    }

    // Execute all updates
    await Promise.all(updatePromises);
    
    console.log('✅ All updates completed successfully');

    res.status(200).json({
      message: "Registry updated successfully",
      registryId: registry._id,
      updatedAt: updateTime.toISOString(),
      changes: {
        user: studentName ? 'updated' : 'unchanged',
        profile: phone || dob ? 'updated' : 'unchanged',
        payment: feePaid !== undefined || balance !== undefined ? 'updated' : 'unchanged',
        registry: 'updated',
        sessions: sessions ? `updated (${sessions.length} sessions)` : 'unchanged'
      }
    });
  } catch (error) {
    console.error('❌ Error updating registry:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.errors || 'Check server logs for more information'
    });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting student with ID:', id);
    
    // Delete from all collections
    const [userDeleted, profileDeleted, paymentDeleted, registryDeleted] = await Promise.all([
      User.findByIdAndDelete(id),
      Profile.findOneAndDelete({ userId: id }),
      Payment.findOneAndDelete({ userId: id }),
      StudentRegistry.findOneAndDelete({ userId: id })
    ]);
    
    const result = {
      user: !!userDeleted,
      profile: !!profileDeleted,
      payment: !!paymentDeleted,
      registry: !!registryDeleted
    };
    
    console.log('Deletion result:', result);
    
    res.status(200).json({ 
      message: "Student deleted successfully",
      deleted: result
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get specific student registry
export const getStudentRegistry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const registry = await StudentRegistry.findOne({ userId: id })
      .populate('userId', 'fullName')
      .populate('createdBy updatedBy', 'fullName');
    
    if (!registry) {
      return res.status(404).json({ error: 'Registry not found' });
    }
    
    res.status(200).json(registry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add attendance session
export const addAttendanceSession = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, ground, simulation, road, vehicleType } = req.body;
    
    const registry = await StudentRegistry.findOne({ userId });
    
    if (!registry) {
      return res.status(404).json({ error: 'Registry not found' });
    }
    
    const session = {
      date: date || new Date(),
      ground: Number(ground) || 0,
      simulation: Number(simulation) || 0,
      road: Number(road) || 0,
      vehicleType: vehicleType || registry.vehicleCategory
    };
    
    registry.attendanceSessions.push(session);
    await registry.save();
    
    res.status(200).json({
      message: 'Attendance session added successfully',
      session: session,
      registryId: registry._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance statistics
export const getAttendanceStatistics = async (req, res) => {
  try {
    const { startDate, endDate, vehicleCategory } = req.query;
    
    let query = {};
    
    if (vehicleCategory) {
      query.vehicleCategory = vehicleCategory;
    }
    
    const stats = await StudentRegistry.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$vehicleCategory',
          totalStudents: { $sum: 1 },
          totalGroundSessions: { $sum: '$attendanceStats.totalGroundSessions' },
          totalSimulationSessions: { $sum: '$attendanceStats.totalSimulationSessions' },
          totalRoadSessions: { $sum: '$attendanceStats.totalRoadSessions' },
          completedStudents: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          vehicleCategory: '$_id',
          totalStudents: 1,
          totalGroundSessions: 1,
          totalSimulationSessions: 1,
          totalRoadSessions: 1,
          completedStudents: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedStudents', { $max: ['$totalStudents', 1] }] },
              100
            ]
          }
        }
      }
    ]);
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk operations
export const bulkUpdateVehicleCategory = async (req, res) => {
  try {
    const { userIds, vehicleCategory } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs array is required' });
    }
    
    if (!vehicleCategory || !['four-wheeler', 'two-wheeler', 'heavy-vehicle', 'finished'].includes(vehicleCategory)) {
      return res.status(400).json({ error: 'Valid vehicle category is required' });
    }
    
    const result = await StudentRegistry.updateMany(
      { userId: { $in: userIds } },
      { $set: { vehicleCategory, updatedAt: new Date() } }
    );
    
    res.status(200).json({
      message: `Updated ${result.modifiedCount} students to ${vehicleCategory}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Add to your studentDataController.js
export const getMyStudentData = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Fetching data for user:', userId);
    
    // Get data from all collections for this specific user
    const [user, profile, payment, registry] = await Promise.all([
      User.findById(userId).lean(),
      Profile.findOne({ userId }).lean(),
      Payment.findOne({ userId }).lean(),
      StudentRegistry.findOne({ userId }).lean()
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Combine data similar to full registry but for single user
    const combinedData = {
      _id: user._id,
      fullName: user.fullName || '',
      phoneNumber: profile?.phoneNumber || profile?.phone || user.phoneNumber || '',
      dob: profile?.dob || '',
      email: user.email || '', // Add if available in User model
      appNumber: registry?.applicationNumber || profile?.appNumber || '',
      
      // From registry
      vehicleCategory: registry?.vehicleCategory || payment?.vehicleCategory || 'four-wheeler',
      llDate: registry?.testDates?.llDate || '',
      dlDate: registry?.testDates?.dlDate || '',
      validity: registry?.licenseValidity || '',
      
      // Sessions from registry
      sessions: registry?.attendanceSessions?.map(session => ({
        _id: session._id,
        date: session.date,
        ground: session.ground || 0,
        simulation: session.simulation || 0,
        road: session.road || 0,
        vehicleType: session.vehicleType || registry?.vehicleCategory
      })) || [],
      
      // Financials
      paidAmount: payment?.paidAmount || 0,
      remainingAmount: payment?.remainingAmount || 0,
      totalFee: (payment?.paidAmount || 0) + (payment?.remainingAmount || 0),
      
      // Registry stats
      attendanceStats: registry?.attendanceStats || {},
      status: registry?.status || 'active',
      
      // Timestamps
      createdAt: user.createdAt || new Date(),
      updatedAt: registry?.updatedAt || user.updatedAt || new Date()
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

