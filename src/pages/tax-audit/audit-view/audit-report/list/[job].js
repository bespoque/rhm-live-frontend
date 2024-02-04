import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatNumber } from 'accounting';
import { FiCheck, FiX } from 'react-icons/fi';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";

function ApproveAuditUploads() {
    const [uploadsArr, setUploadsArr] = useState([])
    const [scheduleYear, setScheduleYear] = useState(null);
    const [taxSchedule, setTaxSchedule] = useState([])
    const [selectedRow, setSelectedRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [selectedOption, setSelectedOption] = useState('Approved');
    const [globalCheckId, setGlobalCheckId] = useState('');
    const [reloadAppr, setReloadApp] = useState(false);


    const router = useRouter()
    let jobId = router.query?.job

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName

    const handleButtonClick = (checklistID) => {
        setShowModal(true);
        setGlobalCheckId(checklistID);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleRadioChange = (value) => {
        setSelectedOption(value);
    };

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };
    const documentValues = {};

    uploadsArr?.forEach(item => {
        // if (item.document.trim() !== "") {
        if (documentValues[item.checklistID]) {
            documentValues[item.checklistID].documents.push(item.document);
            documentValues[item.checklistID].years.push(item.year);
            documentValues[item.checklistID].checklistName = item.checklistName; // Add this line
        } else {
            documentValues[item.checklistID] = {
                documents: [item.document],
                years: [item.year],
                checklistName: item.checklistName, // Add this line
            };
        }

        if (item.remittedamount.trim() !== "") {
            if (!documentValues[item.checklistID].remittedamount) {
                documentValues[item.checklistID].remittedamount = [];
            }
            documentValues[item.checklistID].remittedamount.push(item.remittedamount);
        }
        if (item.status.trim() !== "") {
            if (!documentValues[item.checklistID].status) {
                documentValues[item.checklistID].status = [];
            }
            documentValues[item.checklistID].status.push(item.status);
        }
        if (item.updatenote !== null) {
            if (!documentValues[item.checklistID].updatenote) {
                // documentValues[item.checklistID].updatenote = [];
            }
            documentValues[item.checklistID].updatenote = (item.updatenote);
        }

        if (item.monthlyschedules) {
            if (!documentValues[item.checklistID].monthlyschedules) {
                documentValues[item.checklistID].monthlyschedules = [];
            }
            documentValues[item.checklistID].monthlyschedules.push(...item.monthlyschedules);
        }


        // }
    });


    useEffect(() => {

        async function fetchPost() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": jobId
                    })
                })

                const dataFetchJobDet = await response.json()
                setUploadsArr(dataFetchJobDet.body)

            } catch (error) {
                console.error('Server Error:', error)
            }
        }
        fetchPost();
    }, [jobId, reloadAppr]);

    const handleClick = async (year, checklistID) => {
        try {
            const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-schedule.php', {
                method: 'POST',
                body: JSON.stringify({
                    "job_id": jobId,
                    "checklistID": checklistID,
                    "year": year
                })
            })
            const dataFetch = await response.json()
            setScheduleYear(year)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
                setSelectedRow(null);
            } else {
                const body = await dataFetch.body
                setTaxSchedule(body)
                const handleRowClick = () => {
                    setSelectedRow("value");
                };
                handleRowClick()
            }
        } catch (error) {
            console.error('Server Error:', error)
        }
    };

    const handleClosePopup = () => {
        setSelectedRow(null);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-approval.php', {
                method: 'POST',
                body: JSON.stringify({
                    job_id: jobId,
                    report: globalCheckId,
                    status: selectedOption,
                    note: textInput,
                    doneby: staffName
                })
            })
            const dataFetch = await response.json()
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
                setShowModal(false);
                setReloadApp(!reloadAppr)
            } else {
                const message = dataFetch.message
                toast.success(message)
                setReloadApp(!reloadAppr)
                setShowModal(false);
            }
        } catch (error) {
            console.error('Server Error:', error)
            setShowModal(false);
        }
    };

    const renderChecklistCards = () => {
        const checklistIds = Object.keys(documentValues);

        return checklistIds.map(checklistID => {
            const { years, remittedamount, documents, checklistName, status, updatenote } = documentValues[checklistID];
            const containsApproved = status.includes('Approved');
            const containsDeclined = status.includes('Declined');
            return (
                <div key={checklistID} className="bg-gray-200 p-4 m-2 rounded-lg w-64">
                    <div className="flex gap-2 justify-between">
                        <p className="self-center w-2/3">{checklistName}</p>

                        {containsApproved ? (
                            <span className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">

                                <FiCheck
                                    size={18}
                                    className="stroke-current text-green-500"
                                />
                            </span>
                        ) : containsDeclined ? (
                            <span className="h-10 w-10 bg-red-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                                <FiX
                                    className="stroke-current text-red-500"
                                />
                            </span>
                        ) :

                            (
                          
                                    <button className="bg-green-500 h-9 text-white py-2 px-4 rounded my-2" onClick={() => handleButtonClick(checklistID)}>
                                        Approve
                                    </button>
                                
                            )}

                    </div>
                    {updatenote && (

                        <div>
                            <p className="font-bold">Note</p>
                            <small>{updatenote}</small>
                        </div>

                    )}
                    {years && years.length > 0 && (
                        <div className="my-2">
                            <strong>Years:</strong>
                            {remittedamount?.length > 0 ?
                                <ul className="flex gap-2">
                                    {years.map((year, index) => (
                                        <li key={index} onClick={() => handleClick(year, checklistID)}>
                                            <p className="underline text-green-400 cursor-pointer" >
                                                {year}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                :

                                <ul className="flex gap-2">
                                    {years.map((year, index) => (
                                        <li key={index}>
                                            <p>
                                                {year}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    )}
                    {remittedamount && (
                        <div className="my-2">
                            <strong>Remitted Amount:</strong> <br /> {(remittedamount.join(', '))}
                        </div>
                    )}

                    {documents && documents.length > 0 && (
                        <div className="my-2">
                            <strong>Documents:</strong>
                            <ul className="flex gap-2">
                                {documents.map((document, index) => (
                                    <li key={index}>
                                        <a href={`https://test.rhm.backend.bespoque.ng/taxaudit/${document}`} className="underline text-green-400" target="_blank" rel="noopener noreferrer">
                                            view
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        });
    };
    return (
        <div className="relative">
            <ToastContainer />
            <div className="flex justify-end">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded my-2" onClick={() => router.back()}>
                    Back
                </button>
            </div>
            {uploadsArr && (
                <>
                    <p className="text-center">Approve Uploaded Documents</p>
                    <div className="container mx-auto">
                        <div className="flex flex-wrap justify-center">
                            {renderChecklistCards()}
                        </div>
                    </div>
                </>

            )}

            <Dialog open={selectedRow !== null} onClose={handleClosePopup} >
                <DialogContent>
                    <DialogTitle>Tax Schedule for {scheduleYear}</DialogTitle>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>tax Id</th>
                                <th>year</th>
                                <th>staffid</th>
                                <th>firstname</th>
                                <th>lastname</th>
                                <th>annualsalary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {taxSchedule?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.taxid}</td>
                                    <td>{item.year}</td>
                                    <td>{item.staffid}</td>
                                    <td>{item.firstname}</td>
                                    <td>{item.lastname}</td>
                                    <td>{formatNumber(item.annualsalary)}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                </DialogContent>
            </Dialog>



            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

                    <div className="modal-container bg-white w-96 mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">

                        <div className="modal-close flex justify-end top-0 right-0 cursor-pointer">
                            <span className="text-3xl" onClick={handleModalClose}>
                                <FiX
                                    className="stroke-current text-red-500"
                                />
                            </span>
                        </div>
                        <div className="modal-content py-4 text-left px-6">
                            <form onSubmit={handleFormSubmit}>
                                <label className="block mb-2">
                                    Please type your Reason
                                    <textarea className="border rounded w-full py-2 px-3" rows="2" cols="10"
                                        onChange={handleInputChange}
                                        value={textInput}
                                        required
                                    >
                                    </textarea>
                                </label>
                                <div className="mb-4 flex justify-center gap-4">
                                    <label className="block">
                                        Approve
                                        <input
                                            required
                                            type="radio"
                                            value="Approved"
                                            checked={selectedOption === 'Approved'}
                                            onChange={() => handleRadioChange('Approved')}
                                        />
                                    </label>
                                    <label className="block">
                                        Decline
                                        <input
                                            required
                                            type="radio"
                                            value="Declined"
                                            checked={selectedOption === 'Declined'}
                                            onChange={() => handleRadioChange('Declined')}
                                        />
                                    </label>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ApproveAuditUploads