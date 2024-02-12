import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import SectionTitle from '../../components/section-title'
import setAuthToken from '../../functions/setAuthToken';
import axios from "axios";
import Loader from "react-loader-spinner";
import url from "../../config/url";
import { formatNumber } from 'accounting';
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Check from '@material-ui/icons/Check'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Clear from "@material-ui/icons/Clear";
import { Filter, PendingRemittance, RevenueItems, TaxReceipt, TotalRemittance } from '../../components/Icons';

export default function SinglePayerProfile() {
  const [isFetching, setIsFetching] = useState(() => true);
  const [overview, setOverview] = useState([]);
  const [payerProfile, setPayerProfile] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [assessmentInfo, setAssessmentInfo] = useState([]);
  const [TccInfo, setTccInfo] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState([]);
  const router = useRouter();

  const fieldAssessment = [
    {
      title: "Assesment Id",
      field: "assessment_id",
      // field: "assmt_id",
    },
    {
      title: "Year",
      // field: "assmt_year",
      field: "year",
    },
    {
      title: "Revenue Item",
      field: "rev_item",
    },
    {
      title: "Assessed Amount",
      field: "tax",
      // field: "assmt_amount",
      render: (amount) => formatNumber(amount.tax)

    },
    {
      title: "Tax Paid",
      field: "taxPaid",
      render: (taxPaid) => formatNumber(taxPaid.taxPaid)
    },
    {
      title: "Created Time",
      field: "createtime",
      // field: "assmt_date",
      type: "date"
    },
  ];

  const collectionsTable = [
    {
      title: "Assessment ID",
      field: "assessment_id",
    },
    {
      title: "MDA",
      field: "mda",
    },
    {
      title: "Revenue Item",
      field: "revenueItem",
    },
    {
      title: "Ref",
      field: "ref",
    },
    {
      title: "Bank",
      field: "bank",
    },
    {
      title: "Channel",
      field: "channel_id",
    },
    {
      title: "Amount",
      field: "amount",
      render: (expense) => formatNumber(expense.amount)
    },
    {
      title: "Transaction Date",
      field: "tran_date",
      type: "date"
    },
  ];

  const TccFields = [
    {
      title: "File Ref",
      field: "file_ref",
    },
    {
      title: "KGTIN",
      field: "tp_id",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Create Time",
      field: "crt_time",
      type: "date"
    },
  ];

  let additionalAss
  useEffect(() => {
    setIsFetching(true);
    if (router && router.query) {
      let indvkgtin = router.query.ref;
      let kgtin = {
        "kgtin": indvkgtin
      }
      setAuthToken();
      const fetchPost = async () => {
        try {
          let res = await axios.post(
            `${url.BASE_URL}taxpayer/taxpayer-profile`, kgtin
          );
          res = res.data.body;
          let overView = res.overview
          let profile = res.taxpayer
          let userData = res.tpIndividual[0]
          let assessmentData = res.assessmentDa
          let tcc = res.daTcc
          let collection = res.collection
          setOverview(overView)
          setUserInfo(userData)
          setPayerProfile(profile)
          setAssessmentInfo(assessmentData)
          setTccInfo(tcc)
          setCollectionInfo(collection)
          setIsFetching(false);
        } catch (e) {
          setIsFetching(false);
        }
      };
      fetchPost();
    }
  }, [router]);

  overview.forEach((data) => {
    additionalAss = Number(data.addAssessment)
  })

  return (
    <>
      <SectionTitle title="Taxpayer Profile Detail" />
      {isFetching ? (
        <div className="flex justify-center item mb-2">
          <Loader
            visible={isFetching}
            type="BallTriangle"
            color="#00FA9A"
            height={19}
            width={19}
            timeout={0}
            className="ml-2"
          />
          <p>Fetching data...</p>
        </div>
      ) :
        <div>
          {overview.map((ind, i) => (
            <div className="flex items-center">
              <div className="max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex  flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
                  <div className="w-full lg:w-1/4">
                    <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-xs uppercase font-light text-gray-500">
                            Amount Oustanding
                          </div>
                          <div className="text-xl font-bold">
                            {formatNumber(((Number(ind.assessmentAmount) + Number(additionalAss)) - Number(ind.amountPaid)))}
                          </div>
                        </div>
                        <TaxReceipt />
                        {/* <svg className="stroke-current text-gray-500" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2">
                          </path>
                          <circle cx="9" cy="7" r="4">
                          </circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87">
                          </path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75">
                          </path>
                        </svg> */}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/4">
                    <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-xs uppercase font-light text-gray-500">
                            Total Assessed Amount
                          </div>
                          <div className="text-xl font-bold">
                            {formatNumber(Number(ind.assessmentAmount) + additionalAss)}
                          </div>
                        </div>
                        <PendingRemittance />
                        {/* <svg className="stroke-current text-gray-500" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2">
                          </path>
                          <circle cx="9" cy="7" r="4">
                          </circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87">
                          </path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75">
                          </path>
                        </svg> */}
                      </div>
                    </div>
                  </div>
                  {/* <div className="w-full lg:w-1/4">
                    <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-xs uppercase font-light text-gray-500">
                            No. of Assessment
                          </div>
                          <div className="text-xl font-bold">
                            {formatNumber(ind.assessmentCount)}
                          </div>
                        </div>
                        <svg className="stroke-current text-gray-500" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12">
                          </polyline>
                        </svg>
                      </div>
                    </div>
                  </div> */}
                  <div className="w-full lg:w-1/4">
                    <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-xs uppercase font-light text-gray-500">
                            Total Amount Paid
                          </div>
                          <div className="text-xl font-bold">
                            {formatNumber(ind.amountPaid)}
                          </div>
                        </div>
                        <RevenueItems />
                        {/* <svg className="stroke-current text-gray-500" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6">
                          </path>
                          <polyline points="15 3 21 3 21 9">
                          </polyline>
                          <line x1="10" x2="21" y1="14" y2="3">
                          </line>
                        </svg> */}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/4">
                    <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-xs uppercase font-light text-gray-500">
                            Total No. Approved TCC
                          </div>
                          <div className="text-xl font-bold">
                            {formatNumber(ind.daTcc)}
                          </div>
                        </div>
                        <TotalRemittance />
                        {/* <svg className="stroke-current text-gray-500" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <polyline points="12 6 12 12 16 14">
                          </polyline>
                        </svg> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
            <div className="lg:w-1/3 max-w-md  bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
              <div>
                <div className="flex justify-center">
                  <img src="/images/avater.png" alt="" sizes="" className="rounded-full w-20 h-20 ring-2 ring-gray-300 dark:ring-gray-500" />
                </div>
                <div>
                  <div className="mt-4">
                    <div className="text-center">
                      <p className="text-lg text-blue-400">{payerProfile.tp_name}</p>
                      <p className="text-base">{payerProfile.address}</p>
                      <p className="text-base">{payerProfile.phone_number}</p>
                    </div>
                    <p className="font-bold text-center my-2"><em>Personal details</em> </p>
                    <section className='mb-2'>
                      <p>TIN/KGTIN</p>
                      <p className="font-bold">{payerProfile.KGTIN}</p>
                    </section>
                    <section className='mb-2'>
                      <p>TITLE</p>
                      {
                        userInfo.indv_title === null || userInfo.indv_title === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.indv_title}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>NAME</p>
                      {
                        payerProfile.tp_name === null || payerProfile.tp_name === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{payerProfile.tp_name}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>GENDER</p>
                      {
                        userInfo.gender === null || userInfo.gender === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.gender}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>MARITAL STATUS</p>
                      {
                        userInfo.marital_status === null || userInfo.marital_status === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.marital_status}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>DATE OF BIRTH</p>
                      {
                        userInfo.birth_date === null || userInfo.birth_date === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.birth_date}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>EMAIL</p>
                      {
                        userInfo.email === null || userInfo.email === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.email}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>PHONE NUMBER</p>
                      {
                        userInfo.phone_number === null || userInfo.phone_number === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.phone_number}</p>
                      }
                    </section>
                    <section className='mb-2'>
                      <p>OCCUPATION</p>
                      {
                        userInfo.occupation === null || userInfo.occupation === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.occupation}</p>
                      }
                    </section>

                    <section className='mb-2'>
                      <p>AREA TAX OFFICE</p>
                      <p className="font-bold">{payerProfile.tax_office}</p>
                    </section>
                    <section className='mb-2'>
                      <p>TYPE</p>
                      <p className="font-bold">{payerProfile.tp_type}</p>
                    </section>
                    <section className='mb-2'>
                      <p>CREATION DATE</p>
                      <p className="font-bold">{userInfo.enter_date}</p>
                    </section>
                    <section className='mb-2'>
                      <p>LGA</p>
                      {
                        userInfo.lga === null || userInfo.lga === "" ?
                          <p className="font-bold">-</p> :
                          <p className="font-bold">{userInfo.lga}</p>
                      }
                    </section>
                  </div>
                  <p className="font-bold text-center"><em>Address</em> </p>
                  <section className='mb-2'>
                    <p>House No</p>
                    {
                      userInfo.house_no === null || userInfo.house_no === "" ?
                        <p className="font-bold">-</p> :
                        <p className="font-bold">{userInfo.house_no}</p>
                    }
                  </section>
                  <section className='mb-2'>
                    <p>STREET</p>
                    {
                      userInfo.street === null || userInfo.street === "" ?
                        <p className="font-bold">-</p> :
                        <p className="font-bold">{userInfo.street}</p>
                    }
                  </section>

                  <section className='mb-2'>
                    <p>CITY</p>
                    {
                      userInfo.city === null || userInfo.city === "" ?
                        <p className="font-bold">-</p> :
                        <p className="font-bold">{userInfo.city}</p>
                    }
                  </section>
                </div>
                <section className='mb-2'>
                    <p>Registerd by</p>
                    {
                      payerProfile?.enter_by === null || payerProfile?.enter_by === "" ?
                        <p className="font-bold">-</p> :
                        <p className="font-bold">{payerProfile?.enter_by}</p>
                    }
                  </section>

              </div>
            </div>

            <div className="lg:w-2/3">
              <div>
                <MaterialTable title="Assessments"
                  data={assessmentInfo}
                  columns={fieldAssessment}

                  options={{
                    search: false,
                    filtering: false,
                    paging: false,
                  }}
                  icons={{
                    Check: Check,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: () => <Filter />,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    Clear: Clear,
                    SortArrow: ArrowDownward

                  }}
                />
              </div>
              <div className="my-3">
                <MaterialTable title="Collections"
                  data={collectionInfo}
                  columns={collectionsTable}

                  options={{
                    search: false,
                    filtering: false,
                    paging: false,
                  }}
                  icons={{
                    Check: Check,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: () => <Filter />,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    Clear: Clear,
                    SortArrow: ArrowDownward
                  }}
                />
              </div>
              <div>
                <MaterialTable title="TCC"
                  data={TccInfo}
                  columns={TccFields}

                  options={{
                    search: false,
                    filtering: false,
                    paging: false,
                  }}
                  icons={{
                    Check: Check,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: () => <Filter />,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    Clear: Clear,
                    SortArrow: ArrowDownward

                  }}
                />
              </div>
            </div>
          </div>
        </div>

      }
    </>
  )
}


