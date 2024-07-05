const errorMessages = {
    // Common errors
    InvalidData: 'Invalid data provided',
    NotFound: 'Resource not found',
    SomethingWrong: 'Something went wrong!',
    Unauthorized: 'You are not allowed to access this route!',
    Invitation: {
       
        AlreadyInvited:"Already Invited",
        InvalidEmails: 'Invalid email addresses provided',
        NotFound: 'Invitation not found',
        SendFailure: 'Failed to send invitation',
        AlreadyExists: 'Invitation already exists',
        ProvideAllFields: 'Please provide all required fields',
        InvalidDaysValue: 'Invalid value for days of holidays',
    },
    PayRunSchedule: {
        NotFound: 'Pay Run Schedule not found',
        Create: 'Failed to create Pay Run Schedule',
        Update: 'Failed to update Pay Run Schedule',
        Delete: 'Failed to delete Pay Run Schedule',
        AlreadyExists: 'Pay Run Schedule already exists',
    },
    // Role-specific errors
    Role: {
        Create: 'Failed to create role',
        Update: 'Failed to update role',
        Delete: 'Failed to delete role',
        NotFound: 'Role not found',
        RoleTypeExists: 'Role type already exists',
        AlreadyAssigned: "Role Already Assigned",
        AlreadyExist: "Role already Exist",
        NotFound: "Role not found"
    },
    
    // Client-specific errors
    Client: {
        AlreadyExist: "Client already Exist",
        NotFound: "Client not found"
    },
    
    // Location-specific errors
    Location: {
        AlreadyExist: "Location already Exist",
        NotFound: "Location not found"
    },
    
    // User-specific errors
    User: {
        Login: 'Invalid Password',
        Register: 'User Signed Up Successfully',
        EmailExists: 'Email already exists',
        PhoneNumberExists: 'Phone number already exists',
        UserNameExists: 'User name already exists',
        InvalidUserData: 'Invalid User data',
        InvalidAccessToken: 'Invalid access token provided',
        IncorrectUserData: 'Incorrect User Email/password',
        IncorrectUserCode: 'Incorrect User Code',
        NotFound: 'User not found',
        IncorrectPassword: 'Incorrect password',
        NotFoundAssign: 'Assign User ID not found',
        EmailAlreadyExists: 'User already exists with this email',
        TokeAndPasswordNotProvided: "Token/Password not Provided",
        TokenExpired: "Token Has Expired, Contact Support!",
        FailedToVerify: "Failed To Verify User, Invalid Token",
        UserDetailNotFound: "User Details Not Found",
        TokenNotProvided: "Token not provided",
    },
    
    // Organization-specific errors
    Organization: {
        Create: 'Failed to create organization',
        Update: 'Failed to update organization',
        Delete: 'Failed to delete organization',
        NotFound: 'Organization not found',
        NameExists: 'Organization name already exists',
        DescriptionMissing: 'Description is required',
    },
    
    // Profile-specific errors
    Profile: {
        Create: 'Failed to create profile',
        Update: 'Failed to update profile',
        Delete: 'Failed to delete profile',
        NotFound: 'Profile not found',
        CnicExists: 'Profile with this CNIC already exists',
        EmailExists: 'Profile with this email already exists',
        PhoneNumberExists: 'Profile with this phone number already exists',
        UserIdMissing: 'User ID is required for profile',
    },
    
    // Position-specific errors
    Position: {
        Create: 'Failed to create position',
        Update: 'Failed to update position',
        Delete: 'Failed to delete position',
        NotFound: 'Position not found',
        AlreadyAssigned: 'Position already assigned',
    },
    
    // ActivePayRunSchedule-specific errors
    ActivePayRunSchedule: {
        Create: 'Failed to create active pay run schedule',
        Update: 'Failed to update active pay run schedule',
        Delete: 'Failed to delete active pay run schedule',
        NotFound: 'Active pay run schedule not found',
    },
    
    // Payroll-specific errors
    Payroll: {
        Create: 'Failed to create payroll',
        Update: 'Failed to update payroll',
        Delete: 'Failed to delete payroll',
        NotFound: 'Payroll not found',
    },
    
    // Absences-specific errors
    Absences: {
        Create: 'Failed to create absence',
        Update: 'Failed to update absence',
        Delete: 'Failed to delete absence',
        NotFound: 'Absence not found',
    },
    
    // ShiftPatterns-specific errors
    ShiftPatterns: {
        Create: 'Failed to create shift pattern',
        Update: 'Failed to update shift pattern',
        Delete: 'Failed to delete shift pattern',
        NotFound: 'Shift pattern not found',
    },
    
    // Forms-specific errors
    Forms: {
        Create: 'Failed to create form',
        Update: 'Failed to update form',
        Delete: 'Failed to delete form',
        NotFound: 'Form not found',
    },
    
    // Securityguard-specific errors
    Securityguard: {
        Create: 'Failed to create security guard',
        Update: 'Failed to update security guard',
        Delete: 'Failed to delete security guard',
        NotFound: 'Security guard not found',
    },
    
    // Availability-specific errors
    Availability: {
        Create: 'Failed to create availability',
        Update: 'Failed to update availability',
        Delete: 'Failed to delete availability',
        NotFound: 'Availability not found',
    },
    
    // Calendar-specific errors
    Calendar: {
        Create: 'Failed to create calendar',
        Update: 'Failed to update calendar',
        Delete: 'Failed to delete calendar',
        NotFound: 'Calendar not found',
    },
    
    // Schedule-specific errors
    Schedule: {
        Create: 'Failed to create schedule',
        Update: 'Failed to update schedule',
        Delete: 'Failed to delete schedule',
        NotFound: 'Schedule not found',
    },
    
    // Breakperiod-specific errors
    Breakperiod: {
        Create: 'Failed to create break period',
        Update: 'Failed to update break period',
        Delete: 'Failed to delete break period',
        NotFound: 'Break period not found',
    },
    
    // LiveTracking-specific errors
    LiveTracking: {
        Create: 'Failed to create live tracking',
        Update: 'Failed to update live tracking',
        Delete: 'Failed to delete live tracking',
        NotFound: 'Live tracking not found',
    },
    
    // Latitude-specific errors
    Latitude: {
        Create: 'Failed to create latitude',
        Update: 'Failed to update latitude',
        Delete: 'Failed to delete latitude',
        NotFound: 'Latitude not found',
    },
    
    // Longitude-specific errors
    Longitude: {
        Create: 'Failed to create longitude',
        Update: 'Failed to update longitude',
        Delete: 'Failed to delete longitude',
        NotFound: 'Longitude not found',
    },
    
    // Report-specific errors
    Report: {
        Create: 'Failed to create report',
        Update: 'Failed to update report',
        Delete: 'Failed to delete report',
        NotFound: 'Report not found',
    },
    
    // Documents-specific errors
    Documents: {
        Create: 'Failed to create document',
        Update: 'Failed to update document',
        Delete: 'Failed to delete document',
        NotFound: 'Document not found',
    },
    
    authMiddleWareErrorMessages: {
        InValidToken: "Invalid token",
        TokenNotFound: "Token not Found"
    }
};
module.exports = errorMessages;
