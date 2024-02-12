import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { ProcessorSpinner } from '../../../../components/spiner';

const AcknModal = ({ isOpen, closeModal, JobID, Notifid }) => {
    const [isFetching, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const router = useRouter()

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName


    const onSubmit = async (data) => {
        data.doneby = staffName
        data.job_id = JobID
        data.notification_id = Notifid
        data.actionType = "AUDIT VISIT"
        data.ack_relationship = data.ack_relationship || "null"
        data.ack_note = data.ack_note || "null"

        setIsLoading(true)

        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newacknowledment.php', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            const dataFetch = await res.json()
            setIsLoading(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                // router.reload()
                router.push(`/tax-audit/audit-view/acknowledge/list/jobacklist?JobID=${JobID}`)
            }

        } catch (error) {
            setIsLoading(false)
            console.error('Server Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 bg-white border max-w-lg p-4 mx-auto overflow-y-scroll"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"
            >
                <div >
                    <h6 className="my-3">New Acknowledgement</h6>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="mb-2">
                            <label className="block mb-1  ">
                                Acknowledgement Date:  <span className='text-red-600'>*</span>
                            </label>
                            <input
                                type="date"
                                id="ack_datetime"
                                name='ack_datetime'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Acknowledged by:   <span className='text-red-600'>*</span>
                            </label>
                            <input type="text" name="ack_by"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Relationship:
                            </label>
                            <input
                                type="text"
                                id="ack_relationship"
                                name='ack_relationship'
                                placeholder='eg. staff, wife, brother etc'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Delivery method: <span className='text-red-600'>*</span>
                            </label>
                            <select
                                id="ack_channel"
                                name='ack_channel'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            >
                                <option value="">Please Select</option>
                                <option value="courier">Courier</option>
                                <option value="email">Email</option>
                            </select>
                        </div>

                        <div className="mb-2">
                            <label className="block mb-1">
                                Note:
                            </label>
                            <textarea

                                id="ack_note"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                ref={register()}
                                name='ack_note'
                            ></textarea>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-600  py-2 px-4 rounded mt-4"
                            type="submit"
                        >
                            Submit
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mt-4 ml-2"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default AcknModal;
