import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { SubmitButton } from '../../../../../components/CustomButton/CustomButton';
import { Select, Space } from 'antd';
import Modal from 'react-modal';
import { SignatureCol } from '../../../../../components/Images/Images';


const AllComplianceModals = ({
    isOpenNon,
    closeNoneCompModal,
    doneby,
    JobID,
    isOpenSpecial,
    closeSpecialModal,
    isOpenCompliance,
    closeModalCompliance
}) => {
    const [fileRef, setFileRef] = useState([])

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-filerefs.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        job_id: JobID,
                    })
                })
                const dataFetchJobDet = await response.json()
                setFileRef(dataFetchJobDet.body);
                // if (dataFetchJobDet.status === "400") {
                //     toast.error(dataFetchJobDet.message);
                // } else {
                // }

            } catch (error) {
                console.error('Server Error:', error)
            }
        }
        fetchPost();
    }, [JobID]);


    const NonCompliance = ({ isOpenNon, closeNoneCompModal, JobID, doneby }) => {
        const router = useRouter()
        const [isFetching, setIsFetching] = useState(() => false);
        const [formData, setFormData] = useState(() => { });
        const [toggleletter, setToggleLetter] = useState(() => "hidden");
        const [toggleForm, setToggForm] = useState(() => "");
        const { handleSubmit, register } = useForm();

        const Proceed = (data) => {
            setFormData(data)
            setToggleLetter('')
            setToggForm('hidden')
        }

        const handleNoneCompliance = async () => {

            formData.doneby = doneby
            formData.job_id = JobID
            formData.notification_status = "Pending"
            formData.notification_delivery = "Email"
            setIsFetching(true)
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newcompliance.php', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                })

                setIsFetching(false)
                const dataFetch = await response.json()
                if (dataFetch.status === "400") {
                    toast.error(dataFetch.message);
                } else {
                    toast.success(dataFetch.message);
                }
                closeNoneCompModal()
                // router.reload()
            } catch (error) {
                setIsFetching(false)
                console.error('Server Error:', error)
            }
        }

        function noneComplianceLetter() {
            return (
                <>
                    <div className=''>

                        <div className='flex justify-between'>
                            <p>Our Ref: {formData?.notification_fileno}</p>
                            <p>Date: {formData?.notification_date}</p>
                        </div><br />
                        <p className='w-64'>
                            The Managing Director,
                            NMPC FILLING STATION
                            Kpata Road Lokoja
                            Kogi State
                        </p><br />
                        <p>Dear: {formData?.notification_addressee}</p>
                        <p className='underline'>
                            OBTRUCTION AND UNDO-OPERATIVE ATTITUDE TO TAX
                            AUDIT EXERCISE
                        </p><br />
                        <p className='w-120'>
                            We use this medium to register the displeasure of the Service with
                            your Organization in respect of our uncooperative attitude highlighted
                            above.
                            Information at our disposal reveals that in spite of numerous reminders
                            and correspondence by our audit team to your Office, with the
                            objective of carrying out tax audit, your Organization remains
                            obstinate in making records required for the exercise available after
                            stipulated time frame. We find your reasons for the delay absolutely
                            unacceptable and view this as an affront to the Service
                        </p><br />
                        <p className='w-120'>
                            This attitude on the side of your Organization amounts to obstruction
                            to carrying out a legitimate tax audit, which is an offence under
                            <strong> Section 105 of the Personal Income Tax Act of 2011 as amended.</strong>
                        </p><br />
                        <p className='w-120'>
                            Please take this as our last effort insuring that the tax audit of your
                            Organization is carried out and will commence a week from the date of
                            receipt of this letter.
                            Failure in this regard will leave us with no option than to invoke the
                            relevant sections of the tax laws which include, but not restricted to
                            your Organization to be taxed on <strong>Best of Judgment (B.O.J)
                                Assessment</strong>
                        </p><br />
                        <p>
                            Your immediate compliance in this regard is envisaged.
                        </p>
                        <br /><br />
                        <p> Thank you,</p>
                        <br /><br />
                        <p>
                            For: Kogi State Internal Revenue Service
                        </p><br />
                        <SignatureCol />
                        <p>Sule Salihu Enehe</p>
                    </div>
                </>
            )
        }


        return (
            <>

                <Modal
                    isOpen={isOpenNon}
                    onRequestClose={closeNoneCompModal}
                    className="fixed inset-0 bg-white border w-1/2 p-4 mx-auto overflow-y-scroll"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
                >
                    <div className="modal-close flex justify-end top-0 right-0 cursor-pointer">
                        <span className="text-3xl" onClick={closeNoneCompModal}>
                            <FiX
                                className="stroke-current text-red-500"
                            />
                        </span>
                    </div>

                    <div className="modal-content py-4 text-left px-6 min-h-full">
                        <p className='text-center my-4 font-bold'>Create None-Compliance</p>
                        <div className={`${toggleletter}`}>
                            {noneComplianceLetter()}
                        </div>
                        <form onSubmit={handleSubmit(Proceed)} className={`${toggleForm}`}>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="mb-2">
                                    <label className="block mb-1  text-dark">
                                        Date:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        type="date"
                                        name='notification_date'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-1">
                                    <label className="block mb-1 text-dark">
                                        Recipient Email:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        name="notification_email"
                                        type="email"
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-1">
                                    <label className="text-dark  block mb-1">
                                        File Ref:
                                    </label>

                                    <input
                                        required
                                        ref={register()}
                                        type="text"
                                        name='notification_fileno'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />

                                </div>
                                <div className="mb-1">
                                    <label className="text-dark  block mb-1">
                                        Addressee:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        type="text"
                                        name='notification_addressee'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />

                                </div>
                                <div className="mb-1">
                                    <label className="text-dark  block mb-1">
                                        Type:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        type="text"
                                        readOnly
                                        value="Non-Compliance"
                                        name='actionType'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"


                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <SubmitButton
                                    type="submit"
                                >
                                    Proceed
                                </SubmitButton>
                            </div>
                        </form>
                        <div className={`flex justify-center mt-4 ${toggleletter}`} >
                            <button
                                className="bg-green-500 py-2 px-6 rounded-md  text-white border hover:text-green-500 hover:bg-white hover:border-green-500"
                                disabled={isFetching}
                                onClick={handleNoneCompliance}
                            >
                                {isFetching ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>

                    </div>
                </Modal>
            </>
        );
    };

    const SpecialNonComp = ({ JobID, doneby, isOpenSpecial, closeSpecialModal }) => {
        const [checkListData, setCheckData] = useState([])
        const [selectedItems, setSelectedItems] = useState([]);
        const [isFetching, setIsFetching] = useState(() => false);
        const [formData, setFormData] = useState(() => { });
        const [toggleletter, setToggleLetter] = useState(() => "hidden");
        const [toggleForm, setToggForm] = useState(() => "");
        const [checkLists, setCheckLists] = useState(() => []);
        const { Option } = Select;
        const { handleSubmit, register } = useForm();
        const router = useRouter()


        function SpecialNoneComplianceLetter() {
            return (
                <>
                    <div className=''>

                        <div className='flex justify-between text-justify'>
                            <p>Our Ref: {formData?.notification_fileno}</p>
                            <p>Date: {formData?.notification_date}</p>
                        </div><br />
                        <p className='w-64'>
                            The Managing Director,
                            NMPC FILLING STATION
                            Kpata Road Lokoja
                            Kogi State
                        </p><br />
                        <p>Dear: {formData?.notification_addressee}</p>
                        <p className='underline'>
                            RE-NOTIFICATION OF TAX AUDIT EXERCISE
                            REQUEST FOR SUBMISSION OF REQUISITE AUDIT DOCUMENTS
                        </p><br />
                        <p className='w-120'>
                            We wish to draw your attention to the above subject matter and the
                            recent Tax Audit exercise conducted on your organization for period
                            stated above. It was noted that some vital documents germane to the
                            substantial determination of the actual tax liabilities due are yet to be
                            provided by your organization.
                        </p><br />
                        <p className='w-120'>
                            Based on the aforementioned, we kindly request that you furnish us
                            with the document(s);
                        </p><br />
                        <ol className='w-120' style={{ listStyle: "A" }}>
                            {checkLists?.map((check, index) => (
                                <li key={index}>{check}</li>
                            ))}
                        </ol><br />
                        <p>
                            We will appreciate if the above documents are forwarded to the office
                            of the Executive Chairman within 7 days of receipt of this letter
                        </p>
                        <br /><br />
                        <p> Thank you,</p>
                        <br /><br />
                        <p>
                            For: Kogi State Internal Revenue Service
                        </p><br />
                        <SignatureCol />
                        <p>Sule Salihu Enehe</p>
                    </div>
                </>
            )
        }
        const Proceed = (data) => {
            setFormData(data)
            setToggleLetter('')
            setToggForm('hidden')
        }
        const handleChange = selectedItems => {

            // Map the selected items to an array of objects with value set to 'YES'
            const selectedItemsWithValues = checkListData?.map(item =>
                selectedItems.includes(item.checklist_item) ? 'YES' : 'NO'
            );

            setCheckLists(selectedItems);

            setSelectedItems(selectedItemsWithValues);
        };
        useEffect(() => {
            async function fetchPost() {
                try {
                    const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-jobchecklist.php', {
                        method: 'POST',
                        body: JSON.stringify({
                            job_id: JobID
                        })
                    })
                    const dataFetchJobDet = await response.json()
                    setCheckData(dataFetchJobDet.checklists)
                } catch (error) {
                    console.error('Server Error:', error)
                }
            }
            fetchPost();
        }, [JobID]);

        const handleSpecialNoneCompliance = async () => {
            formData.doneby = doneby
            formData.job_id = JobID
            formData.notification_status = "Pending"
            formData.notification_delivery = "Email"
            formData.checklists = String(selectedItems)
            setIsFetching(true)
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newcompliance.php', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                })

                setIsFetching(false)
                const dataFetch = await response.json()
                if (dataFetch.status === "400") {
                    toast.error(dataFetch.message);
                } else {
                    toast.success(dataFetch.message);
                }
                closeSpecialModal()
                // router.reload()
            } catch (error) {
                setIsFetching(false)
                console.error('Server Error:', error)
            }
        }


        return (
            <>

                <Modal
                    isOpen={isOpenSpecial}
                    onRequestClose={closeSpecialModal}
                    className="fixed inset-0 bg-white border w-1/2 p-4 mx-auto overflow-y-scroll"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
                >
                    <div className="modal-close flex justify-end top-0 right-0 cursor-pointer">
                        <span className="text-3xl" onClick={closeSpecialModal}>
                            <FiX
                                className="stroke-current text-red-500"
                            />
                        </span>
                    </div>

                    <div className="modal-content py-4 text-left px-6">
                        <p className='text-center my-4 font-bold'>Create Special non-Compliance</p>
                        <div className={`${toggleletter}`}>
                            {SpecialNoneComplianceLetter()}
                        </div>
                        <form onSubmit={handleSubmit(Proceed)} className={toggleForm}>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="mb-2">
                                    <label className="block mb-1  text-dark">
                                        Date:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        type="date"
                                        name='notification_date'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-1">
                                    <label className="block mb-1 text-dark">
                                        Recipient Email:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        name="notification_email"
                                        type="email"
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-1">
                                    <label className="text-dark  block mb-1">
                                        File Ref:
                                    </label>

                                    <input
                                        required
                                        ref={register()}
                                        type="text"
                                        name='notification_fileno'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />

                                </div>
                                <div className="mb-1">
                                    <label className="text-dark  block mb-1">
                                        Addressee:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        type="text"
                                        name='notification_addressee'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />

                                </div>
                                <div className="mb-1">
                                    <label className="text-dark  block mb-1">
                                        Type:
                                    </label>
                                    <input
                                        required
                                        ref={register()}
                                        type="text"
                                        readOnly
                                        value="Special Non-Compliance"
                                        name='actionType'
                                        className="border border-gray-300 rounded px-2 py-1 w-full"


                                    />
                                </div>
                                <div className='mb-1'>
                                    <label className="text-dark  block mb-1">
                                        Documents:
                                    </label>
                                    <Space
                                        direction="vertical"
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        <Select
                                            required
                                            size={'middle'}
                                            mode="multiple"
                                            placeholder="Select checklist items"
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        >
                                            {checkListData?.map(item => (
                                                <Option key={item.checklist_id} value={item.checklist_item}>
                                                    {item.checklist_item}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Space>

                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <div className="flex justify-center mt-4">
                                    <SubmitButton
                                        type="submit"
                                    >
                                        Proceed
                                    </SubmitButton>
                                </div>
                            </div>
                        </form>
                        <div className={`flex justify-center mt-4 ${toggleletter}`} >
                            <button
                                className="bg-green-500 py-2 px-6 rounded-md  text-white border hover:text-green-500 hover:bg-white hover:border-green-500"
                                disabled={isFetching}
                                onClick={handleSpecialNoneCompliance}
                            >
                                {isFetching ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>

                </Modal>

            </>
        );
    };
    const ComplianceModal = ({ isOpenCompliance, closeModalCompliance, doneby, JobID }) => {
        const router = useRouter()
        const [isFetching, setIsFetching] = useState(() => false);
        const { handleSubmit } = useForm();
        const currentDate = new Date().toISOString().split('T')[0];

        const handleCompliance = async (data) => {
            data.doneby = doneby
            data.job_id = JobID
            data.notification_status = "Pending"
            data.notification_delivery = "Email"
            data.actionType = "Compliance"
            data.notification_email = "none"
            data.notification_date = currentDate
            data.notification_fileno = null
            setIsFetching(true)
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newcompliance.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                })

                setIsFetching(false)
                const dataFetch = await response.json()
                if (dataFetch.status === "400") {
                    toast.error(dataFetch.message);
                } else {
                    toast.success(dataFetch.message);
                }
                closeModalCompliance()
                router.reload()
            } catch (error) {
                setIsFetching(false)
                console.error('Server Error:', error)
            }
        }


        return (
            <>
                {/* {isFetching && <ProcessorSpinner />} */}
                {isOpenCompliance && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                        <div className="modal-container bg-white w-120 mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">

                            <div className="modal-close flex justify-end top-0 right-0 cursor-pointer">
                                <span className="text-3xl" onClick={closeModalCompliance}>
                                    <FiX
                                        className="stroke-current text-red-500"
                                    />
                                </span>
                            </div>
                            <div className="modal-content py-4 text-left px-6">
                                <p className='text-center my-4 font-bold'>Are you sure you want to create compliance ?</p>
                                <form onSubmit={handleSubmit(handleCompliance)}>
                                    <div className="grid grid-cols-2 gap-2">
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <SubmitButton type="submit"
                                            disabled={isFetching}>
                                            {isFetching ? 'Submitting...' : 'Submit'}
                                        </SubmitButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <ToastContainer />
            <NonCompliance isOpenNon={isOpenNon} closeNoneCompModal={closeNoneCompModal} doneby={doneby} JobID={JobID} />
            <SpecialNonComp isOpenSpecial={isOpenSpecial} closeSpecialModal={closeSpecialModal} doneby={doneby} JobID={JobID} />
            <ComplianceModal isOpenCompliance={isOpenCompliance} closeModalCompliance={closeModalCompliance} doneby={doneby} JobID={JobID} />
        </>
    )

};

export default AllComplianceModals;


