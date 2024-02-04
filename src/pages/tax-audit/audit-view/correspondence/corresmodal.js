import React, { useState } from 'react';
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

    const router = useRouter()

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName
    let jodId = id

    const multFormData = new FormData();


    const [formData, setFormData] = useState({
        job_id: jodId,
        subject: '',
        signee: '',
        receipt_datetime: '',
        lettersource: '',
        letterdate: '',
        doneby: staffName,

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

    // multFormData.append('job_id', jodId);
    // multFormData.append('subject', formData.subject);
    // multFormData.append('signee', formData.signee);
    // multFormData.append('lettersource', formData.lettersource);
    // multFormData.append('letterdate', formData.letterdate);
    // multFormData.append('letterdate', formData.doneby);
    // multFormData.append('receipt_datetime', formData.receipt_datetime);
    // multFormData.append('docfile', "test");

    formData.docfile = selectedFile


    const submitNotice = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newcorrespondence.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            const dataFetch = await res.json()
            setIsLoading(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                closeModal()
                // router.reload()

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
                className="fixed inset-0 bg-white border max-w-sm p-4 mx-auto overflow-y-scroll"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"

            >

                <div>
                    <h6 className="text-dark text-center">New Correspondence</h6>
                    <form onSubmit={submitNotice}>
                        <div className="mb-2">
                            <label className="block mb-1  text-dark">
                                Receipt date:
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
                        <div className="mb-1">
                            <label className="text-dark  block mb-1">
                                Related memo:
                            </label>
                            {/* <select name="lettersource"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                onChange={handleInputChange}
                                value={formData.lettersource}
                                required
                            >
                                <option value="FILE/00394/9392939">FILE/00394/9392939</option>
                                <option value="FILE/00494/2392935">FILE/00494/2392935</option>
                                <option value="FILE/00593/4395637">FILE/00593/4395637</option>
                            </select> */}
                            <input type="text"
                                name='lettersource'
                                value={formData.lettersource}
                                onChange={handleInputChange}
                                placeholder='eg. FILE/00394/9392939'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                

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
                                className="bg-blue-500 hover:bg-blue-600 text-dark py-2 px-4 rounded mt-4"
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
