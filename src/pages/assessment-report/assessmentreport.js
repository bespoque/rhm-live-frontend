import MaterialTable from "material-table";
// import MaterialTable from '@material-table/core';
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
import * as Icons from '../../components/Icons/index';
import { useRouter } from "next/router";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { formatNumber } from "accounting";
import { Delete, WarningRounded } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import axios from "axios";
import url from '../../config/url';
import setAuthToken from '../../functions/setAuthToken';
import { ProcessorSpinner } from '../../components/spiner';


const fields = [
  {
    title: "SN",
    field: "serialNo",
    filtering: false,
    width: "10%"
  },
  {
    title: "Assesment Id",
    field: "assessment_id",
  },
  {
    title: "Year",
    field: "year",
  },
  {
    title: "KGTIN",
    field: "kgtin",
  },
  {
    title: "Taxpayer Name",
    field: "tp_name",
  },
  {
    title: "Gross Income",
    field: "overallGross",
    render: rowData => {
      return (
        formatNumber(Number(rowData.employed) + Number(rowData.self_employed) + Number(rowData.other_income))
      )
    }
  },
  {
    title: "Total Tax Due",
    field: "tax",
    render: rowData => {
      return (
        formatNumber(Number(rowData.tax) + Number(rowData.add_assmt))
      )
    }

  },
  {
    title: "Dev Levy",
    field: "dev_levy",
    render: (dev_levy) => formatNumber(dev_levy.dev_levy)

  },
  {
    title: "Amount Paid",
    field: "taxPaid",
    render: (taxPaid) => formatNumber(taxPaid.taxPaid)

  },
  {
    title: "Balance",
    field: "balance",
    render: (rowData) => {
      return (
        formatNumber(rowData.balance) < "0" ? <p style={{ color: "#FF0000", fontWeight: "bold" }}>{formatNumber(rowData.balance)}</p> :
          formatNumber(rowData.balance) > "0" ? <p style={{ color: "#8fce00", fontWeight: "bold" }}>{`+${formatNumber(rowData.balance)}`}</p> :
            <p>{formatNumber(rowData.balance)}</p>
      )
    }
  },
  {
    title: "Tax Office",
    field: "tax_office",
  },
  {
    title: "Type",
    field: "assessment_type",
  },
  {
    title: "Print Status",
    field: "printstatus",
  },
  {
    title: "Created Time",
    field: "createtime",
    type: 'date'
  },

];


