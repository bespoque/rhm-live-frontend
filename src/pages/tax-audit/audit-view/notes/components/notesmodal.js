import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import { useRouter } from 'next/router';
import { ProcessorSpinner } from '../../../../../components/spiner';

const NotesModal = ({ isOpen, closeModal, JobID }) => {
    const [isFetching, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
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
        data.note_file = "filepath"
        console.log("data", data);
        setIsLoading(true)

        try {
            const res = await fetch('https://bespoque.dev/rhm/taxaudit/taxaudit-newnote.php', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            const dataFetch = await res.json()
            toast.success(dataFetch.message);
            setIsLoading(false)
            router.push(`/tax-audit/audit-view/notes/list?JobID=${JobID}`)
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
                className="fixed inset-0 bg-white border max-w-sm p-4 mx-auto"
                overlayClassName="fixed inset-0 bg-black z-20 bg-opacity-75"

            >
                <div className="overflow-y-auto">
                    <h6 className="my-3">New Note</h6>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="mb-2">
                            <label className="block mb-1 ">
                                Note Headline:
                            </label>
                            <input
                                type="text"
                                id="note_headline"
                                name='note_headline'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>

                        <div className="mb-2">
                            <label className=" block mb-1">
                                Note File:
                            </label>
                            <input
                                type="file"
                                id="notification_file"
                                name="notification_file"
                                className="border border-gray-300  rounded px-2 py-1 w-full"
                                // onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="mb-1">
                            <label htmlFor="notification_delivery" className="block  mb-1 text-dark">
                                Type
                            </label>
                            <select
                                id="notification_delivery"
                                name='actionType'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            >
                                <option value="Initial">Initial</option>
                                <option value="Audit">Audit</option>
                                <option value="Due">Due</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Objection">Objection</option>
                                <option value="Completion">Completion</option>
                            </select>
                        </div>

                        <div className="mb-2">
                            <label className=" block mb-1">
                                Note Details:
                            </label>
                            <textarea
                                id="note_details"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                                name='note_details'
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

export default NotesModal;
