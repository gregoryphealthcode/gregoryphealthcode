export const navigation = [
  {
    text: 'Home',
    path: '/home',
    key: 'home',
    icon: 'falight fa-home',
    accessbit: 1,
    selected: true
  },
  {
    text: 'Patients',
    //icon: 'fad fa-user-injured',
    icon: 'hcicon hc-patients-people',
    path: '/patient-list',
    key: 'patient-list',
    hint: 'List Patients',
    accessbit: 1
  },
  {
    text: 'Contacts',
   // icon: 'fad fa-address-card',
    icon: 'hcicon hc-account-contactdetails',
    accessbit: 28,
    path: '/contacts/list-contacts',
    key: 'list-contacts'
  },
  {
    text: 'Accounts',
    // icon: 'fad fa-pound-sign',
    icon: 'hcicon hc-billing_invoicing',
    accessbit: 1,
    key: 'Accounts',
    items: [
      {
        text: 'New Invoice',
        key: 'accounts/invoice',
        icon: 'fad fa-money-bill-wave',
        path: 'accounts/invoice',
        accessbit: 1,
      },
      {
        text: 'To Be Invoiced',
        key: 'accounts/billing-list',
        icon: 'fad fa-hat-wizard',
        path: 'accounts/billing-list',
        accessbit: 1,
      },
      {
        text: 'Pending Invoices',
        key: 'accounts/pending-invoices',
        icon: 'fad fa-hat-wizard',
        path: 'accounts/pending-invoices',
        accessbit: 1,
      },
      {
        text: 'Invoices For Review',
        path: 'accounts/invoices-for-review',
        key: 'accounts/invoices-for-review',
        icon: 'fad fa-tasks',
        accessbit: 1,
        fragment: 'review',
      },
      {
        text: 'Payment Tracking',
        path: 'accounts/payment-tracking',
        key: 'accounts/payment-tracking',
        icon: 'fad fa-crosshairs',
        accessbit: 212,
      },
      {
        text: 'Credit Control',
        path: 'accounts/credit-control',
        key: 'accounts/credit-control',
        icon: 'fad fa-pound-sign',
        accessbit: 213,
      },
      {
        text: 'Code Search',
        path: 'accounts/code-search',
        key: 'accounts/code-search',
        icon: 'fad fa-search',
        accessbit: 207,
        beginGroup: true,
      },
      {
        text: 'Invoice Auto-Population',
        path: 'accounts/invoice-autopop',
        key: 'accounts/invoice-autopop',
        icon: 'fad fa-magic',
        accessbit: 201,
        beginGroup: true,
      },
      {
        text: 'Bulk Payments',
        path: 'accounts/bulk-payments',
        key: 'accounts/bulk-payments',
        icon: 'fad fa-pound-sign',
        accessbit: 210,
      },
      {
        text: 'Remittances',
        path: 'accounts/remittances',
        key: 'accounts/remittances',
        icon: 'fad fa-pound-sign',
        accessbit: 210,
      },
      {
        text: 'Pricing Matrix',
        path: 'accounts/pricing-matrix',
        key: 'accounts/pricing-matrix',
        icon: 'fad fa-tags',
        accessbit: 216,
        beginGroup: true,
      }
    ]
  },
  {
    text: 'Diary',
    key: 'diary',
    path: 'diary',
    // icon: 'fad fa-calendar-check',
    icon: 'hcicon hc-appointment-calendar',
    accessbit: 158,
  },
  {
    text: 'Documents',
    // icon: 'fad fa-file-alt',
    icon: 'hcicon hc-document-report',
    path: 'documents',
    key: 'documents',
    accessbit: 1,
    items: [
      {
        text: 'Printing',
        icon: 'fad fa-print',
        path: 'documents/printing',
        key: 'printing',
        accessbit: 1
      },
      {
        text: 'Generate Batch',
        icon: 'fad fa-print',
        path: 'documents/generate-batch',
        key: 'generateBatch',
        accessbit: 1
      }
    ]
  },
  {
    text: 'Reporting',
    key: 'reporting',
    icon: 'falight fa-chart-bar',
    accessbit: 1,
    path: 'reports/centre',
  },
  {
    text: 'PPR Profile',
    path: 'ppr-profile',
    key: 'ppr-profile',
    accessbit: 375,
    // icon: 'fad fa-user-md'
    icon: 'hcicon hc-the-ppr',
  },
  {
    text: 'UK GDPR',
    key: 'GDPR',
    icon: 'far fa-passport',
    accessbit: 1,
    items: [
      {
        text: 'About UK GDPR',
        path: 'gdpr/about',
        key: 'gdpr/about',
        accessbit: 1,
        icon: 'folder'
      },
      {
        text: 'Guide',
        path: 'gdpr/guide',
        key: 'gdpr/guide',
        accessbit: 380,
        icon: 'folder'
      },
      {
        text: 'Templates',
        path: 'gdpr/templates',
        key: 'gdpr/templates',
        accessbit: 380,
        icon: 'folder'
      },
      {
        text: 'Subject Access Export',
        path: 'gdpr/subject-access-export',
        key: 'gdpr/subject-access-export',
        accessbit: 380,
        icon: 'folder'
      }
    ]
  },
  {
    text: 'Tasks',
    icon: 'far fa-tasks',
    path: '/tasks',
    key: 'tasks',
    accessbit: 465,
  },
  {
    text: 'Secure Messages',
    path: 'messages',
    key: 'messages',
    // icon: 'fad fa-envelope',
    icon: 'hcicon hc-email-messaging',
    accessbit: 1,
  },
  {
    text: 'Help Centre',
    key: 'Help',
    // icon: 'fad fa-info-circle',
    icon: 'hcicon hc-customersupport',
    accessbit: 1,
    items: [
      {
        text: 'Help + Resources',
        path: 'help/resources',
        key: 'help/resources',
        accessbit: 1,
        icon: 'fad fa-info-circle'
      },
      {
        text: 'Instructional Videos',
        path: 'help/videos',
        key: 'help/videos',
        accessbit: 1,
        icon: 'fad fa-film'
      },
      {
        text: 'User Guide',
        path: 'help/user-guide',
        key: 'help/user-guide',
        accessbit: 1,
        icon: 'fad fa-book'
      },
    ]
  },
  {
    text: 'Preferences',
    key: 'preferences',
    path: '/preferences',
    // icon: 'fad fa-cog',
    icon: 'hcicon hc-setting-tools',
    accessbit: 1
  }
];

