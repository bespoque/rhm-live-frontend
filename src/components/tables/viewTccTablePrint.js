
import { formatNumber } from "../../functions/numbers";
import * as Icons from '../Icons/index';
import dateformat from "dateformat";
import MaterialTable from "material-table";
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
import { shallowEqual, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import setAuthToken from "../../functions/setAuthToken";
import { useRef } from "react";
import url from '../../config/url';
import axios from "axios";
import ReactToPrint from "react-to-print";
import { CoatOfArms, KgirsLogo, KogiGov, SignatureCol } from "../Images/Images";
import QRCode from "react-qr-code";


const fields = [
  {
    title: "SN",
    field: "serialNo",
    filtering: false,
    width: "10%"
  },
  {
    title: "File Ref",
    field: "file_ref",
  },
  {
    title: "KGTIN",
    field: "tp_id",
  },
  {
    title: "Name",
    field: "taxpayer_name",
  },
  {
    title: "Year 1 tax",
    field: "amount1",
  },
  {
    title: "Year 2 tax",
    field: "amount2",
  },
  {
    title: "Year 3 tax",
    field: "amount3",
  },
  {
    title: "Station",
    field: "tax_office",
  },
  {
    title: "Create Time",
    field: "crt_time",
  },
  {
    title: "Status",
    field: "status",
  },
];



export const ViewTccPrintTable = ({ tccdata }) => {
  let items = tccdata;

  const { auth } = useSelector(
    (state) => ({
      auth: state.authentication.auth,
    }),
    shallowEqual
  );

  const reportRange = [39]
  const decoded = jwt.decode(auth);
  const userGroup = decoded.groups

  return (
    <>
      <MaterialTable title="Tcc List"
        data={items}
        columns={fields}

        options={{
          search: true,
          paging: true,
          filtering: true,
          rowStyle: (rowData) => {
            if (rowData.status === "Printed") {
              return {
                color: "#5f9f45"
                // backgroundColor: "#156448",
              }
            } else {
              return {};
            }
          },
          exportButton: {
            csv: true,
            pdf: false
          },
          exportAllData: true,

        }}
        icons={{
          Check: Check,
          DetailPanel: ChevronRight,
          Export: SaveAlt,
          Filter: () => <Icons.Filter />,
          FirstPage: FirstPage,
          LastPage: LastPage,
          NextPage: ChevronRight,
          PreviousPage: ChevronLeft,
          Search: Search,
          ThirdStateCheck: Remove,
          Clear: Clear,
          SortArrow: ArrowDownward
        }}

        onRowClick={(event, rowData) => {

          if (userGroup.some(r => reportRange.includes(r))) {
            console.log("not permitted");
          }

          else {
            window.open(`/view/listprinttcc/${rowData.id}`, "_self")
            event.stopPropagation();
          }
        }}
      />
    </>
  );
};

export const ViewSingleTccPrintTable = ({
  tccUploads,
  tccID,
  payerDetails,
  assessmentData,
  assessmentData2,
  assessmentData3,
  addAss1,
  addAss2,
  addAss3
}) => {


  const componentRef = useRef();
  let year2
  let year3

  let basdocurl = 'https://annualuploads.bespoque.dev/rhm-live/uploads/da/tcc/'
  let picUpload
  let signature
  let fileRef
  let printPrintTime

  let addAssessmentVal1 = 0
  let addAssessmentVal2 = 0
  let addAssessmentVal3 = 0

  addAss1.forEach((ind, i) => {
    addAssessmentVal1 = Number(ind.amount)
  })

  addAss2.forEach((ind, i) => {
    addAssessmentVal2 = Number(ind.amount)
  })
  addAss3.forEach((ind, i) => {
    addAssessmentVal3 = Number(ind.amount)
  })

  tccUploads.forEach((ind, i) => {
    picUpload = ind.passport
  })

  tccUploads.forEach((ind, i) => {
    signature = ind.sign
  })

  payerDetails.forEach((ind, i) => {
    fileRef = ind.ref
  })

  payerDetails.forEach((ind, i) => {
    printPrintTime = ind.aprvPrint_time
  })

  if (printPrintTime === undefined) {
    printPrintTime = new Date()
  } 

  const year1 = assessmentData.map((ind, i) => {
    return ind.year
  })
  const firstYear = String(year1)

  if (assessmentData2 === "" || assessmentData2 === undefined) {
    year2 = ""
  } else {
    year2 = assessmentData2.map((ind, i) => {
      return ind.year
    })

  }

  const secondYear = String(year2)

  if (assessmentData3 === "" || assessmentData3 === undefined) {
    year3 = ""
  } else {

    year3 = assessmentData3.map((ind, i) => {
      return ind.year
    })
  }
  const thirdYear = String(year3)



  let date = printPrintTime
  let due_date = new Date(date)
  let dueDateYear = due_date.getFullYear()


  let Issdate = new Date()
  let Issdue_date = new Date(Issdate)
  let dateIssue = dateformat(Issdue_date, "dd mmm yyyy")



  setAuthToken();
  let ChangePrint = (e) => {
    e.preventDefault()
    let statusObj = {
      id: tccID,
      status: "Printed"
    }
    try {
    axios.post(`${url.BASE_URL}forma/tcc-status`, statusObj);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div className="m-3 flex justify-end">
        <div onClick={ChangePrint}>
          <ReactToPrint
            trigger={() => <button className="btn w-32 bg-green-600 btn-default text-white
            btn-outlined bg-transparent rounded-md"
              type="submit"
            >
              Print
            </button>}
            content={() => componentRef.current}
          />
        </div>

      </div>

      <section ref={componentRef} className="flex justify-center mt-5">
        <div className="bg-cover bg-center" style={{ backgroundImage: `url(/images/KGIRS_TCC.jpg)` }}>
          <div className="px-20">
            <div >
              <div className="flex justify-center mt-16">
                <CoatOfArms />
                <p className="border-r-2 ml-2 border-black h-8 self-center"></p>
                <KogiGov />
              </div>
              <div className="flex justify-center">
                <div>
                <p className="text-green-600 text-xl">KOGI STATE GOVERNMENT</p>
                  <div className="text-center">
                  <p className="text-red-600 text-lg">TAX CLEARANCE CERTIFICATE</p>
                  </div>
                </div>
              </div>
              <div className="grid justify-items-center mt-5 ml-12">
                <div className="flex">
                  <KgirsLogo />
                  <div>
                    <p className="self-center w-48 font-bold text-green-600">KOGI STATE INTERNAL REVENUE SERVICE</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="ml-4">
                  <div className="flex">
                    <div>
                      <img
                        src={`${basdocurl}${picUpload}`}
                        alt=""
                        className="rounded h-16 w-16"
                      />
                    </div>
                    <div className="self-end ml-2">
                      <img
                        src={`${basdocurl}${signature}`}
                        alt=""
                        className="rounded h-10 w-24"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <small className="leading-none block">File No</small>
                    {payerDetails.map((data, i) => (
                      <small className="font-bold">{data.file_ref}</small>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 place-items-start">
                    <div className="">
                      <small className="leading-none block">TCC ID </small>
                      {payerDetails.map((data, i) => (

                        <small className="font-bold">{data.ref}</small>
                      ))}

                    </div>
                    <div className="">
                      <small className="leading-none block">ISSUE DATE </small>
                      <small className="font-bold">{dateIssue}</small>
                    </div>

                    <div className="">
                      <small className="leading-none block">TAX ID </small>
                      {payerDetails.map((data, i) => (
                        <small className="font-bold">{data.tp_id}</small>
                      ))}
                    </div>
                    <div className="">
                      <small className="leading-none block">TAX OFFICE </small>
                      {payerDetails.map((data, i) => (
                        <small className="font-bold">{data.tax_office}</small>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              <div>
                {payerDetails.map((data, i) => (
                  <p>
                    <span className="font-bold">1.</span> This is to Certify that <span span className="font-bold" > {data.taxpayer_name}</span>
                  </p>
                ))}

                {payerDetails.map((data, i) => (
                  <p><span>of <span className="font-bold"> {data.address}</span></span></p>
                ))}
                <div>
                  <p>fully paid his/her Personal Income Tax for the past years, that is: <span>
                    {`${secondYear !== "" ? `${firstYear},` : firstYear} ${thirdYear !== "" ? `${secondYear},` : secondYear} ${thirdYear}`}
                  </span>
                  </p>
                </div>
              </div>

              <div className="my-4">
                <p><span className="font-bold">2.</span> Details of his/her assessments are as follows:</p>
              </div>
              <div className="flex justify-center mb-5">
                <div>
                  <table className="table divide-y mb-4  ">
                    <thead >
                      <tr style={{ backgroundColor: "#d3fbc6" }}>
                        <th>
                          Assessment ID
                        </th>
                        <th>
                          Tax Year
                        </th>
                        <th className="">
                          Assessed Income
                        </th>
                        <th className="">
                          Tax Paid
                        </th>
                        <th className="">
                          Assessment Type
                        </th>
                      </tr>
                    </thead>

                    <tbody >

                      {assessmentData === "" || assessmentData === undefined ? "" :
                        <tr>
                          <td className="">
                            {payerDetails.map((ind, i) => (
                              <p className="font-bold">{ind.assmt_1}</p>

                            ))}
                          </td>
                          <td className="">
                            {assessmentData.map((ind, i) => (
                              <p className="font-bold">{ind.year}</p>

                            ))}
                          </td>
                          {assessmentData.map((ind, i) => (
                            <td className="">
                              <p className="font-bold"> {formatNumber(Number(ind.employed) + Number(ind.self_employed) + Number(ind.other_income))} </p>
                            </td>
                          ))}

                          <td className="">
                            {assessmentData.map((ind, i) => (
                              <p className="font-bold">{formatNumber(Number(ind.tax) + Number(addAssessmentVal1))}</p>
                            ))}
                          </td>
                          <td className="">
                            {assessmentData.map((ind, i) => (
                              <p>{ind?.assessment_type === "Assessment" ? "Direct Assessment" : ind?.assessment_type}</p>
                            ))}
                          </td>
                          {/* <td className="">
                            <p>Direct Assessment</p>
                          </td> */}
                        </tr>
                      }
                      {assessmentData2 === "" || assessmentData2 === undefined ? "" :
                        <tr>
                          <td className="">
                            {payerDetails.map((ind, i) => (
                              <p className="font-bold">{ind.assmt_2}</p>

                            ))}
                          </td>
                          <td className="">
                            {assessmentData2.map((ind, i) => (
                              <p className="font-bold">{ind.year}</p>

                            ))}
                          </td>
                          {assessmentData2.map((ind, i) => (
                            <td className="">
                              <p className="font-bold"> {formatNumber(Number(ind.employed) + Number(ind.self_employed) + Number(ind.other_income))} </p>
                            </td>
                          ))}

                          <td className="">
                            {assessmentData2.map((ind, i) => (
                              <p className="font-bold">{formatNumber(Number(ind.tax) + Number(addAssessmentVal2))}</p>
                            ))}
                          </td>
                          <td className="">
                            {assessmentData2.map((ind, i) => (
                              <p>{ind?.assessment_type === "Assessment" ? "Direct Assessment" : ind?.assessment_type}</p>
                            ))}
                          </td>
                          {/* <td className="">
                            <p>Direct Assessment</p>
                          </td> */}

                        </tr>

                      }
                      {assessmentData3 === "" || assessmentData3 === undefined ? "" :
                        <tr>
                          <td className="">
                            {payerDetails.map((ind, i) => (
                              <p className="font-bold">{ind.assmt_3}</p>

                            ))}
                          </td>
                          <td className="">
                            {assessmentData3.map((ind, i) => (
                              <p className="font-bold">{ind.year}</p>

                            ))}
                          </td>
                          {assessmentData3.map((ind, i) => (
                            <td className="">
                              <p className="font-bold"> {formatNumber(Number(ind.employed) + Number(ind.self_employed) + Number(ind.other_income))} </p>
                            </td>
                          ))}

                          <td className="">
                            {assessmentData3.map((ind, i) => (
                              <p className="font-bold">{formatNumber(Number(ind.tax) + Number(addAssessmentVal3))}</p>
                            ))}
                          </td>
                          <td className="">
                            {assessmentData3.map((ind, i) => (
                              <p>{ind?.assessment_type === "Assessment" ? "Direct Assessment" : ind?.assessment_type}</p>
                            ))}
                          </td>
                          {/* <td className="">
                            <p>Direct Assessment</p>
                          </td> */}

                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="mb-2"><span className="font-bold">3.</span> His/her known source(s) of income are: <span>Employment, Trade/Professional</span> </p>
                <p><span className="font-bold">4.</span> This certificate expires on: <span>31st Dec {thirdYear}</span> </p>
              </div>
              <p className="text-red-600 flex justify-center text-3xl">INCOME TAX CLEARANCE CERTIFICATE</p>
              <div className="flex justify-end mt-16">
                
                <div className="mr-20">
                  <QRCode
                    value={`https://irs.kg.gov.ng/verify/fetch_tcc.php?ref=${fileRef}`}
                    size={120}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <div className="flex flex-col">
                    <SignatureCol />
                    <hr />
                    <p className="font-bold text-center">Sule Salihu Enehe</p>
                    <p className="font-bold text-center">Executive Chairman</p>
                  </div>
                </div>
              </div>
              <div className="mb-12">
                <p>To verify certificate</p>
                <p>-visit: <span><a href="https://irs.kg.gov.ng/verify-tcc/" rel="noreferrer" target="_blank">  www.irs.kg.gov.ng/verify-tcc</a></span></p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </>
  );
};