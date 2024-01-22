import { RhmDashboard, ManageTaxpayer, Paye, Collections, UserGuide } from '../../components/Icons/index';


const initialState = [
  {
    title: 'Applications',
    items: [
      {
        url: '/dashboard',
        icon: <RhmDashboard />,
        title: 'Dashboard',
        items: [],
      },

      {
        url: '/',
        icon: <ManageTaxpayer />,
        title: 'Manage Taxpayer',
        items: [
          {
            title: 'Individual',
            items: [
              { title: 'Create', url: '/taxpayer', items: [] },
              {
                title: 'View',
                url: '/reports-individual',
                items: [],
              },
            ],
          },
          {
            title: 'Non-Individual',
            items: [
              { title: 'Create', url: '/taxpayer/non-individual', items: [] },
              {
                title: 'View',
                url: '/reports-non-individual',
                items: [],
              },
            ],
          },
        ],
      },
      {
        url: '/',
        title: 'Objection',
        items: [
          {
            title: 'Draft',
            url: '/view/objection/draft',
            items: [],
          },
          {
            title: 'Submitted',
            url: '/view/objection/submitted',
            items: [],
          },
          {
            title: 'Verified',
            url: '/view/objection/verified',
            items: [],
          },
          {
            title: 'Verified',
            url: '/view/objection/verified',
            items: [],
          },
          {
            title: 'Print',
            url: '/view/objection/vetted',
            items: [],
          },
        ],
      },

      {
        url: '/',
        icon: <Paye />,
        title: 'PAYE',
        items: [
          {
            url: '/',
            title: 'TCC',
            items: [
              {
                title: 'Create',
                url: '/tcc/paye',
                items: [],
              },
              {
                title: 'Draft',
                url: '/view/listpayetcc/alltcc',
                items: [],
              },
              {
                title: 'Verified',
                url: '/view/listpayetcc/alltcc/verified',
                items: [],
              },
              {
                title: 'Audit Checked',
                url: '/view/listpayetcc/alltcc/audit',
                items: [],
              },
              {
                title: 'Pending E.C Sign',
                url: '/view/listpayetcc/alltcc/approved',
                items: [],
              },
              {
                title: 'Print',
                url: '/view/listpayetcc',
                items: [],
              },
            ],
          },
          {
            url: '/',
            title: 'Income Details',
            items: [
              {
                title: 'Create',
                url: '/pita/payslip',
                items: [],
              },
              {
                title: 'view',
                url: '/view/payslip',
                items: [],
              },

            ],
          },
          {
            url: '/',
            title: 'Annual Filing',
            items: [
              {
                title: 'Review Documents',
                url: '/paye-annual',
                items: [],
              },
            ],
          },
        ],
      },

      {
        url: '/',
        icon: <Collections />,
        title: 'Collections',
        items: [
          {
            url: '/reports',
            title: 'View',
            items: [],
          },
        ],
      },
      // {
      //   url: '/',
      //   icon: <UserGuide />,
      //   title: 'Tax Audit',
      //   items: [
      //     {
      //       title: 'My Jobs',
      //       url: "/tax-audit/my-jobs",
      //       items: [],
      //     },

      //     {
      //       title: 'Management',
      //       items: [
      //         { title: 'All Jobs', url: '/tax-audit/all-jobs', items: [] },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
];

export default function navigationApprover(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
