
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { ProcessorSpinner } from '../../../../../components/spiner';
import Widget from '../../../../../components/widget';
import ScopeDropdown from '../components/scopedropdown';
import YearAndUpload from '../components/yearandupload';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatNumber } from 'accounting';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";


export default function AuditReportList() {
    const [isFetching, setIsFetching] = useState(() => true);
    const router = useRouter()
    const [job, setJob] = useState(() => []);
    const { JobID } = router?.query
    const [selectedScope, setSelectedScope] = useState('');
    const [uploadData, setUploadData] = useState([]);
    const [scopeData, setUploadCheck] = useState([]);
    const [uploadsArr, setUploadsArr] = useState([])
    const [taxSchedule, setTaxSchedule] = useState([])
    const [selectedRow, setSelectedRow] = useState(null);
    const [scheduleYear, setScheduleYear] = useState(null);
    const [dropdownVis, setDropdownVis] = useState(true);


    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const groups = decoded.groups
    let ApprovalRange = [1, 2, 3, 12, 21, 27, 20, 30]
    const shouldSeeApprovepageButton = groups.some((element) => ApprovalRange.includes(element));

    function getYearsInRange(startYear, endYear) {
        const years = [];

        if (startYear <= endYear) {
            for (let year = startYear; year <= endYear; year++) {
                years.push(year);
            }
        }
        return years;
    }

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

        if (item.monthlyschedules) {
            if (!documentValues[item.checklistID].monthlyschedules) {
                documentValues[item.checklistID].monthlyschedules = [];
            }
            documentValues[item.checklistID].monthlyschedules.push(...item.monthlyschedules);
        }
        // }
    });





    const startDate = job?.job_auditdate_start || "";
    const endDate = job?.job_auditdate_end || "";

    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    const auditStartYr = dateStart.getFullYear()
    const auditEndYr = dateEnd.getFullYear()


    const yearRange = getYearsInRange(auditStartYr, auditEndYr);

    const handleScopeChange = (selectedScope) => {
        setSelectedScope(selectedScope);
    };

    const toggleVis = (dropdownVis) => {
        setDropdownVis(dropdownVis)
    }

    const handleUpload = (selectedYear, taxScheduleFiles, remittanceFiles, amount, documentFiles) => {
        const newUpload = {
            selectedScope,
            selectedYear,
            taxScheduleFiles,
            remittanceFiles,
            amount,
            documentFiles,
        };

        setUploadData([newUpload]);
        // setUploadData([...uploadData, newUpload]);
    };

    useEffect(() => {

        async function fetchPost() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-fetch-singlejob.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "param1": "id",
                        "param2": JobID
                    })
                })
                const dataFetchJobDet = await response.json()
                setJob(dataFetchJobDet.body[0])

                setIsFetching(false)
            } catch (error) {
                setIsFetching(false)
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [JobID]);


    useEffect(() => {

        async function fetchPost() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID
                    })
                })

                const dataFetchJobDet = await response.json()
                setUploadsArr(dataFetchJobDet.body)

            } catch (error) {
                console.error('Server Error:', error)
            }
        }
        fetchPost();
    }, [JobID, uploadData]);

    useEffect(() => {
        async function fetchPostData() {
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-jobchecklist.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID
                    })
                })
                const dataFetchJobDet = await response.json()
                const check = await dataFetchJobDet.checklists
                setUploadCheck(check)
            } catch (error) {
                console.error('Server Error:', error)
            }
        }
        fetchPostData();
    }, [JobID]);



    const handleClick = async (year, checklistID) => {
        try {
            const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-schedule.php', {
                method: 'POST',
                body: JSON.stringify({
                    "job_id": JobID,
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

    const renderChecklistCards = () => {
        const checklistIds = Object.keys(documentValues);

        return checklistIds.map(checklistID => {
            const { years, remittedamount, documents, checklistName } = documentValues[checklistID];

            return (
                <div key={checklistID} className="bg-gray-200 p-4 m-2 rounded-lg w-64">
                    <p className="">{checklistName}</p>
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

        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded my-2" onClick={() => router.back()}>
                Back
            </button>

            <Widget>
                <div className="flex justify-between">
                    <p>Upload Audit documents</p>
                    {shouldSeeApprovepageButton &&
                        <div>
                            <button className="bg-green-500 text-white py-2 px-4 rounded my-2"
                                onClick={() => router.push(`/tax-audit/audit-view/audit-report/list/${JobID}`)}
                            >
                                View Audit
                            </button>

                        </div>
                    }
                </div>

                {dropdownVis && (
                    <div>
                        <ScopeDropdown scopeData={scopeData} onSelectScope={handleScopeChange} />

                    </div>
                )}


                {selectedScope !== "" && (
                    <div className="mt-4">
                        <YearAndUpload
                            years={yearRange}
                            selectedScope={selectedScope}
                            checklistItem={scopeData?.find(item => item.checklist_item === selectedScope)?.checklist_item}
                            checklistItemType={scopeData?.find(item => item.checklist_item === selectedScope)?.checklist_type}
                            checklistItemID={scopeData?.find(item => item.checklist_item === selectedScope)?.checklist_id}
                            onUpload={handleUpload}
                            JobID={JobID}
                            changeScope={handleScopeChange}
                            toggleVis={toggleVis}

                        />
                    </div>
                )}

                {uploadsArr && (
                    <>
                        <p className="text-center">Uploaded Documents</p>
                        <div className="container mx-auto">
                            <div className="flex flex-wrap justify-center">
                                {renderChecklistCards()}
                            </div>
                        </div>
                    </>

                )}
            </Widget>
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

        </>
    )
}
