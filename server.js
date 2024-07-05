const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('dev'));
// Cor's Option

const corsOptions = {
  origin: '*',
  'Access-Controll-Allow-Origin': '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to handle JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Api is running' });
});
// Import routes
const profileRoutes = require('./routes/profileRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const clientRoutes = require('./routes/clientRoutes');
const locationRoutes = require('./routes/locationRoutes');
const roleRoutes = require('./routes/roleRoutes');
const absenceRoutes = require('./routes/absencesRoutes');
const shiftPattern = require('./routes/patternRoutes');
const document = require('./routes/documentsRoutes');
const positionRoutes = require('./routes/positionRoutes');
const userRoutes = require('./routes/userRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const payRuleScheduleRoutes = require('./routes/payRuleScheduleRoutes');
const geoOffencingRoutes = require('./routes/geoofencingRoutes');
const internalNotes = require('./routes/internalNotesRoutes');
// Use routes
app.use('/api/organizations', asyncHandler(organizationRoutes));
app.use('/api/profile', asyncHandler(profileRoutes));
app.use('/api/client', asyncHandler(clientRoutes));
app.use('/api/location', asyncHandler(locationRoutes));
app.use('/api/role', asyncHandler(roleRoutes));
app.use('/api/absence', asyncHandler(absenceRoutes));
app.use('/api/shiftPatterns', asyncHandler(shiftPattern));
app.use('/api/document', asyncHandler(document));
app.use('/api/position', asyncHandler(positionRoutes));
app.use('/api/user', asyncHandler(userRoutes));
app.use('/api/invite', asyncHandler(invitationRoutes));
app.use('/api/payrule', asyncHandler(payRuleScheduleRoutes));
app.use('/api/geoofence', asyncHandler(geoOffencingRoutes));
app.use('/api/internalNotes', asyncHandler(internalNotes));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
