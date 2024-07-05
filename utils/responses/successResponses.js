const successMessages = {
  // Common success messages
  Create: 'Resource created successfully',
  Update: 'Resource updated successfully',
  Delete: 'Resource deleted successfully',
  Found: 'Resource found',
  AllFound: 'All resources retrieved successfully',
  DetailsRetrieved: 'Resource details retrieved successfully',
  Invitation: {
    Send: 'Invitation sent successfully',
    Delete: 'Invitation deleted successfully',
    Found: 'Invitation found',
    AllFound: 'All invitations retrieved successfully',
  },
  PayRunSchedule: {
    Create: 'Pay Run Schedule created successfully',
    Update: 'Pay Run Schedule updated successfully',
    Delete: 'Pay Run Schedule deleted successfully',
    Found: 'Pay Run Schedule found successfully',
    AllFound: 'All Pay Run Schedules retrieved successfully',
  },
  // Role-specific success messages
  Role: {
    Create: 'Role created successfully',
    Update: 'Role updated successfully',
    Delete: 'Role deleted successfully',
    Found: 'Role found',
    AllFound: 'All roles retrieved successfully',
    DetailsRetrieved: 'Role details retrieved successfully',
  },

  // Client-specific success messages
  Client: {
    Created: 'Client created successfully',
    Found: 'Client found successfully',
  },

  // Location-specific success messages
  Location: {
    Created: 'Location created successfully',
    Found: 'Location found successfully',
    Update: 'Location updated successfully',
    Delete: 'Location deleted successfully',
  },

  // User-specific success messages
  User: {
    Login: 'User Logged In Successfully',
    SignUp: 'User Signed Up Successfully',
    AdminRegister: 'Admin Signed Up Successfully',
    Delete: 'User Deleted Successfully',
    AllAdmins: 'All Admins found',
    PasswordChanged: 'Password changed successfully',
    AllUsers: 'All Users retrieved successfully',
    DeleteUserSuccess: 'User has been deleted successfully',
    ForgotPassword: 'Check your email/SMS for reset password link',
    UserNotFound: 'User not found',
    TokeAndPasswordNotProvided: 'Token/Password not provided',
    PasswordSetSuccessfully: 'Password set successfully',
    userVerified: 'User verified successfully',
    TokenSentSuccessfully: 'Token sent successfully via email',
    TokenExpired: 'Token expired!',
    BlogPublished: 'Blog successfully published',
  },

  // Organization-specific success messages
  Organization: {
    Create: 'Organization created successfully',
    Update: 'Organization updated successfully',
    Delete: 'Organization deleted successfully',
    Found: 'Organization found',
    AllFound: 'All organizations retrieved successfully',
    DetailsRetrieved: 'Organization details retrieved successfully',
  },

  // Profile-specific success messages
  Profile: {
    Create: 'Profile created successfully',
    Update: 'Profile updated successfully',
    Delete: 'Profile deleted successfully',
    Found: 'Profile found',
    AllFound: 'All profiles retrieved successfully',
    DetailsRetrieved: 'Profile details retrieved successfully',
  },

  // Position-specific success messages
  Position: {
    Create: 'Position created successfully',
    Update: 'Position updated successfully',
    Delete: 'Position deleted successfully',
    Found: 'Position found',
    AllFound: 'All positions retrieved successfully',
    DetailsRetrieved: 'Position details retrieved successfully',
    Assigned: 'Position assigned successfully',
  },

  // ActivePayRunSchedule-specific success messages
  ActivePayRunSchedule: {
    Create: 'Active pay run schedule created successfully',
    Update: 'Active pay run schedule updated successfully',
    Delete: 'Active pay run schedule deleted successfully',
    Found: 'Active pay run schedule found',
    AllFound: 'All active pay run schedules retrieved successfully',
    DetailsRetrieved: 'Active pay run schedule details retrieved successfully',
  },

  // Payroll-specific success messages
  Payroll: {
    Create: 'Payroll created successfully',
    Update: 'Payroll updated successfully',
    Delete: 'Payroll deleted successfully',
    Found: 'Payroll found',
    AllFound: 'All payrolls retrieved successfully',
    DetailsRetrieved: 'Payroll details retrieved successfully',
  },

  // Absences-specific success messages
  Absences: {
    Create: 'Absence created successfully',
    Update: 'Absence updated successfully',
    Delete: 'Absence deleted successfully',
    Found: 'Absence found',
    AllFound: 'All absences retrieved successfully',
    DetailsRetrieved: 'Absence details retrieved successfully',
  },

  // ShiftPatterns-specific success messages
  ShiftPatterns: {
    Create: 'Shift pattern created successfully',
    Update: 'Shift pattern updated successfully',
    Delete: 'Shift pattern deleted successfully',
    Found: 'Shift pattern found',
    AllFound: 'All shift patterns retrieved successfully',
    DetailsRetrieved: 'Shift pattern details retrieved successfully',
  },

  // Forms-specific success messages
  Forms: {
    Create: 'Form created successfully',
    Update: 'Form updated successfully',
    Delete: 'Form deleted successfully',
    Found: 'Form found',
    AllFound: 'All forms retrieved successfully',
    DetailsRetrieved: 'Form details retrieved successfully',
  },

  // Securityguard-specific success messages
  Securityguard: {
    Create: 'Security guard created successfully',
    Update: 'Security guard updated successfully',
    Delete: 'Security guard deleted successfully',
    Found: 'Security guard found',
    AllFound: 'All security guards retrieved successfully',
    DetailsRetrieved: 'Security guard details retrieved successfully',
  },

  // Availability-specific success messages
  Availability: {
    Create: 'Availability created successfully',
    Update: 'Availability updated successfully',
    Delete: 'Availability deleted successfully',
    Found: 'Availability found',
    AllFound: 'All availabilities retrieved successfully',
    DetailsRetrieved: 'Availability details retrieved successfully',
  },

  // Calendar-specific success messages
  Calendar: {
    Create: 'Calendar created successfully',
    Update: 'Calendar updated successfully',
    Delete: 'Calendar deleted successfully',
    Found: 'Calendar found',
    AllFound: 'All calendars retrieved successfully',
    DetailsRetrieved: 'Calendar details retrieved successfully',
  },

  // Schedule-specific success messages
  Schedule: {
    Create: 'Schedule created successfully',
    Update: 'Schedule updated successfully',
    Delete: 'Schedule deleted successfully',
    Found: 'Schedule found',
    AllFound: 'All schedules retrieved successfully',
    DetailsRetrieved: 'Schedule details retrieved successfully',
  },

  // Breakperiod-specific success messages
  Breakperiod: {
    Create: 'Break period created successfully',
    Update: 'Break period updated successfully',
    Delete: 'Break period deleted successfully',
    Found: 'Break period found',
    AllFound: 'All break periods retrieved successfully',
    DetailsRetrieved: 'Break period details retrieved successfully',
  },

  // LiveTracking-specific success messages
  LiveTracking: {
    Create: 'Live tracking created successfully',
    Update: 'Live tracking updated successfully',
    Delete: 'Live tracking deleted successfully',
    Found: 'Live tracking found',
    AllFound: 'All live trackings retrieved successfully',
    DetailsRetrieved: 'Live tracking details retrieved successfully',
  },

  // Latitude-specific success messages
  Latitude: {
    Create: 'Latitude created successfully',
    Update: 'Latitude updated successfully',
    Delete: 'Latitude deleted successfully',
    Found: 'Latitude found',
    AllFound: 'All latitudes retrieved successfully',
    DetailsRetrieved: 'Latitude details retrieved successfully',
  },

  // Longitude-specific success messages
  Longitude: {
    Create: 'Longitude created successfully',
    Update: 'Longitude updated successfully',
    Delete: 'Longitude deleted successfully',
    Found: 'Longitude found',
    AllFound: 'All longitudes retrieved successfully',
    DetailsRetrieved: 'Longitude details retrieved successfully',
  },

  // Report-specific success messages
  Report: {
    Create: 'Report created successfully',
    Update: 'Report updated successfully',
    Delete: 'Report deleted successfully',
    Found: 'Report found',
    AllFound: 'All reports retrieved successfully',
    DetailsRetrieved: 'Report details retrieved successfully',
  },

  // Documents-specific success messages
  Documents: {
    Create: 'Document created successfully',
    Update: 'Document updated successfully',
    Delete: 'Document deleted successfully',
    Found: 'Document found',
    AllFound: 'All documents retrieved successfully',
    DetailsRetrieved: 'Document details retrieved successfully',
  },

  authMiddleWareErrorMessages: {
    ValidToken: 'Token successfully validated',
  },
};
module.exports = successMessages;
