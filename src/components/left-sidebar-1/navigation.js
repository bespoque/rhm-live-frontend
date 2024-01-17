import { RhmDashboard, ManageTaxpayer, DirectAssessment, Paye, Collections, Settings } from '../Icons';

import {SUPER_ADMIN, REPORT_RANGE} from './constants'


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
        icon: <DirectAssessment />,
        title: 'Direct Assessment',
        items: [
          {
            title: 'Create',
            url: '/direct-asses',
            items: [],
          },
          {
            title: 'Draft Assessments',
            url: '/view/pendingdirect',
            items: [],
          },
          {
            title: 'Submitted Assessments',
            url: '/view/completeddirect',
            items: [],
          },
          {
            title: 'Verified BOJ',
            url: '/view/listverifiedboj',
            items: [],
          },
          {
            title: 'Approved Assessments',
            url: '/view/approvedasses',
            items: [],
          },
          {
            url: '/',
            title: 'Tax Clearance (TCC)',
            items: [
              {
                url: '/tcc',
                title: 'Create',
                items: [],
              },
              {
                url: '/view/listapprovedtcc',
                title: 'Pending E C. Sign',
                items: [],
              },
              {
                url: '/view/listtcc',
                title: 'View All',
                items: [],
              },
              {
                url: '/view/listprinttcc',
                title: 'View Print',
                items: [],
              },
            ],
          },
          {
            url: '/',
            title: 'Report',
            items: [
              {
                title: 'Assessment',
                url: '/assessment-report',
                items: [],
              },
              {
                title: 'Unassessed Collections',
                url: '/unassessed-report',
                items: [],
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
                title: 'Pending EC sign',
                url: '/view/objection/approved',
                items: [],
              },
              {
                title: 'Print',
                url: '/view/objection/vetted',
                items: [],
              },
            ],
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
                title: 'File Returns',
                url: '/file-annual-returns',
                items: [],
              },
              {
                title: 'Review Documents',
                url: '/paye-annual',
                items: [],
              },
            ],
          },
        ],
      },

      // {
      //   url: '/',
      //   icon: <Paye />,
      //   title: 'MARKET',
      //   items: [
      //     {
      //       url: '/',
      //       title: 'Agent',
      //       items: [
      //         {
      //           title: 'Register',
      //           url: '/markets/agents/register/registeragent',
      //           items: [],
      //         },
      //         {
      //           title: 'List',
      //           url: '/view/agents/list-agents',
      //           items: [],
      //         },
      //       ],
      //     },

      //   ],
      // },

      {
        url: '/',
        icon: <Collections />,
        title: 'Collections',
        items: [
          {
            title: 'View',
            url: '/reports',
            items: [],
          },
          {
            title: 'Manifest',
            url: '/reports-manifest',
            items: [],
          },
          // {
          //   title: 'DA Receipt',
          //   url: '/da-receipt',
          //   items: [],
          // },
        ],
      },

      {
        url: '/',
        icon: <Settings />,
        title: 'Tax Audit',
        items: [
          {
            title: 'My Jobs',
            url: "/tax-audit/my-jobs",
            items: [],
          },
       
          {
            title: 'Management',
            items: [
              { title: 'New Job', url: '/tax-audit/create-job', items: [] },
              { title: 'All Jobs', url: '/tax-audit/all-jobs', items: [] },
            ],
          },
        ],
      },

      {
        url: '/',
        icon: <Settings />,
        title: 'Settings',
        items: [
          {
            title: 'Revenue Items',
            items: [
              { title: 'Create', url: '/', items: [] },
              {
                title: 'View',
                url: '/',
                items: [],
              },
              {
                title: 'Edit',
                url: '/',
                items: [],
              },
              {
                title: 'Delete',
                url: '/',
                items: [],
              },
            ],
          },

          {
            title: 'Tax Office',
            items: [
              { title: 'Create', url: '/', items: [] },
              {
                title: 'View',
                url: '/',
                items: [],
              },
              { title: 'Edit', url: '/', items: [] },
              { title: 'Delete', url: '/', items: [] },

            ],
          },
          {
            title: 'Sectors',
            items: [
              { title: 'Create', url: '/', items: [] },
              { title: 'View', url: '/', items: [] },
              {
                title: 'Edit',
                url: '/',
                items: [],
              },
              {
                title: 'Delete',
                url: '/',
                items: [],
              },
            ],
          },
          {
            title: 'Budget Estimate',
            items: [
              { title: 'Create', url: '/', items: [] },
              { title: 'View', url: '/', items: [] },
              {
                title: 'Edit',
                url: '/',
                items: [],
              },
              {
                title: 'Delete',
                url: '/',
                items: [],
              },
            ],
          },
          // {
          //   title: 'Business Type',
          //   items: [
          //     { title: 'Create', url: '/settings/business-type/create', items: [] },
          //     { title: 'View', url: '/settings/view-business-type', items: [] },
          // {
          //   title: 'Edit',
          //   url: '/',
          //   items: [],
          // },
          //   ],
          // },
          {
            title: 'Audit Receipt',
            items: [
              { title: 'Generate', url: '/view/tax-audit', items: [] },
            ],
          },
        ],
      },

      {
        url: '/',
        icon: <Settings />,
        title: 'Access Management',
        items: [

          {
            title: 'Manage User',
            items: [
              { title: 'Create', url: '/register', items: [] },
              {
                title: 'View',
                url: '/view/users',
                items: [],
                
              },
            ],
          },
          // {
          //   title: 'User Groups',
          //   items: [
          //     { title: 'Create', url: '/view/user-group/create', items: [] },
          //     {
          //       title: 'View',
          //       url: '/view/user-group/list',
          //       items: [],
          //     },
          //   ],
          // },
          // {
          //   title: 'Permissions',
          //   items: [
          //     { title: 'Create', url: '/view/access-rights/create', items: [] },
          //     {
          //       title: 'View',
          //       url: '/view/access-rights/list',
          //       items: [],
          //     },
          //   ],
          // },

        ],

      },
    ],
  },
];

export default function navigationAdmin(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
