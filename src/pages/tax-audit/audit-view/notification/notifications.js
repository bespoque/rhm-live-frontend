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
import MaterialTable from '@material-table/core';
import NewNotificationButton from './../notification/button';
import Modal from '@material-ui/core/Modal';
import { FiArrowUp, FiPlusCircle } from 'react-icons/fi';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";


const AuditNotice = () => {
    const [isFetching, setIsFetching] = useState(() => true);
    const [job, setJob] = useState(() => []);
    const [notificationData, setNotificationData] = useState(() => []);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
    const [isModalOpenPDF, setIsModalOpenPDF] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [jobUsers, setJobUsers] = useState([]);


    const router = useRouter()
    const { id } = router?.query
    const jobId = id

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const groups = decoded.groups
    let creatorRange = [1, 4, 13, 15, 29]
    const shouldCreateNoticeLetter = groups.some((element) => creatorRange.includes(element));

    const handleActionChange = (action, rowData) => {
        switch (action) {
            case 'details':
                handleDetails(rowData);
                break;
            case 'acknowledge':
                handleAcknowledge(rowData);
                break;
            case 'reschedule':
                handleReschedule(rowData);
                break;
            case 'letter':
                handleLetter(rowData);
                break;
            default:
                break;
        }
    }

    const handleDetails = (rowData) => {
        router.push(`/tax-audit/audit-view/notification?Notifid=${rowData.id}&JobID=${rowData.job_id}`)
    };

    const handleAcknowledge = (rowData) => {
        router.push(`/tax-audit/audit-view/acknowledge/list/notifacklist?Notifid=${rowData.id}&JobID=${rowData.job_id}&auditStartYr=${auditStartYr}&auditEndYr=${auditEndYr}&fileref=${rowData.notification_fileno}`)
    }
    const handleReschedule = (rowData) => {
        router.push(`/tax-audit/audit-view/acknowledge/list/reschedulelist?Notifid=${rowData.id}&JobID=${rowData.job_id}`);
    }
    const handleLetter = (rowData) => {
        setSelectedPdfUrl(`https://test.rhm.backend.bespoque.ng/notification-file-pdf.php?fileno=${rowData.notification_fileno}&action=DOWNLOAD`);
        setIsModalOpenPDF(true);
    }

    const fields = [
        {
            title: "Notice Date",
            field: "notification_date",
        },
        {
            title: "Created by",
            field: "doneby",
        },
        {
            title: "Status",
            field: "status",
        },
        {
            title: "Created time",
            field: "createtime",
        },
        {
            title: "Type",
            field: "actionType"
        },
        {
            title: 'Actions',
            field: 'actions',
            filtering: false,
            render: rowData => (
                <select
                    onChange={(e) => handleActionChange(e.target.value, rowData)}
                    defaultValue=""
                    // className="appearance-none bg-transparent border-none 
                    style={{
                        appearance: 'none',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="" disabled hidden>
                        More...
                    </option>

                    <option value="details">Details</option>
                    <option disabled={rowData?.status === "Rejected" || rowData?.status === null} value="acknowledge">Acknowledgements</option>
                    <option disabled={rowData?.status === "Rejected" || rowData?.status === null} value="reschedule">Reschedules</option>
                    {rowData.status === "Approved" && (
                        <option value="letter">Letter</option>
                    )}
                </select>
            ),
        },

    ];

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

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
                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notifications-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": id,
                    })
                })
                const dataFetch = await res.json()
                if (dataFetch && dataFetch.body) {
                    const updatedData = {
                        ...dataFetch,
                        body: dataFetch.body.map(record => {
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

                    setNotificationData(updatedData.body);
                }

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
                <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-2" >
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
                            <button className="btn block p-2 bg-gray-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/notification/notifications?id=${id}`)}
                            >Notifications</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tl-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/acknowledge/list/jobacklist?JobID=${id}`)}>
                                Job Acknowledgements
                            </button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/correspondence/correspondence?id=${id}`)}
                            >
                                Correspondence
                            </button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/visit?id=${id}`)}
                            >Visit log</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/audit-report/list?JobID=${id}`)}
                            >
                                Audit Report
                            </button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2"
                                onClick={() => router.push(`/tax-audit/audit-view/compliance?JobID=${id}`)}
                            >
                                Compliance
                            </button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Assessment</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Demand Notice</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Objection</button>
                            <button className="btn block p-2 bg-blue-100 rounded-tr-lg m-2">Tarc</button>

                        </div>

                    </div>
                </div>
            </div>

            {shouldCreateNoticeLetter &&
                <div className="flex justify-end m-2">

                    <NewNotificationButton id={jobId} auditStartYr={auditStartYr} address={job?.taxpayer_Address} auditEndYr={auditEndYr} />
                </div>
            }
            <MaterialTable title="Notifications"
                data={notificationData}
                columns={fields}

                // actions={
                //     [

                //         {
                //             icon: MoreHoriz,
                //             tooltip: 'Details',
                //             onClick: (event, rowData) => router.push(`/tax-audit/audit-view/notification?Notifid=${rowData.id}&JobID=${rowData.job_id}`),
                //         },
                //         rowData => ({
                //             icon: NextWeekRounded,
                //             tooltip: 'Acknowledgement',
                //             onClick: (event, rowData) => router.push(`/tax-audit/audit-view/acknowledge/list/notifacklist?Notifid=${rowData.id}&JobID=${rowData.job_id}&auditStartYr=${auditStartYr}&auditEndYr=${auditEndYr}`),
                //             hidden: rowData.status === "Rejected" || rowData.status === null || rowData.status === "Pending"

                //         }),
                //         {
                //             icon: Email,
                //             tooltip: 'Letter',
                //             onClick: (event, rowData) => {
                //                 setSelectedPdfUrl(`https://test.rhm.backend.bespoque.ng/notification-file-pdf.php?fileno=${rowData.notification_fileno}`);
                //                 setIsModalOpenPDF(true);
                //             }

                //         },
                //         {
                //             icon: Extension,
                //             tooltip: 'view Reschedules',
                //             onClick: (event, rowData) => {
                //                 router.push(`/tax-audit/audit-view/acknowledge/list/reschedulelist?Notifid=${rowData.id}&JobID=${rowData.job_id}`);
                //             }

                //         },
                //     ]
                // }

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
            <Modal
                open={isModalOpenPDF}
                onClose={() => setIsModalOpenPDF(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <iframe
                    title="PDF Viewer"
                    src={selectedPdfUrl}
                    width="50%"
                    height="600"
                />
            </Modal>

        </>
    )
}
export default AuditNotice