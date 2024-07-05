const invitationTemplate = (url) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited to Join PGI!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 10px 0; background-color: #007bff; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">You're Invited to Join PGI!</h1>
        </div>
        <div style="padding: 20px;">
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">We're excited to invite you to join PGI, the leading workforce management platform. With PGI, you can streamline your scheduling, track time and attendance, and manage your workforce with ease.</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">Click the link below to get started:</p>
            <p style="text-align: center;"><a href=${url} style="display: inline-block; width: 200px; margin: 20px auto; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-size: 18px;">Join PGI</a></p>
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@PGI.com">support@PGI.com</a>.</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">We look forward to having you on board!</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">Best regards,</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333333;">The PGI Team</p>
        </div>
        <div style="text-align: center; padding: 10px 0; background-color: #f4f4f4; color: #666666; font-size: 14px;">
            <p>&copy; 2024 PGI. All rights reserved.</p>
            <p><a href="https://PGI.com" style="color: #007bff;">PGI.com</a></p>
        </div>
    </div>
</body>
</html>

`;

module.exports = { invitationTemplate };
