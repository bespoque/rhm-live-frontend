import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ProcessorSpinner } from '../../../../../components/spiner';

const Notification = () => {

    const [isFetching, setIsFetching] = useState(true);
    const [notice, setNotDet] = useState({});

    const router = useRouter()
    const [reviewModal, setReviewModal] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [reviewDecline, setReviewDecline] = useState('');
    const [approveDecline, setApproveDecline] = useState('');
    const [verifyComment, setComment] = useState('');
    const [approveComment, setApprovedComment] = useState('');

    const { Notifid, JobID, ReschId } = router?.query

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName
    const groups = decoded.groups
    let ApprovalRange = [1, 2, 3, 12, 21, 27, 20, 30]
    const shouldApproveReschedule = groups.some((element) => ApprovalRange.includes(element));

    const toggleReviewModal = () => {
        setReviewDecline("")
        setReviewModal(!reviewModal);
    };
    const toggleApproveModal = () => {
        setApproveDecline("")
        setApproveModal(!approveModal);
    };

    const VerifyAction = async (e) => {
        setIsFetching(true)
        e.preventDefault()
        toggleReviewModal()
        let formData
        if (reviewDecline === "Decline") {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                reschedule_id: ReschId,
                action: "review",
                status: "Rejected",
                note: verifyComment || "Declined",
                doneby: staffName
            }

        } else {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                reschedule_id: ReschId,
                action: "review",
                status: "Verified",
                note: "Letter verified",
                doneby: staffName
            }
        }
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newreschedule-approval.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsFetching(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                router.reload()

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
                reschedule_id: ReschId,
                action: "approve",
                status: "Rejected",
                note: approveComment || "Declined",
                doneby: staffName
            }

        } else {
            formData = {
                job_id: JobID,
                notification_id: Notifid,
                reschedule_id: ReschId,
                action: "approve",
                status: "Approved",
                note: "Letter approved",
                doneby: staffName
            }
        }

        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newreschedule-approval.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsFetching(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                router.reload()

            }
        } catch (error) {
            setIsFetching(false)
            console.error('Server Error:', error)
        }
    }


    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notification-reschedule-single.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID,
                        "notification_id": Notifid,
                        "reschedule_id": ReschId,
                    })
                })
                const dataFetch = await res.json()
                setNotDet(dataFetch.body[0])
                setIsFetching(false)


            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [Notifid, JobID, ReschId]);

    return (
        <>
            <ToastContainer />

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


            {isFetching && <ProcessorSpinner />}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Reschedule Details</h2>
                    <div className="flex">
                        <button onClick={() => router.back()} className="p-2 bg-gray-400 text-white w-20 rounded mr-3">Back</button>
                        <button><a href={`https://test.rhm.backend.bespoque.ng/letters-reschedule-pdf.php?fileno=${notice?.reschedule_lettersource}&reschID=${ReschId}&action=DOWNLOAD`} rel="noreferrer" target="_blank" className="p-2 bg-pink-400 text-white rounded">View letter</a></button>
                        {/* {notice?.approvestatus === "Approved" && <>
                            <button><a href={`https://test.rhm.backend.bespoque.ng/letters-reschedule-pdf.php?fileno=${notice?.reschedule_lettersource}&reschID=${ReschId}&action=EMAIL`} rel="noreferrer" target="_blank" className="p-2 bg-purple-400 ml-3 text-white rounded">Email</a></button>
                        </>} */}
                    </div>
                </div>
                <div className="flex justify-end gap-2 items-center mb-4">
                    {
                        <>
                            {notice?.reviewstatus === "Rejected" || notice?.approvestatus === "Rejected" ? "" :
                                <>
                                    {notice?.reviewstatus === null || notice?.reviewstatus === "Pending" ?
                                        <>
                                            {shouldApproveReschedule &&
                                                <div>

                                                    <button onClick={() => setReviewModal(true)} className="p-2 bg-purple-400 text-white w-20 rounded">Verify</button>
                                                    <button onClick={(e) => {
                                                        setReviewModal(true)
                                                        setReviewDecline(e.target.value)
                                                    }
                                                    } className="p-2 bg-red-400 text-white w-20 ml-2 rounded" value="Decline">Decline</button>
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
                                                                        {shouldApproveReschedule &&
                                                                            <div className='flex'>
                                                                                <button onClick={() => setApproveModal(true)} className="p-2 bg-green-400 text-white w-20 rounded">Approve</button>
                                                                                <button onClick={(e) => {
                                                                                    setApproveModal(true)
                                                                                    setApproveDecline(e.target.value)
                                                                                }

                                                                                } className="p-2 bg-red-400 text-white w-20 rounded ml-2" value="Decline">Decline</button>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    : <> </>
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


                </div>

                <p className="">
                    <span className="font-semibold">Reschedule Date:</span>{' '}
                    {notice?.reschedule_date}
                </p>
                <p className="">
                    <span className="font-semibold">Reschedule lettersource</span>{' '}
                    {notice?.reschedule_lettersource}
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
                            <span className="font-semibold">NOTE: </span>
                            <span className='font-bold'>{notice?.approvenote || notice?.reviewnote}</span>
                        </p>
                    )
                        : ""
                }
                {/* {
                    notice?.reviewnote && (

                        <p>
                            <span className="font-semibold">NOTE: </span>{' '}
                            <span className='font-bold'>{notice?.reviewnote || notice?.approvenote}</span>
                        </p>
                    )
                } */}
            </div>
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
