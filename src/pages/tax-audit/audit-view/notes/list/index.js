import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import Search from '@material-ui/icons/Search'
import * as Icons from '../../../../../components/Icons/index'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Check from '@material-ui/icons/Check'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Clear from "@material-ui/icons/Clear";
import { useRouter } from 'next/router';
import { ProcessorSpinner } from '../../../../../components/spiner';
import NewNoteButton from '../components/button';
import { Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';


export default function Notifiacklist() {
    const [isFetching, setIsFetching] = useState(() => true);
    const [notifAck, setNotifAck] = useState([]);
    const router = useRouter()
    const [selectedRow, setSelectedRow] = useState(null);
    const [job, setJob] = useState(() => []);
    const { JobID } = router?.query
    const fields = [
        {
            title: "Headline",
            field: "note_headline",
        },
        {
            title: "Created time",
            field: "createtime",
        },
        {
            title: "Note Details",
            field: "note_details",
            render: rowData => rowData.note_details.substring(0, 20),
        },
        {
            title: "Action Type",
            field: "actionType"
        }
    ];


    const handleRowClick = (event, rowData) => {
        setSelectedRow(rowData);
    };

    const handleClosePopup = () => {
        setSelectedRow(null);
    };

    useEffect(() => {

        async function fetchPost() {

            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-fetch-singlejob.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "param1": "id",
                        "param2": JobID,
                    })
                })

                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notes-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID,
                    })
                })
                const dataFetch = await res.json()
                setNotifAck(dataFetch.body)

                const dataFetchJobDet = await response.json()
                setJob(dataFetchJobDet.body[0])

                setIsFetching(false)
            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [JobID]);

    return (
        <>
            {isFetching && <ProcessorSpinner />}
            <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-2">

                <div className="w-full flex items-center lg:w-1/2 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-2">
                    <article className="p-2">
                        <p className="font-bold"><span className="text-base">Tax Id</span> : <span>{job?.job_kgtin}</span></p>
                        <p className="font-bold"><span className="text-base">Auditor</span> : <span>{job?.job_user}</span></p>
                        <p className="font-bold"> <span className="text-base">Type</span>: <span>{job?.job_job_type}</span></p>
                        <p className="font-bold"><span className="text-base">Job start status</span> : <span>{job?.job_start_status}</span></p>
                        <p className="font-bold"><span className="text-base">Job progress status</span> : <span>{job?.job_progress_status}</span></p>
                        <p className="font-bold"><span className="text-base">Job start date</span> : <span>{job?.job_startdate}</span></p>
                        <p className="font-bold"><span className="text-base">Job audit start</span> : <span>{job?.job_auditdate_start}</span></p>
                        <p className="font-bold"><span className="text-base">Job audit end</span> : <span>{job?.job_auditdate_end}</span></p>
                        <p className="font-bold"><span className="text-base">Job initiator</span> : <span>{job?.job_initiator}</span></p>
                    </article>
                </div>

                <div className="w-full lg:w-1/2 w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
                    <div className="accordion border border-gray-300">
                        <div
                            className=' accordion-header text-center bg-gray-100 p-4 cursor-pointer bg-gray-200 '
                        >
                            <div className="flex justify-between">
                                <span>
                                    Job Menu
                                </span>
                            </div>
                        </div>

                        <div className="accordion-content p-4">
                            <button className="btn block p-2 bg-gray-100 w-full m-2"
                                onClick={() => router.push(`/tax-audit/audit-view?id=${JobID}`)}
                            >Notification letter</button>
                            <button className="btn block p-2 bg-gray-100 w-full m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/acknowledge/list/jobacklist?JobID=${JobID}`)}>
                                Acknowledgements
                            </button>
                            <button className="btn block p-2 bg-gray-100 w-full m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/audit-report/list?JobID=${JobID}`)}
                            >
                                Audit Report
                            </button>
                            <button className="btn block p-2 bg-blue-100 w-full m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/notes/list?JobID=${JobID}`)}
                            >Notes</button>
                            <button className="btn block p-2 bg-gray-100 w-full m-2">Compliance</button>
                            <button className="btn block p-2 bg-gray-100 w-full m-2">Objections</button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex justify-end m-2">
                <NewNoteButton JobID={JobID} />
            </div>
            <MaterialTable title="All Notes"
                data={notifAck}
                columns={fields}
                onRowClick={handleRowClick}
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
            <Dialog open={selectedRow !== null} onClose={handleClosePopup}>
                <DialogTitle>Note</DialogTitle>
                <DialogContent>
                    <Typography>Headline: {selectedRow?.note_headline}</Typography>
                    <Typography>Details: {selectedRow?.note_details}</Typography>
                </DialogContent>
            </Dialog>

        </>
    )
}