export const medSecNavigation = [
  {
    text: 'Home',
    path: 'medsec/home',
    key: 'home',
    icon: 'far fa-home',
    accessbit: 1,
    selected: true
  },
  {
    text: 'Patients',
    // icon: 'fad fa-user-injured',
    icon: 'hcicon hc-patients-people',
    path: '/medsec/patient-list',
    key: 'patient-list',
    hint: 'List Patients',
    accessbit: 1
  },
  {
    text: 'Accounts',
    icon: 'hcicon hc-billing_invoicing',
    key: 'accounts',
    accessbit: 1,
    items: [
      {
        text: 'Credit Control',
        path: '/medsec/accounts/credit-control',
        key: '/credit-control',
        icon: 'fad fa-pound-sign',
        accessbit: 1,
      },
      {
        text: 'Payment Tracking',
        path: '/medsec/accounts/payment-tracking',
        key: '/payment-tracking',
        icon: 'fad fa-crosshairs',
        accessbit: 1,
      },
      {
        text: 'Bulk Payments',
        path: '/medsec/accounts/bulk-payments',
        key: '/bulk-payments',
        icon: 'fad fa-pound-sign',
        accessbit: 1,
      }
    ]
  },
  {
    text: 'Diary',
    key: 'diary',
    icon: 'hcicon hc-appointment-calendar',
    path: 'diary',
    accessbit: 1,
  },
  {
    text: 'Contacts',
    icon: 'hcicon hc-account-contactdetails',
    accessbit: 1,
    path: '/medsec/contacts/list-contacts',
    key: '/contacts/list-contacts'
  },
  {
    text: 'Tasks',
    icon: 'far fa-tasks',
    path: '/medsec/tasks',
    key: 'tasks',
    accessbit: 465,
  },
  {
    text: 'Reporting',
    key: '/reports/centre',
    icon: 'far fa-chart-bar',
    accessbit: 1,
    path: '/medsec/reports/centre',
  },
  {
    text: 'Preferences',
    key: '/preferences/preferences-integration-services',
    path: '/medsec/preferences/preferences-integration-services',
    // icon: 'fad fa-cog',
    icon: 'hcicon hc-customersupport',
    accessbit: 1
  },

];

export const adminNavigation = [
  {
    text: 'Home',
    path: 'admin/home',
    key: 'home',
    icon: 'far fa-home',
    accessbit: 1,
    selected: true
  },
  {
    text: 'Sites',
    icon: 'fad fa-building',
    path: 'admin/sites',
    key: 'admin/sites',
    hint: 'List Sites',
    accessbit: 1
  },
  {
    text: 'Groups',
    icon: 'fad fa-sitemap',
    path: 'admin/groups',
    key: 'admin/groups',
    hint: 'List Groups',
    accessbit: 1
  },
  {
    text: 'Admin Users',
    icon: 'fad fa-user-crown',
    path: 'admin/adminUsers',
    key: 'admin/adminUsers',
    hint: 'List Admin Users',
    accessbit: 1
  },
  {
    text: 'ePractice Users',
    icon: 'fad fa-user',
    path: 'admin/ePracticeUsers',
    key: 'admin/ePracticeUsers',
    hint: 'List ePractice Users',
    accessbit: 1
  },
  {
    text: 'Templates',
    icon: 'fad fa-file-edit',
    path: 'admin/templates',
    key: 'admin/templates',
    hint: 'List Global Templates',
    accessbit: 1
  }
];