export default function AssessmentReportstable({ FilteredData }) {
  const [revisedAssFields, setRevisedAssFields] = useState({});
  const [revisedmodal, setRevisedModal] = useState(false);
  const [isFetching, setIsFetching] = useState(() => false);
  const [assessId, setAssessId] = useState('');
  const [createErrors, setCreateErrors] = useState('');
  const [modal, setModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();



  const { auth } = useSelector(
    (state) => ({
      auth: state.authentication.auth,
    }),
    shallowEqual
  );

  for (let i = 0; i < FilteredData.length; i++) {
    const record = FilteredData[i];

    const taxPaid = parseFloat(record.taxPaid);
    const tax = parseFloat(record.tax);
    const addAssmt = parseFloat(record.add_assmt);
    const balance = taxPaid - (tax + addAssmt);

    record.balance = balance;
  }

  const calculateColumnSum = (columnName) => {
    return FilteredData.reduce((sum, row) => {
      const value = parseFloat(row[columnName]) || 0;
      return sum + value;
    }, 0);
  };

  let items = FilteredData

  const DeleteRange = [1, 12]
  const decoded = jwt.decode(auth);
  const userGroup = decoded.groups

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleObjectionModal = () => {
    setRevisedModal(!revisedmodal);
  };

  setAuthToken();
  const DeleteAssessment = async (data) => {
    data.preventDefault()
    setIsProcessing(true)
    let deleteOBJ = {
      assessment_id: assessId
    }
    try {
      await axios.delete(`${url.BASE_URL}forma/del-assessment`, { data: deleteOBJ })
      setIsProcessing(false)
      toast.success("Deleted Successfully!");
      toggleModal()
      window.location.reload()
    } catch (error) {
      toast.error("Failed Try again!");
      setIsProcessing(false)
    }
  };


  const ReviseAssessment = async (e) => {
    e.preventDefault()
    setIsFetching(true)
    axios.post(`${url.BASE_URL}forma/new-objection`, revisedAssFields)
      .then(function (response) {
        setRevisedModal(!revisedmodal);
        setIsFetching(false)
        toast.success("Created successfully!");
        router.push(`/revise-assessment/${revisedAssFields.kgtin}_${response.data.body.assessment_id}`)
      })
      .catch(function (error) {
        setIsFetching(false)
        if (error) {
          setCreateErrors(error?.response?.data.message)
          toast.error(createErrors)
          setRevisedModal(!revisedmodal);
        } else {
          toast.error("Failed Try again!");

        }
      })

  };

  return (
    <>
      <ToastContainer />
      {isProcessing && <ProcessorSpinner />}
      {isFetching && (
        <div className="flex justify-start item mb-2">
          <Loader
            visible={isFetching}
            type="BallTriangle"
            color="#00FA9A"
            height={19}
            width={19}
            timeout={0}
            className="ml-2"
          />
          <p className="font-bold">Processing...</p>
        </div>
      )}
      {modal && (
        <div className="modal">
          <div className="modal-content" width="300">
            <form onSubmit={DeleteAssessment}>
              <div className="flex justify-center">
                <WarningRounded
                  size={15}
                  className="text-yellow-400"
                />
              </div>
              <p>Are you sure you want to delete?</p>
              <div className="mt-2 flex justify-between">
                <button onClick={toggleModal}
                  className="btn w-32 bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                >
                  Cancel
                </button>
                <div>

                </div>
                <button
                  className="btn w-32 bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                  type="submit"
                >
                  Continue
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
      {revisedmodal && (
        <div className="modal">
          <div className="modal-content" width="300">
            <form onSubmit={ReviseAssessment}>
              <div className="flex justify-center">
                <WarningRounded
                  size={15}
                  className="text-yellow-400"
                />
              </div>
              <p>Are you sure you want to create objection?</p>
              <div className="mt-2 flex justify-between">
                <button onClick={toggleObjectionModal}
                  className="btn w-32 bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                >
                  Cancel
                </button>
                <div>

                </div>
                <button
                  className="btn w-32 bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                  type="submit"
                >
                  Continue
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', gap: "8px" }}>
          <div> <span className="font-bold">Total Tax</span> : {formatNumber(calculateColumnSum('tax').toFixed(2))}</div>
          <div><span className="font-bold">Amount paid</span>: {formatNumber(calculateColumnSum('taxPaid').toFixed(2))}</div>
        </div>
      </div>
      <MaterialTable title="Report Data"
        data={items}
        columns={fields}
        actions={[
          () => {
            if (userGroup.some(r => DeleteRange.includes(r))) {
              return {
                icon: Delete,
                tooltip: 'Delete Assessment',
                onClick: (event, rowData) => {
                  event.preventDefault()
                  setAssessId(rowData.assessment_id)
                  setModal(true)
                },
              };
            }
            else {
              return {

                icon: Delete,
                tooltip: 'Delete Assessment',
                hidden: true,
                onClick: (event, rowData) => {
                  event.preventDefault()
                  setAssessId(rowData.assessment_id)
                  setModal(true)
                }
              };
            }
          },
          {
            icon: () => <Icons.Objection />,
            tooltip: 'Objection',
            hidden: false,
            onClick: (event, rowData) => {
              event.preventDefault()

              setRevisedAssFields(
                {
                  "kgtin": rowData.kgtin,
                  "year": rowData.year,
                  "da_assessment_id": rowData.assessment_id,
                  "station": rowData.tax_office
                }
              )
              console.log("revisedAssFields", revisedAssFields);
              setRevisedModal(true)
            }
          },
        ]}
        renderSummaryRow={({ column, data }) =>
          column.field === "taxPaid"
            ? {
              value: formatNumber(data.reduce((agg, row) => Number(agg) + (Number(row.taxPaid)), 0)),
              style: { fontWeight: "bold" },
            }
            : undefined
        }
        options={{
          search: false,
          paging: true,
          filtering: true,
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1
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
          window.open(`/view/approvedasses/${rowData.assessment_id},${rowData.kgtin}`, "_self")
          event.stopPropagation();
        }}
      />

      <style
        jsx>{
          `
        body.active-modal {
          overflow-y: hidden;
      }
      
      // .btn-modal {
      //     padding: 10px 20px;
      //     display: block;
      //     margin: 100px auto 0;
      //     font-size: 18px;
      // }
      
      .modal, .overlay {
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: fixed;
      }
      
      .overlay {
          background: rgba(49,49,49,0.8);
      }
      .modal-content {
          position: absolute;
          top: 20%;
          left: 60%;
          transform: translate(-50%, -50%);
          line-height: 1.4;
          background: #f1f1f1;
          padding: 14px 28px;
          border-radius: 3px;
          max-width: 400px;
          min-width: 300px;
      }
      
      .close-modal {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 7px;
      }
        `
        }
      </style>
    </>
  )
}
