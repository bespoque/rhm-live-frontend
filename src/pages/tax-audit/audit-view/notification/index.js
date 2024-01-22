import React, { useEffect, useState } from 'react';
import { ProcessorSpinner } from '../../../../components/spiner';
import { useRouter } from 'next/router';
import NewAckButton from '../acknowledge/button';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";

const Notification = () => {

    const [isFetching, setIsFetching] = useState(true);
    const [notice, setNotDet] = useState({});
    const [logData, setLogData] = useState([])
    const router = useRouter()
    const [reviewModal, setReviewModal] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [reviewDecline, setReviewDecline] = useState('');
    const [approveDecline, setApproveDecline] = useState('');
    const [verifyComment, setComment] = useState('');
    const [approveComment, setApprovedComment] = useState('');

    const { Notifid, JobID } = router?.query

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const emailAdd = decoded.user
    const groups = decoded.groups
    let creatorRange = [1, 4, 13, 15, 29]
    let ApprovalRange = [1, 2, 3, 12, 21, 27, 20, 30]
    const shouldCreateAcknowledgement = groups.some((element) => creatorRange.includes(element));
    const shouldApproveNoticeLetter = groups.some((element) => ApprovalRange.includes(element));

    const toggleReviewModal = () => {
        setReviewDecline("")
        setReviewModal(!reviewModal);
    };
    const toggleApproveModal = () => {
        setApproveDecline("")
        setApproveModal(!approveModal);
    };


    const fields = [

        {
            title: "Acknowledged by",
            field: "ack_by",
        },
        {
            title: "Relationship",
            field: "ack_relationship",
        },
        {
            title: "Channel",
            field: "ack_channel",
        },
        {
            title: "Type",
            field: "actionType"
        },
        {
            title: "Created time",
            field: "createtime",
        },
    ];


    const VerifyAction = async (e) => {
        setIsFetching(true)
        e.preventDefault()
        toggleReviewModal()
        let formData
        if (reviewDecline === "Decline") {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                action: "review",
                status: "Rejected",
                note: verifyComment || "Declined",
                doneby: emailAdd
            }

        } else {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                action: "review",
                status: "Verified",
                note: "Verified notice letter",
                doneby: emailAdd
            }
        }
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newnotification-approval.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsFetching(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                setIsFetching(!isFetching)
                // router.reload()

            }
        } catch (error) {
            setIsFetching(false)
            console.error('Server Error:', error)
        }
    }
    const ApproveAction = async (e) => {
        setIsFetching(true)
        e.preventDefault()
        toggleApproveModal()
        let formData
        if (approveDecline === "Decline") {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                action: "approve",
                status: "Rejected",
                note: approveComment || "Declined",
                doneby: emailAdd
            }

        } else {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                action: "approve",
                status: "Approved",
                note: "Approved notice letter ",
                doneby: emailAdd
            }
        }

        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newnotification-approval.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsFetching(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                setIsFetching(!isFetching)

            }
        } catch (error) {
            setIsFetching(false)
            console.error('Server Error:', error)
        }
    }



    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notifications-single.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID,
                        "id": Notifid,
                    })
                })
                const dataFetch = await res.json()
                setNotDet(dataFetch.body[0])
                setIsFetching(false)
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notification-ack-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID,
                        "notification_id": Notifid
                    })
                })
                const logData = await response.json()
                setLogData(logData.body)
            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [Notifid, JobID, isFetching]);


    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            {reviewModal && (
                <div className="modal">
                    <div className="modal-content" width="300">
                        <form onSubmit={VerifyAction}>
                            <p>Are you sure you want to {reviewDecline || "Verify"}?</p>
                            {reviewDecline === "Decline" && (
                                <div>
                                    <p className='mt-2'>Give reason(s) for
                                        declining</p>
                                    <textarea required className="form-control w-full rounded" minlength="10" maxlength="50" onChange={(e) => setComment(e.target.value)}></textarea>
                                </div>
                            )}
                            <div className="mt-2 flex justify-between">
                                <button onClick={toggleReviewModal}
                                    className="btn w-32 bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                                >
                                    Cancel
                                </button>
                                <div>

                                </div>
                                <button
                                    className="btn w-32 bg-purple-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                                    type="submit"
                                >
                                    Continue
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
            {approveModal && (
                <div className="modal">
                    <div className="modal-content" width="300">
                        <form onSubmit={ApproveAction}>
                            <p>Are you sure you want to {approveDecline || "Approve"}?</p>
                            {approveDecline === "Decline" && (
                                <div>
                                    <p className='mt-2'>Give reason(s) for
                                        declining</p>
                                    <textarea required className="form-control w-full rounded" minlength="10" maxlength="50" onChange={(e) => setApprovedComment(e.target.value)}></textarea>

                                </div>
                            )}

                            <div className="mt-2 flex justify-between">
                                <button onClick={toggleApproveModal}
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


            <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Notification Details</h2>
                    <div className="flex">
                        <button onClick={() => router.back()} className="p-2 bg-gray-400 text-white w-20 rounded mr-3">Back</button>
                        <button><a href={`https://test.rhm.backend.bespoque.ng/notification-file-pdf.php?fileno=${notice?.notification_fileno}&action=DOWNLOAD`} rel="noreferrer" target="_blank" className="p-2 bg-pink-400 text-white rounded">View letter</a></button>
                        <button><a href={`https://test.rhm.backend.bespoque.ng/notification-file-pdf.php?fileno=${notice?.notification_fileno}&action=EMAIL`} rel="noreferrer" target="_blank" className="p-2 bg-purple-400 ml-3 text-white rounded">Email</a></button>
                    </div>
                </div>
                <div className="flex justify-end gap-2 items-center mb-4">
                    {
                        <>
                            {notice?.reviewstatus === "Rejected" || notice?.approvestatus === "Rejected" ? "" :
                                <>
                                    {notice?.reviewstatus === null || notice?.reviewstatus === "Pending" ?
                                        <> {
                                            shouldApproveNoticeLetter &&
                                            <div>

                                                <button onClick={() => setReviewModal(true)} className="p-2 bg-purple-400 text-white w-20 rounded">Verify</button>
                                                <button onClick={(e) => {
                                                    setReviewModal(true)
                                                    setReviewDecline(e.target.value)
                                                }
                                                } className="p-2 bg-red-400 text-white w-20 rounded ml-2" value="Decline">Decline</button>
                                            </div>
                                        }
                                        </>
                                        : <>
                                            <>
                                                {
                                                    notice?.approvestatus === "Approved" ?
                                                        "" : <>
                                                            {
                                                                notice?.reviewstatus === "Verified" ?

                                                                    <div>
                                                                        {
                                                                            shouldApproveNoticeLetter &&
                                                                            <div>

                                                                                <button onClick={() => setApproveModal(true)} className="p-2 bg-green-400 text-white w-20 rounded">Approve</button>
                                                                                <button onClick={(e) => {
                                                                                    setApproveModal(true)
                                                                                    setApproveDecline(e.target.value)
                                                                                }

                                                                                } className="p-2 bg-red-400 text-white w-20 rounded ml-2" value="Decline">Decline</button>
                                                                            </div>
                                                                        }
                                                                    </div> : <> </>
                                                            }
                                                        </>
                                                }
                                            </>
                                        </>

                                    }
                                </>
                            }
                        </>
                    }

                    <div>
                        {
                            notice?.reviewstatus === "Rejected" || notice?.approvestatus === "Rejected" || notice?.approvestatus === null || notice?.reviewstatus === null ? "" :
                                <div>
                                    {
                                        shouldCreateAcknowledgement &&
                                        <NewAckButton Notifid={Notifid} JobID={JobID} />
                                    }

                                </div>

                        }
                    </div>

                </div>

                <p className="">
                    <span className="font-semibold">Notification Date:</span>{' '}
                    {notice?.notification_date}
                </p>
                <p className="">
                    <span className="font-semibold">Notification Status:</span>{' '}
                    {notice?.notification_status}
                </p>
                <p className="">
                    <span className="font-semibold">Notification Delivery:</span>{' '}
                    {notice?.notification_delivery}
                </p>
                <p className="">
                    <span className="font-semibold">Done By:</span> {notice?.doneby}
                </p>
                <p className="">
                    <span className="font-semibold">Create Time:</span>{' '}
                    {notice?.createtime}
                </p>
                {
                    notice?.reviewstatus === "Rejected" || notice?.approvestatus === "Rejected" ? (

                        <p>
                            <span className="font-semibold">REASON: </span>
                            <span className='font-bold'>{notice?.approvenote || notice?.reviewnote}</span>
                        </p>
                    )
                        : ""
                }
            </div>

            <MaterialTable title="Acknowledgements"
                data={logData}
                columns={fields}
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
    );
};

export default Notification;
