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
    field: "taxYr_1",
  },
  {
    title: "Year 2 tax",
    field: "taxYr_2",
  },
  {
    title: "Year 3 tax",
    field: "taxYr_3",
  },
  {
    title: "Station",
    field: "tax_station",
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



export const ViewPayeTccTablePrint = ({ tccdata }) => {
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
            window.open(`/view/listpayetcc/${rowData.id}`, "_self")
            event.stopPropagation();
          }
        }}
      />
    </>
  );
};

export const ViewSinglePayeTccPrintTable = ({
  yrOnePaySl,
  yrTwoPaySl,
  yrThreePaySl,
  PayeTccData,
  passport,
  signature,
  oldPass,
  oldSign
}) => {


  let basdocurl = 'https://annualuploads.bespoque.dev/rhm-live/uploads/paye/tcc/'

  let date = PayeTccData.aprvPrint_time
  let due_date = new Date(date)
  let dueDateYear = due_date.getFullYear()

  let Issdate = new Date()
  let Issdue_date = new Date(Issdate)
  let dateIssue = dateformat(Issdue_date, "dd mmm yyyy")
  const componentRef = useRef();

  if (oldPass === null) {
    oldPass = ""
  }
  if (oldSign === null) {
    oldSign = ""
  }
  const base64StringPic = Buffer.from(oldPass).toString('base64')
  const base64StringSig = Buffer.from(oldSign).toString('base64')

  setAuthToken();
  let ChangePrint = (e) => {
    e.preventDefault()
    let statusObj = {
      id: PayeTccData.id,
      status: "Printed"
    }
    try {
      axios.put(`${url.BASE_URL}paye/tcc-status`, statusObj);
    } catch (error) {
      console.log(error);
    }
  }

  let year2 = PayeTccData.assmtYr_2
  let year3 = PayeTccData.assmtYr_3
  if (year2 === null) {
    year2 = ""
  }
  if (year3 === null) {
    year3 = ""
  }
  let year1ConRel
  let year1OtherRelief
  let year2ConRel
  let year2OtherRelief
  let year3ConRel
  let year3OtherRelief

  if (yrOnePaySl == undefined) {
    year1ConRel = 0
    year1OtherRelief = 0
  }
  else {
    year1ConRel = yrOnePaySl.consolidated_relief
    year1OtherRelief = yrOnePaySl.other_relief
  }
  if (yrTwoPaySl[0] == undefined) {
    year2ConRel = 0
    year2OtherRelief = 0
  }
  else {
    year2ConRel = yrTwoPaySl[0].consolidated_relief
    year2OtherRelief = yrTwoPaySl[0].other_relief
  }

  if (yrThreePaySl[0] == undefined) {
    year3ConRel = 0
    year3OtherRelief = 0
  }
  else {
    year3ConRel = yrThreePaySl[0].consolidated_relief
    year3OtherRelief = yrThreePaySl[0].other_relief
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
                {passport?.length > 0 || signature?.length > 0 ?
                  <div className="flex">
                    <div>
                      <img
                        src={`${basdocurl}${passport}`}
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
                  </div> :
                  <div className="">
                    {(Array.isArray(oldPass.data) && oldPass.data.length !== 0) || (Array.isArray(oldSign.data) && oldSign.data.length !== 0) ?
                      <div className="flex">
                        <div>
                          <img
                            src={`data:image/png;base64,${base64StringPic}`}
                            alt=""
                            className="rounded h-20 w-20"
                          />
                        </div>
                        <div className="self-end ml-2">
                          <img
                            src={`data:image/png;base64,${base64StringSig}`}
                            alt=""
                            className="rounded h-10 w-24"
                          />
                        </div>
                      </div>
                      :
                      <div className="flex">
                        <div>
                          <img
                            src={`${basdocurl}${passport}`}
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
                    }
                  </div>

                }

                <div>
                  <div>
                    <small className="leading-none block">File No</small>
                    <small className="font-bold">{PayeTccData.file_ref}</small>
                  </div>
                  <div className="grid grid-cols-2 gap-2 place-items-start">
                    <div className="">
                      <small className="leading-none block">TCC ID </small>
                      <small className="font-bold">{PayeTccData.ref}</small>
                    </div>
                    <div className="">
                      <small className="leading-none block">ISSUE DATE </small>
                      <small className="font-bold">{dateIssue}</small>
                    </div>
                    <div className="">
                      <small className="leading-none block">TAX ID </small>
                      <small className="font-bold">{PayeTccData.tp_id}</small>
                    </div>
                    <div className="">
                      <small className="leading-none block">TAX OFFICE </small>
                      <small className="font-bold">{PayeTccData.tax_station}</small>
                    </div>
                  </div>
                </div>
              </div>


              <div>
                <p> <span className="font-bold">1.</span> This is to Certify that <span className="font-bold">{PayeTccData.taxpayer_name}</span></p>
                <p><span>of</span> <span className="font-bold"> {PayeTccData.address}</span></p>
                <div>
                  <p>fully paid his/her Personal Income Tax for the past years, that is: <span>
                    {`${year2 !== "" ? `${PayeTccData.assmtYr_1},` : PayeTccData.assmtYr_1} ${year3 !== "" ? `${year2},` : year2} ${year3}`}
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
                          Year
                        </th>
                        <th>
                          Gross Emoluments
                        </th>
                        <th className="">
                          Taxable Income
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
                      <tr>
                        <td className="">
                          <p className="font-bold">{PayeTccData.assmtYr_1}</p>
                        </td>
                        <td className="">
                          <p className="font-bold">{formatNumber(PayeTccData.incYr_1)}</p>
                        </td>

                        <td className="">
                          <p className="font-bold"> {formatNumber(Number(PayeTccData.incYr_1) - ((Number(year1ConRel) + Number(year1OtherRelief))))} </p>
                        </td>
                        <td className="">
                          <p className="font-bold">{formatNumber(PayeTccData.taxYr_1)}</p>
                        </td>
                        <td className="">
                          {/* <p>PAYE</p> */}
                          <p>{PayeTccData.tp_id === "2247049882" ? "Assessment" : "PAYE"}</p>
                        </td>
                      </tr>

                      <tr>
                        <td className="">
                          <p className="font-bold">{PayeTccData.assmtYr_2}</p>
                        </td>
                        <td className="">
                          <p className="font-bold">{formatNumber(PayeTccData.incYr_2)}</p>
                        </td>
                        <td className="">
                          <p className="font-bold">{formatNumber(Number(PayeTccData.incYr_2) - ((Number(year2ConRel) + Number(year2OtherRelief))))}</p>
                        </td>
                        <td className="">
                          <p className="font-bold">{formatNumber(PayeTccData.taxYr_2)}</p>
                        </td>
                        <td className="">
                          <p>PAYE</p>
                        </td>
                      </tr>

                      <tr>
                        <td className="">
                          <p className="font-bold">{PayeTccData.assmtYr_3}</p>
                        </td>
                        <td className="">
                          <p className="font-bold">{formatNumber(PayeTccData.incYr_3)}</p>
                        </td>

                        <td className="">
                          <p className="font-bold"> {formatNumber(Number(PayeTccData.incYr_3) - (Number(year3ConRel) + Number(year3OtherRelief)))} </p>
                        </td>

                        <td className="">
                          <p className="font-bold">{formatNumber(PayeTccData.taxYr_3)}</p>
                        </td>
                        <td className="">
                          {/* <p>{PayeTccData?.taxYr_3_type || "PAYE"}</p> */}
                          <p>PAYE</p>
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="mb-2"><span className="font-bold">3.</span> His/her known source(s) of income are: <span>Employment, Trade/Professional</span> </p>
                <p><span className="font-bold">4.</span> This certificate expires on: <span>31st Dec {dueDateYear}</span> </p>
              </div>
              <p className="text-red-600 flex justify-center text-3xl">INCOME TAX CLEARANCE CERTIFICATE</p>
              <div className="flex justify-end mt-16">

                <div className="mr-20">
                  <QRCode
                    value={`https://irs.kg.gov.ng/verify/fetch_tcc.php?ref=${PayeTccData.ref}`}
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
                <p>-visit: <span><a href="https://irs.kg.gov.ng/verify-tcc/" target="_blank">  www.irs.kg.gov.ng/verify-tcc</a></span></p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
