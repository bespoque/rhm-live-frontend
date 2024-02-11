import { RhmDashboard, ManageTaxpayer, Paye } from '../../components/Icons/index';


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
    ],
  },
];

export default function navigationCreator(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
