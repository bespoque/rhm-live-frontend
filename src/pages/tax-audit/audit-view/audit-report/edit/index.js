import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProcessorSpinner } from '../../../../../components/spiner';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";

function Index() {
    const [isFetching, setIsLoading] = useState(() => true);
    const [data, setData] = useState()
    const { register, handleSubmit } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()
    const { jobId, reportId } = router?.query
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );
    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch('https://bespoque.dev/rhm/taxaudit/taxaudit-auditreports-single.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": jobId,
                        "auditreport_id": reportId,
                    })
                })
                const dataFetch = await res.json()

                setData(dataFetch.body[0])
                setIsLoading(false)
            } catch (error) {
                console.log('Server Error:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost();
    }, [jobId, reportId]);

    const onSubmit = async (data) => {
        data.job_id = jobId
        data.auditreport_id = reportId
        data.doneby = staffName
        data.reportfile = "filepath"

        setIsLoading(true)
        try {
            const res = await fetch('https://bespoque.dev/rhm/taxaudit/taxaudit-newauditreview.php', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            const dataFetch = await res.json()
            console.log("dataFetch", dataFetch);
            toast.success(dataFetch.message);
            setIsLoading(false)
            // router.push(`/tax-audit/audit-view/acknowledge/list/jobacklist?JobID=${JobID}`)
        } catch (error) {
            setIsLoading(false)
            console.error('Server Error:', error)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div>
            {isFetching && <ProcessorSpinner />}
            <ToastContainer />
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 bg-white border max-w-sm p-4 mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"
            >
                <div className="overflow-y-auto">
                    <h6 className="my-3">New Report Review</h6>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Status:
                            </label>
                            <select
                                id="status"
                                name='status'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            >
                                <option value="Accepted">Accepted</option>
                                <option value="Denied">Denied</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">
                                Upload document:
                            </label>
                            <input type="file" name="" required id="" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">
                                Details:
                            </label>
                            <textarea

                                id="details"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                                name='details'
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
            <div>
                {data ?
                    <div className="container mx-auto mt-8 px-4">
                        <div className="flex justify-between  mb-6">
                            <h6 className="font-semibold">Audit Report Information</h6>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={openModal}>
                                New Report Review
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p><strong>Resolution:</strong> {data?.resolution}</p>
                            <p><strong>Status:</strong> {data?.status}</p>
                            <p><strong>Created Date:</strong> {data?.createdate}</p>
                        </div>
                    </div>
                    : <p>No Assessment data found</p>
                }
            </div>
        </div>
    )
}

export default Index