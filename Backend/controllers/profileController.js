import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'diclwczg0', 
  api_key: '956446134452187', 
  api_secret: 'PY17B1O48VuTA5mbWFgCvRAa1HQ' 
});

export const getFullProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        const profile = await Profile.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user, profile });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const updateFullAccount = async (req, res) => {
    const { userId, fullName, password, phoneNumber, address, location, profileImage } = req.body;
    try {
        // 1. Update User Collection
        const userUpdate = { fullName };
        if (password && password.trim() !== "") userUpdate.password = password; 
        await User.findByIdAndUpdate(userId, userUpdate);

        // 2. Cloudinary Logic
        let imageUrl = profileImage;
        if (profileImage && profileImage.startsWith('data:image')) {
            const upload = await cloudinary.uploader.upload(profileImage, { folder: 'johns_driving' });
            imageUrl = upload.secure_url;
        }

        // 3. Update Profile Collection
        const profile = await Profile.findOneAndUpdate(
            { userId },
            { phoneNumber, address, location, profileImage: imageUrl, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json({ success: true, profile, user: { fullName } });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        await Profile.findOneAndDelete({ userId });
        res.json({ success: true, message: "Data wiped successfully" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};