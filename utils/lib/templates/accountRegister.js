const accountRegisterTemplate = (email, password) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Details</title>
</head>
<body>
    <p>Hi,</p>
    <p>Your account has been set up for you, and you can now log in to your company administration area using the details below:</p>
    <hr>
    <p>Your domain: <a href="https://pgi.com">yourdomain.com</a></p>
    <p>Email: ${email}</p>
    <p>Password: ${password}</p>
    <p>Team name: yourteam</p>
    <hr>
    <p><a href="https://pgi.com/login">Start by Logging in here</a></p>
    <p>Need help?</p>
    <p>Our <a href="https://support.pgi.com">Support Centre</a> includes everything you need to know to get set up.</p>
    <p>If you have any further questions, please don't hesitate to email us at <a href="mailto:support@pgi.com">support@yourdomain.com</a>.</p>
    <p>Sincerely,</p>
    <p>Your Team</p>
</body>
</html>
`;

module.exports = { accountRegisterTemplate };
