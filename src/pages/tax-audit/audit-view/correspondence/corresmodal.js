import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProcessorSpinner } from '../../../../components/spiner';
import { useRouter } from 'next/router';


const CorresModal = ({ isOpen, closeModal, id }) => {

    const [isFetching, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileRef, setFileRef] = useState([])

    const router = useRouter()

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName
    let jobId = id

    const multFormData = new FormData();


    const [formData, setFormData] = useState({
        job_id: jobId,
        subject: '',
        signee: '',
        receipt_datetime: '',
        lettersource: '',
        letterdate: '',
        doneby: staffName
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        // if (file) {
        //     if (file.size > 200000) {
        //         alert("file size cannot be more than 200kb")
        //         setSelectedFile(null);
        //     }
        // } else {
        // }
    };

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-filerefs.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        job_id: jobId,
                    })
                })
                const dataFetchJobDet = await response.json()
                setFileRef(dataFetchJobDet.body);
            } catch (error) {
                console.error('Server Error:', error)
            }
        }
        fetchPost();
    }, [jobId]);

    multFormData.append('job_id', jobId);
    multFormData.append('subject', formData.subject);
    multFormData.append('signee', formData.signee);
    multFormData.append('lettersource', formData.lettersource);
    multFormData.append('letterdate', formData.letterdate);
    multFormData.append('doneby', formData.doneby);
    multFormData.append('receipt_datetime', formData.receipt_datetime);
    multFormData.append('document', selectedFile);



    formData.docfile = selectedFile
 
    const submitNotice = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newcorrespondence.php', {
                method: 'POST',
                // body: JSON.stringify(formData)
                body: multFormData
            })
            const dataFetch = await res.json()
            setIsLoading(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                closeModal()
                router.reload()

            }
        } catch (error) {
            setIsLoading(false)
            console.error('Server Error:', error)
        }
    }



    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 bg-white border w-1/2 p-4 mx-auto overflow-y-scroll"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"

            >

                <div>
                    <h6 className="text-dark text-center">New Correspondence</h6>
                    <form onSubmit={submitNotice}>
                        <div className='grid grid-cols-2 gap-1'>
                            <div className="mb-2">
                                <label className="block mb-1  text-dark">
                                    Correspondence letter Receipt date:
                                </label>
                                <input
                                    type="date"
                                    name='receipt_datetime'
                                    value={formData.receipt_datetime}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1  text-dark">
                                    Letter date:
                                </label>
                                <input
                                    type="date"
                                    name='letterdate'
                                    value={formData.letterdate}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />
                            </div>
                            <div className="mb-1">
                                <label className="block mb-1 text-dark">
                                    Signee:
                                </label>
                                <input
                                    name="signee"
                                    type="text"
                                    value={formData.signee}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />
                            </div>

                            <div className="mb-1">
                                <label className="block mb-1 text-dark">
                                    Subject:
                                </label>
                                <input
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />
                            </div>
                        </div>
                        <div className="mb-1">
                            <label className="text-dark  block mb-1">
                                Related memo:
                            </label>
                            <select
                                onChange={handleInputChange}
                                name='lettersource'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                            >
                                <option value="">Select an option</option>
                                {fileRef?.map((option) => (
                                    <option key={option.id} value={option.fileref}>
                                        {option.fileref} -  {option.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-2">
                            <label className="block mb-1  text-dark">
                                Upload document :
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                        </div>
                        {/* {selectedFile && (
                            <p>Selected file: {selectedFile.name}</p>
                        )} */}

                        <div className="flex justify-evenly">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
                                type="submit"
                            >
                                Submit
                            </button>

                            <button
                                className="bg-red-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mt-4 ml-2"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>

            </Modal>
        </>
    );
};

export default CorresModal;
