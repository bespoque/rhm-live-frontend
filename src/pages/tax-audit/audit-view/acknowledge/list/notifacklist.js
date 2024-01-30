
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
import { HomeRounded } from '@material-ui/icons'
import { useForm } from 'react-hook-form'
import jwt from "jsonwebtoken";
import Modal from 'react-modal';
import MaterialTable from '@material-table/core'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { shallowEqual, useSelector } from 'react-redux'
import { SignatureCol } from '../../../../../components/Images/Images'


export default function Notifiacklist() {
    const [isFetching, setIsFetching] = useState(() => true);
    const [notifAck, setNotifAck] = useState([]);
    const [ackId, setAckId] = useState('');
    const router = useRouter()
    const [formState, setFormState] = useState('')
    const [formData, setFormData] = useState({})
    const [letterState, setLetterState] = useState('hidden')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit } = useForm();
    const [notificationData, setNotification] = useState({});
    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const { JobID, Notifid, auditStartYr, auditEndYr, fileref } = router?.query
    const decoded = jwt.decode(auth);
    const emailAdd = decoded.user
    const groups = decoded.groups
    let creatorRange = [1, 4, 13, 15, 29]

    console.log("JobID", JobID);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fields = [
        {
            title: "Relationship",
            field: "ack_relationship",
        },
        {
            title: "Acknowledged by",
            field: "ack_by",
        },
        {
            title: "Delivery method",
            field: "ack_channel",
        },
        {
            title: "Created time",
            field: "createtime",
        },
    ];


    var currentDate = new Date();

    // Get the current date components
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // Months are zero-based
    var year = currentDate.getFullYear();

    // Format the date as a string (you can customize the format as needed)
    var dateFormatted = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);


   

    const onSubmit = async () => {
        formData.doneby = emailAdd
        formData.job_id = JobID
        formData.notification_id = Notifid
        formData.actionType = "Accepted"
        formData.reschedule_notifydate = dateFormatted
        console.log("formdata", formData);
        setIsFetching(true)

        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newreschedule.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            setIsFetching(false)
            const dataFetch = await res.json()
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                closeModal()
                // router.push(`/tax-audit/audit-view/acknowledge/list/reschedulelist?Notifid=${Notifid}&JobID=${JobID}`)
                // router.push(`/tax-audit/audit-view/acknowledge/list/reschedulelist?Notifid=${Notifid}&JobID=${JobID}`)
            }
        } catch (error) {
            setIsFetching(false)
            console.error('Server Error:', error)
        }
    }

    useEffect(() => {
        async function fetchPostData() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notifications-single.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        job_id: JobID,
                        id: Notifid

                    })
                })
                const dataFetchJobDet = await response.json()
                const notification = await dataFetchJobDet.body[0]
                console.log("dataFetchJobDet", dataFetchJobDet.body[0]);
                setNotification(notification)
            } catch (error) {
                console.error('Server Error:', error)
            }
        }
        fetchPostData();
    }, [JobID]);

    useEffect(() => {
        async function fetchPost() {

            try {
                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notification-ack-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID,
                        "notification_id": Notifid,
                    })
                })
                const dataFetch = await res.json()
                setNotifAck(dataFetch.body)
                setIsFetching(false)
            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [JobID, Notifid]);

    const today = new Date()
    let formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    let customDate = new Date(formData?.reschedule_date);
    let rescheduleDate = customDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    let oldNoticeDate = new Date(notificationData?.notification_date);
    let oldNoticeDateFormatted = oldNoticeDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });


    function Letter() {
        return (
            <div>
                <div>
                    <div className="text-justify" >
                        <p className="flex justify-between mt-3">   </p>
                        <p>Ref - {formData?.reschedule_lettersource}</p>
                        <p>Date -  {formattedDate}</p>
                        <p className="w-64">{"Address"}</p>
                        <p className="font-bold">Dear {formData?.reschedule_adressee},</p><br />
                        <div>
                            <p className="font-bold">RE-NOTIFICATION OF TAX AUDIT EXERCISE {` (Jan ${auditStartYr} - Dec ${auditEndYr})`}</p><br />
                        </div>

                        <p>
                            Your letter dated <strong>{oldNoticeDateFormatted}</strong> on the above subject matter
                            refers please.
                            We wish to inform you that your request for the postponement of
                            the proposed
                            audit exercise has been approved by the Service.  The exercise
                            has been rescheduled to hold on <strong> {rescheduleDate}. </strong>
                            We anticipate maximum cooperation from you.
                            Thank you.
                        </p><br />


                        <p>Thank you for the anticipated cooperation.</p> <br />
                        <p>
                            Yours Faithfully..
                        </p>
                        <p>For: <span className="font-bold">KOGI STATE INTERNAL REVENUE SERVICE </span></p><br />
                        <SignatureCol />
                        <p className="font-bold">Sule Salihu Enehe</p>
                        Executive Chairman

                    </div>

                </div>
            </div>
        )
    }


    const Proceed = (data) => {

        setFormData(data)
        setLetterState('')
        setFormState('hidden')

    }


    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <div className='flex justify-end mb-3'>
                <button onClick={() => router.back()} className="p-2 bg-gray-400 text-white w-20 rounded mr-3">Back</button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 bg-white border max-w-md p-4 mx-auto overflow-y-scroll"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"

            >
                <div className={`${letterState}`}>
                    <Letter />
                </div>
                <div className={`${formState}`}>
                    <h6 className="text-dark text-center">Reschedule Visit</h6>
                    <form onSubmit={handleSubmit(Proceed)}>
                        <div className="p-2">
                            <div className="mb-2">
                                <label className="block mb-1">
                                    Reschedule Date:
                                </label>
                                <input
                                    type="date"
                                    id="reschedule_date"
                                    name="reschedule_date"
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required
                                    ref={register()}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">
                                    Addressee:
                                </label>
                                <input
                                    type="text"
                                    name="reschedule_adressee"
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required
                                    ref={register()}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">
                                    Letter Source:
                                </label>
                                <input
                                    type="text"
                                    name="reschedule_lettersource"
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required
                                    value={fileref}
                                    ref={register()}
                                    readOnly
                                />

                            </div>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-dark py-2 px-4 rounded mt-4"
                        >
                            Procced
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mt-4 ml-2"
                            onClick={closeModal}
                        >
                            Close
                        </button>

                    </form>
                </div>
                <div className={`${letterState} flex justify-evenly`}>
                    <button
                        className="bg-green-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mt-4 ml-2"
                        onClick={onSubmit}
                    >
                        Send
                    </button>
                    <button
                        className="bg-red-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mt-4 ml-2"
                        onClick={() => {
                            setFormState('')
                            setLetterState('hidden')
                            closeModal()
                        }}
                    >
                        Close
                    </button>
                </div>
            </Modal>

            <MaterialTable title="Notification acknowledegements"
                data={notifAck}
                columns={fields}
                actions={[
                    () => {
                        if (groups.some(r => creatorRange.includes(r))) {
                            return {
                                icon: HomeRounded,
                                tooltip: 'Reschedule Visit',
                                onClick: (event, rowData) => {
                                    setAckId(rowData.id)
                                    openModal()
                                }
                            };
                        }
                        else {
                            return {

                                icon: HomeRounded,
                                hidden: true,
                                tooltip: 'Reschedule Visit',
                                onClick: (event, rowData) => {
                                    setAckId(rowData.id)
                                    openModal()
                                }
                            };
                        }
                    },
                ]}
                // actions={
                //     [
                //         {
                //             icon: HomeRounded,
                //             tooltip: 'Reschedule Visit',
                //             onClick: (event, rowData) => {
                //                 setAckId(rowData.id)
                //                 openModal()
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

        </>
    )
}
