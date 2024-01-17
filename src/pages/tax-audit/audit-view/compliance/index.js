import { formatNumber } from 'accounting'
import React, { useEffect, useState } from 'react'
import Widget from '../../../../components/widget'
import MaterialTable from 'material-table'
import Search from '@material-ui/icons/Search'
import * as Icons from '../../../../components/Icons/index'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Check from '@material-ui/icons/Check'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Clear from "@material-ui/icons/Clear";
import { useRouter } from 'next/router'
import ComplianceButtons from './components/buttons'
import { MoreHoriz } from '@material-ui/icons'
import { FiArrowUp, FiPlusCircle } from 'react-icons/fi'
import { shallowEqual, useSelector } from 'react-redux'
import jwt from "jsonwebtoken";

function Index() {
  const router = useRouter()
  const { JobID } = router?.query
  const [isFetching, setIsFetching] = useState(() => true);
  const [checkList, setCheckLists] = useState([]);
  const [complianceList, setComplianceList] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [job, setJob] = useState(() => []);

  const fields = [
    {
      title: "Notice date",
      field: "notification_date",
    },
    {
      title: "File ref",
      field: "notification_fileno",
    },
    {
      title: "type",
      field: "actionType",
    },
    {
      title: "Status",
      field: "status",

    },
    {
      title: "Created by",
      field: "doneby",
    },
    {
      title: "Created time",
      field: "createtime",
    },

  ];


  const { auth } = useSelector(
    (state) => ({
        auth: state.authentication.auth,
    }),
    shallowEqual
);
const decoded = jwt.decode(auth);
const groups = decoded.groups
let creatorRange = [1, 4, 13, 15, 29]
const shouldCreateCompliance = groups.some((element) => creatorRange.includes(element));

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-compliance-stats.php', {
          method: 'POST',
          body: JSON.stringify({
            job_id: JobID,
            id: ""
          })
        })
        const dataFetchCheck = await response.json()
        setCheckLists(dataFetchCheck.checklists);

        const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-compliance-batch.php', {
          method: 'POST',
          body: JSON.stringify({
            job_id: JobID
          })
        })
        const dataFetchComp = await res.json()
        setIsFetching(false)

        const jobResponse = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-fetch-singlejob.php', {
          method: 'POST',
          body: JSON.stringify({
            "param1": "id",
            "param2": JobID
          })
        })
        const dataFetchJobDet = await jobResponse.json()
        setJob(dataFetchJobDet.body[0])


        if (dataFetchComp && dataFetchComp.body) {
          const updatedData = {
            ...dataFetchComp,
            body: dataFetchComp.body.map(record => {
              const { reviewstatus, approvestatus } = record;

              if (
                (reviewstatus === null || reviewstatus === '') &&
                (approvestatus === null || approvestatus === '')
              ) {
                return { ...record, status: null };
              } else if (
                reviewstatus !== null &&
                reviewstatus !== '' &&
                (approvestatus === null || approvestatus === '')
              ) {
                return { ...record, status: reviewstatus };
              } else {
                return { ...record, status: approvestatus };
              }
            }),
          };

          setComplianceList(updatedData.body);
        }


      } catch (error) {
        setIsFetching(false)
        console.error('Server Error:', error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchPost();
  }, [JobID]);



  return (
    <>
      <div className="flex justify-end mb-2">
        <button
          className="btn bg-gray-400 btn-default text-white btn-outlined bg-transparent rounded-md"
          type="submit"
          onClick={() => router.back()}
        >
          Back
        </button>

      </div>
      <Widget>
        <div className="accordion">
          <div className="bg-gray-100 h-10 rounded text-center text-base mb-5 cursor-pointer flex justify-around items-center">
            <p>Compliance Rating</p>
            <p
              onClick={togglePanel}
              className='h-6 w-6 bg-green-400 text-white flex items-center justify-center rounded-full text-lg font-display font-bold'
            >{isPanelOpen ? <FiArrowUp /> : <FiPlusCircle />}</p>
          </div>

          <div style={{ display: isPanelOpen ? 'block' : 'none' }}>
            {shouldCreateCompliance && 
            <div className='flex gap-4 justify-center mb-10'>
              <ComplianceButtons JobID={JobID} />
            </div>
            
            }

            {checkList?.map((item) => (
              <div className='my-5 px-4 mx-auto'>
                <div className='grid grid-cols-3 gap-2 place-content-center' key={item.checklist_id}>
                  <p>{item.checklist_item}</p>
                  <p>{`Expected Documents: ${item.available} of ${item.expected}`}</p>
                  {formatNumber(item.percentage) === "100" ?
                    <p> Percentage: <span className='text-green-400'>{`${formatNumber(item.percentage)}%`}</span></p>
                    : <p>{`Percentage: ${formatNumber(item.percentage)}%`}</p>
                  }
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </Widget>

      <MaterialTable title="Compliance log"
        data={complianceList}
        columns={fields}
        actions={
          [
            {
              icon: MoreHoriz,
              tooltip: 'View',
              onClick: (event, rowData) => {
                router.push(`/tax-audit/audit-view/compliance/${rowData.job_id}_${rowData.id}`)
              }
            },
          ]
        }
        options={{
          search: true,
          paging: true,
          filtering: true,
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

      />
    </>
  )
}

export default Index