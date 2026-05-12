export type Role = 'Agent' | 'Landlord' | 'Home_Seeker' | 'Admin';

export type Permission = 'VIEW_DASHBOARD' | 'MANAGE_PROPERTIES' | 'VIEW_PROFILE' | 'MANAGE_USERS';

export type AppRoute = {
  path: string;
  title?: string;
  public?: boolean; // no auth required
  roles?: Role[]; // allowed roles
  permissions?: Permission[]; // advanced permission system
  defaultRedirect?: boolean; // role landing page
  showInNaBar?: boolean;
};

export const publicRoutes: AppRoute[] = [
  /* ================= PUBLIC ================= */
  {
    title: 'Login',
    path: '/login',
    public: true,
  },
  {
    title: 'Signup',
    path: '/signup',
    public: true,
  },
  {
    title: 'Reset password',
    path: '/reset-password',
    public: true,
  },
  {
    title: 'Otp verification',
    path: '/otp-verification',
    public: true,
  },
  {
    title: 'Onboarding',
    path: '/onboarding',
    public: true,
  },
  {
    title: 'Otp Email',
    path: '/otp-email',
    public: true,
  },
  {
    title: 'forgotpassword',
    path: '/forgotpassword',
    public: true,
  },
  {
    title: 'Oauth successpage',
    path: '/oAuth-success-page',
    public: true,
  },
  {
    title: 'forgot password otp',
    path: '/forgot-password-otp',
    public: true,
  },
  {
    title: 'Password recovery',
    path: '/password-recovery',
    public: true,
  },
  {
    title: 'Email sent',
    path: '/email-sent',
    public: true,
  },
  {
    path: '/',
    title: 'Home',
    defaultRedirect: true,
    showInNaBar: true,
    public: true,
  },
];

export const sharedRoutes: AppRoute[] = [
  /* ================= DEFAULT LANDING ================= */
  {
    path: '/',
    title: 'Home',
    defaultRedirect: true,
    showInNaBar: true,
    public: true,
  },
  {
    path: '/property',
    title: 'Property',
    roles: ['Home_Seeker', 'Agent', 'Landlord', 'Admin'],
    defaultRedirect: true,
    showInNaBar: true,
  },
  {
    title: 'List your property',
    path: '/list-properties',
    roles: ['Agent', 'Admin', 'Landlord'],
    defaultRedirect: true,
    showInNaBar: true,
  },
  {
    title: 'Add new Property',
    path: '/agent/add-property',
    roles: ['Agent', 'Admin', 'Landlord'],
  },
  {
    path: '/landlord/dashboard',
    roles: ['Landlord'],
    defaultRedirect: true,
  },
];

export const commonProtectedRoutes: AppRoute[] = [
  {
    path: '/verification',
    roles: ['Home_Seeker', 'Agent'],
    title: 'verification',
    permissions: ['VIEW_PROFILE'],
  },
  {
    path: '/profile',
    roles: ['Agent', 'Landlord', 'Home_Seeker'],
    permissions: ['VIEW_PROFILE'],
  },
];

export const agentRoutes: AppRoute[] = [
  /* ================= ROLE BASED ================= */
  {
    path: '/property-advisory',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Property Advisory',
    showInNaBar: true,
  },
  {
    path: '/agent/agreement',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Agent Agreement',
  },
  {
    path: '/agent/private',
    roles: ['Agent', 'Admin', 'Landlord'],
    title: 'Agent Private',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },

  {
    path: '/agent/profile',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Agent Private',
    permissions: ['VIEW_PROFILE'],
  },

  {
    path: '/agent/request',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Agent Private',
    permissions: ['VIEW_PROFILE'],
  },
];

export const homeSeekerRoutes: AppRoute[] = [
  {
    path: '/house-seeker/profile',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'House Seeker Profile',
    permissions: ['VIEW_PROFILE'],
  },
  {
    path: '/payment/',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Payment',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },
  {
    path: '/payment/success',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Payent success',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },
  {
    path: '/payment/complete/',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Payment complete',
    permissions: ['VIEW_PROFILE'],
  },
  {
    path: '/payment-tour',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Payment',
    permissions: ['VIEW_PROFILE'],
  },
  {
    path: '/payment-tour/success',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Payent success',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },
  {
    path: '/payment-tour/complete',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Payment complete',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },
  {
    path: '/property/',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Property details',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },
  {
    path: '/property/escrow',
    roles: ['Agent', 'Admin', 'Landlord', 'Home_Seeker'],
    title: 'Property Escrow',
    permissions: ['MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  },
];

export const landlordRoutes: AppRoute[] = [
  {
    path: '/kyc/add-property',
    roles: ['Agent', 'Admin', 'Landlord'],
    title: 'Add Property',
    permissions: ['MANAGE_PROPERTIES'],
  },
  {
    path: '/kyc/add-property-details',
    roles: ['Agent', 'Admin', 'Landlord'],
    title: 'Add Property Details',
    permissions: ['MANAGE_PROPERTIES'],
  },
  {
    path: '/kyc',
    roles: ['Agent', 'Admin', 'Landlord'],
    title: 'Kyc',
    permissions: ['MANAGE_PROPERTIES'],
  },
];

export const adminRoutes: AppRoute[] = [
  {
    path: '/admin',
    roles: ['Admin'],
    permissions: ['MANAGE_USERS'],
  },
];

export const appRoutes: AppRoute[] = [
  ...publicRoutes,
  ...sharedRoutes,
  ...commonProtectedRoutes,
  ...agentRoutes,
  ...homeSeekerRoutes,
  ...landlordRoutes,
  ...adminRoutes,
];

export function getDefaultRouteForRole(role: Role) {
  const route = appRoutes.find((r) => r.roles?.includes(role) && r.defaultRedirect);

  return route?.path ?? '/';
}

export const rolePermissions: Record<Role, Permission[]> = {
  Agent: ['VIEW_DASHBOARD', 'MANAGE_PROPERTIES', 'VIEW_PROFILE'],
  Landlord: ['VIEW_DASHBOARD', 'VIEW_PROFILE'],
  Home_Seeker: ['VIEW_DASHBOARD', 'VIEW_PROFILE'],
  Admin: [],
};
