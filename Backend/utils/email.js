import nodemailer from 'nodemailer';

// Create the transporter using your Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'swarajcn774@gmail.com',
        // Use the 16-character App Password from Google, NOT your normal password
        pass: '8590053568Ss' 
    }
});

export const sendAdminNotification = async (userData) => {
    const mailOptions = {
        from: '"Driving School System" <swarajcn774@gmail.com>',
        to: 'swarajcn774@gmail.com', 
        subject: `🚀 New Student Joined: ${userData.fullName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Student Registration</h2>
                <p>A new user has just signed up for your driving school.</p>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Full Name:</strong> ${userData.fullName}</p>
                    <p><strong>Email Address:</strong> ${userData.email}</p>
                    <p><strong>User ID:</strong> ${userData._id}</p>
                    <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <p style="color: #64748b; font-size: 12px;">This is an automated security alert from your Driving School Registry.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification email sent');
    } catch (error) {
        console.error('❌ Email error:', error);
    }
};