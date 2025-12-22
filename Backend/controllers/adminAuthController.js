import { Admin } from '../models/Admin.js';

// Initialize Admin if table is empty
const seedAdmin = async () => {
    const count = await Admin.countDocuments();
    if (count === 0) {
        await Admin.create({ username: 'admin', password: 'admin@123', secretKey: '1234567' });
    }
};
seedAdmin();

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username, password });
        if (admin) res.json({ success: true, username: admin.username });
        else res.status(401).json({ success: false });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const verifySession = async (req, res) => {
    const { username } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (admin) res.json({ success: true });
        else res.status(401).json({ success: false });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const verifySecret = async (req, res) => {
    const { key } = req.body;
    try {
        const admin = await Admin.findOne({ secretKey: key });
        if (admin) res.json({ success: true });
        else res.status(401).json({ success: false });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const updateAdminConfig = async (req, res) => {
    const { newUsername, newPassword } = req.body;
    try {
        await Admin.findOneAndUpdate({}, { username: newUsername, password: newPassword });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};