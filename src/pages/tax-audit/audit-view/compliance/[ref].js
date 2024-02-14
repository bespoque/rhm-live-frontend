import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt from "jsonwebtoken";
import { FiX } from 'react-icons/fi';

const ViewCompliance = () => {
    const [reviewModal, setReviewModal] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [reviewDecline, setReviewDecline] = useState('');
    const [approveDecline, setApproveDecline] = useState('');
    const [verifyComment, setComment] = useState('');
    const [approveComment, setApprovedComment] = useState('');
    const [visitModal, setVisitModal] = useState(false);
    const router = useRouter()
    const urlData = router?.query.ref
    const [isFetching, setIsFetching] = useState(() => true);
    const [complianceData, setComplianceData] = useState([]);

    const [JobID = '', id = '', actionType = ''] = urlData?.split('_') || [];

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
    const shouldApproveCompliance = groups.some((element) => ApprovalRange.includes(element));

    const closeModal = () => {
        setVisitModal(false);
    }

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
                compliance_id: id,
                type: actionType,
                action: "verify",
                status: "Rejected",
                note: verifyComment || "Declined",
                doneby: staffName
            }

        } else {
            formData = {
                job_id: JobID,
                compliance_id: id,
                type: actionType,
                action: "verify",
                status: "Verified",
                note: "Verified",
                doneby: staffName
            }
        }
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-compliance-approval.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsFetching(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                closeModal()
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
                compliance_id: id,
                type: actionType,
                action: "approve",
                status: "Rejected",
                note: approveComment || "Declined",
                doneby: staffName
            }

        } else {
            formData = {
                job_id: JobID,
                compliance_id: id,
                type: actionType,
                action: "approve",
                status: "Approved",
                note: "Approved",
                doneby: staffName
            }
        }

        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-compliance-approval.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsFetching(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                closeModal()
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
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-compliance-single.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        job_id: JobID,
                        id: id
                    })
                })
                const dataFetchJobDet = await response.json()
                setComplianceData(dataFetchJobDet.body[0]);

                setIsFetching(false)


            } catch (error) {
                setIsFetching(false)
                console.error('Server Error:', error)
            }
        }
        fetchPost();
    }, [JobID, id]);
    return (
        <div>
            <ToastContainer />
            {reviewModal && (
                <div className="modal">
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                        <div className="modal-container bg-white w-120 mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">

                            <div className="modal-close flex justify-end top-0 right-0 cursor-pointer">
                                <span className="text-3xl" onClick={toggleReviewModal}>
                                    <FiX
                                        className="stroke-current text-red-500"
                                    />
                                </span>
                            </div>
                            <div className="modal-content py-4 text-left px-6">
                                <form onSubmit={VerifyAction}>
                                    <p>Are you sure you want to {reviewDecline || "Verify"}?</p>
                                    {reviewDecline === "Decline" && (

                                        <textarea required className="form-control w-full rounded" minlength="10" maxlength="50" onChange={(e) => setComment(e.target.value)}></textarea>
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
                                            className="btn w-32 bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                                            type="submit"
                                        >
                                            Continue
                                        </button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {approveModal && (
                <div className="modal">
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                        <div className="modal-container bg-white w-120 mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
                            <div className="modal-close flex justify-end top-0 right-0 cursor-pointer">
                                <span className="text-3xl" onClick={toggleApproveModal}>
                                    <FiX
                                        className="stroke-current text-red-500"
                                    />
                                </span>
                            </div>
                            <div className="modal-content py-4 text-left px-6">
                                <form onSubmit={ApproveAction}>
                                    <p>Are you sure you want to {approveDecline || "Approve"}?</p>
                                    {approveDecline === "Decline" && (

                                        <textarea required className="form-control w-full rounded" minlength="10" maxlength="50" onChange={(e) => setApprovedComment(e.target.value)}></textarea>
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
                    </div>
                </div>
            )}

            <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Compliance Details</h2>
                    <div className="flex">
                        <button onClick={() => router.back()} className="p-2 bg-gray-400 text-white w-20 rounded mr-3">Back</button>
                        {actionType === "NON-COMPLIANCE" && (
                            <>
                                <button><a href={`https://test.rhm.backend.bespoque.ng/letters-compliance-pdf.php?fileno=${complianceData?.notification_fileno}&job_id=${JobID}&action=DOWNLOAD`} rel="noreferrer" target="_blank" className="p-2 bg-pink-400 text-white rounded">View letter</a></button>
                                {/* {complianceData?.approvestatus === "Approved" && <>
                                    <button><a href={` https://test.rhm.backend.bespoque.ng/letters-compliance-pdf.php?fileno=${complianceData?.notification_fileno}&job_id=${JobID}&action=EMAIL`} rel="noreferrer" target="_blank" className="p-2 bg-purple-400 text-white ml-3 rounded">Email</a></button>
                                </>} */}
                            </>
                        )}
                        {actionType === "SPECIAL NON-COMPLIANCE" && (
                            <>
                                <button><a href={`https://test.rhm.backend.bespoque.ng/letters-special-non-compliance-pdf.php?fileno=${complianceData?.notification_fileno}&job_id=${JobID}&action=DOWNLOAD`} rel="noreferrer" target="_blank" className="p-2 bg-pink-400 text-white rounded">View letter</a></button>
                                {/* {complianceData?.approvestatus === "Approved" && <>
                                    <button><a href={` https://test.rhm.backend.bespoque.ng/letters-special-non-compliance-pdf.php?fileno=${complianceData?.notification_fileno}&job_id=${JobID}&action=EMAIL`} rel="noreferrer" target="_blank" className="p-2 bg-purple-400 text-white ml-3 rounded">Email</a></button>
                                </>} */}
                            </>
                        )}
                    </div>

                </div>
                <div className="flex justify-end gap-2 items-center mb-4">
                    {
                        <>
                            {complianceData?.reviewstatus === "Rejected" || complianceData?.approvestatus === "Rejected" ? "" :
                                <>
                                    {complianceData?.reviewstatus === null ?
                                        <>{
                                            shouldApproveCompliance &&
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
                                                    complianceData?.approvestatus === "Approved" ?
                                                        "" : <>
                                                            {
                                                                complianceData?.reviewstatus === "Verified" ?
                                                                    <div>
                                                                        {shouldApproveCompliance &&
                                                                            <>
                                                                                <button onClick={() => setApproveModal(true)} className="p-2 bg-green-400 text-white w-20 rounded">Approve</button>
                                                                                <button onClick={(e) => {
                                                                                    setApproveModal(true)
                                                                                    setApproveDecline(e.target.value)
                                                                                }

                                                                                } className="p-2 bg-red-400 text-white w-20 rounded ml-2" value="Decline">Decline</button>
                                                                            </>
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



                </div>


                <p className="">
                    <span className="font-semibold">Notification Delivery:</span>{' '}
                    {complianceData?.notification_delivery}
                </p>
                <p className="">
                    <span className="font-semibold">Done By:</span> {complianceData?.doneby}
                </p>
                <p className="">
                    <span className="font-semibold">Create Time:</span>{' '}
                    {complianceData?.createtime}
                </p>
                {
                    complianceData?.reviewstatus === "Rejected" || complianceData?.approvestatus === "Rejected" ? (

                        <p>
                            <span className="font-semibold">NOTE: </span>
                            <span className='font-bold'>{complianceData?.approvenote || complianceData?.reviewnote}</span>
                        </p>
                    )
                        : ""
                }
            </div>
        </div>
    )
}

export default ViewCompliance