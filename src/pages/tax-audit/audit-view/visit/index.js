import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { ProcessorSpinner } from '../../../../components/spiner';
import SectionTitle from '../../../../components/section-title';
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
import { MoreHoriz } from "@material-ui/icons";
import MaterialTable from '@material-table/core';
import NewVisitButton from './button';
import { FiArrowUp, FiPlusCircle } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";


const Visit = () => {
    const [isFetching, setIsFetching] = useState(() => true);
    const [job, setJob] = useState(() => []);
    const [visitData, setVisitData] = useState(() => []);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [jobUsers, setJobUsers] = useState([]);
    const router = useRouter()
    const { id } = router?.query

    const fields = [
        {
            title: "Visit Date",
            field: "visitdate",
        },
        {
            title: "Vist rating (out of 7)",
            field: "compliancelevel",
        },
        {
            title: "Visited department",
            field: "department",
        },
        {
            title: "Personnel met",
            field: "personnelmet",
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

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleRowClick = (event, rowData) => {
        setSelectedRow(rowData);
    };

    const handleClosePopup = () => {
        setSelectedRow(null);
    }

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );
    const decoded = jwt.decode(auth);
    const groups = decoded.groups
    let creatorRange = [1, 4, 13, 15, 29]
    const shouldCreateCorrespondence = groups.some((element) => creatorRange.includes(element));

    const startDate = job?.job_auditdate_start || "";
    const endDate = job?.job_auditdate_end || "";

    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    const auditStartYr = dateStart.getFullYear()
    const auditEndYr = dateEnd.getFullYear()


    useEffect(() => {

        async function fetchPost() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-fetch-singlejob.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "param1": "id",
                        "param2": id
                    })
                })

                const dataFetchJobDet = await response.json()
                setJob(dataFetchJobDet.body[0])

                const jobUsers = dataFetchJobDet?.body?.jobusers
                setJobUsers(jobUsers)

                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notification-auditlog-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": id,
                    })
                })
                const dataFetch = await res.json()
                setVisitData(dataFetch.body)


                setIsFetching(false)
            } catch (error) {
                setIsFetching(false)
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [id]);



    return (
        <>
            {isFetching && <ProcessorSpinner />}
            <SectionTitle title="Notifications" />
            <div className="bg-gray-100 h-10 rounded text-center text-base mb-5 cursor-pointer flex justify-around items-center">
                <p>Menu</p>
                <p
                    onClick={togglePanel}
                    className='h-6 w-6 bg-green-400 text-white flex items-center justify-center rounded-full text-lg font-display font-bold'
                >{isPanelOpen ? <FiArrowUp /> : <FiPlusCircle />}</p>
            </div>
            <div style={{ display: isPanelOpen ? 'block' : 'none' }}>
                <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-2">
                    <div className="w-full lg:w-1/2 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-2">
                        <div className="p-2 max-w-xs">
                            <p className="font-semibold text-gray-500">Taxpayer Details</p>
                            <hr />
                            <div className="flex justify-between">
                            <p>Taxpayer: <p className="font-semibold">{job?.taxpayer_TaxpayerName}</p> </p>
                                <p>Tax Id <p className="font-semibold">{job?.job_kgtin}</p></p>
                            </div>
                            <p className="font-semibold text-gray-500">Job Details</p>
                            <hr />
                            <div className="flex justify-between my-2">
                                <p>Type: <p className="font-semibold">{job?.job_job_type}</p> </p>
                                <p>Start date <p className="font-semibold">{job?.job_startdate}</p></p>
                            </div>
                            <div>
                                <p>Audit Period</p>
                                <p className="font-semibold">Jan, {auditStartYr} - Dec, {auditEndYr}</p>
                            </div>
                            <div className="mt-2 mb-4">
                                <p>Status</p>
                                <p className="font-semibold">{job.job_progress_status}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between gap-2">
                                <p>Auditor
                                    {jobUsers?.map((user) => (
                                        <p className="font-semibold">{user.name}</p>
                                    ))
                                    }
                                </p>
                                <p>Initiator <p className="font-semibold">{job.job_initiator}</p></p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">

                        <div className="max-w-xs">
                            <p className="font-semibold text-gray-500">Menu</p>
                            <hr />
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-2">
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view?id=${id}`)}
                            >Home</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/notification/notifications?id=${id}`)}
                            >Notifications
                            </button>
                            <button className="btn block p-2 bg-blue-100 rounded-tl-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/acknowledge/list/jobacklist?JobID=${id}`)}>
                                Job Acknowledgements
                            </button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/correspondence/correspondence?id=${id}`)}
                            >
                                Correspondence
                            </button>
                            <button className="btn block p-2 bg-gray-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/visit?id=${id}`)}
                            >Visit log</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/audit-report/list?JobID=${id}`)}
                            >Audit Report</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/compliance?JobID=${id}`)}
                            >Compliance</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Assessment</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Demand Notice</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Objection</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Tarc</button>
                        </div>

                    </div>
                </div>
            </div>
            {
                shouldCreateCorrespondence &&
            <div className="flex justify-end m-2">
                <NewVisitButton id={id} />
            </div>
            }
            <MaterialTable title="Visit logs"
                data={visitData}
                columns={fields}

                actions={
                    [

                        {
                            icon: MoreHoriz,
                            tooltip: 'Details',
                            onClick: handleRowClick
                        }
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
            <Dialog open={selectedRow !== null} onClose={handleClosePopup}>
                <DialogTitle>Visit Details</DialogTitle>
                <DialogContent>
                    <Typography> <p>Personel Met:<span className="font-bold">{selectedRow?.personnelmet}</span></p></Typography>
                    <Typography> <p>Designation: <span className="font-bold">{selectedRow?.designation}</span></p></Typography>
                    <Typography> <p>Done By: <span className="font-bold">{selectedRow?.doneby}</span></p></Typography>
                    <Typography> <p>Create Time: <span className="font-bold">{selectedRow?.createtime}</span></p></Typography>
                    <Typography> <p>Purpose: <span className="font-bold">{selectedRow?.purposeachieved}</span></p></Typography>
                    <Typography> <p>Note: <span className="font-bold">{selectedRow?.note}</span></p></Typography>
                </DialogContent>
            </Dialog>

        </>
    )
}
export default Visit