import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProcessorSpinner } from '../../../../../components/spiner';

const YearAndUpload = ({ years,
    selectedScope,
    toggleVis,
    checklistItem,
    checklistItemType,
    onUpload,
    JobID,
    checklistItemID,
    changeScope }) => {
    const [selectedYear, setSelectedYear] = useState("");
    const [taxScheduleFiles, setTaxScheduleFiles] = useState(null);
    const [remittanceFiles, setRemittanceFiles] = useState(null);
    const [documentFiles, setDocumentFiles] = useState(null);
    const [amount, setAmount] = useState('');
    const [isFetching, setIsFetching] = useState(() => false);


    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleTaxScheduleChange = (event) => {
        let file = event.target.files[0]
        const filetype = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (file) {

            if (!filetype.includes(file.type)) {
                alert("file type not allowed. only excel/CSV is allowed");
                setTaxScheduleFiles(null);
                return;
            }
            if (file.size > 1024 * 200) {
                alert("file too large..file size shoulde not exceed 200kb");
                return
            }
            else {
                setTaxScheduleFiles(file);
            }
        }
    };
    const handleAmountChange = (event) => {
        const { value } = event.target;
        const onlyNumbers = value.replace(/[^0-9]/g, '');
        const formattedValue = new Intl.NumberFormat().format(onlyNumbers);
        setAmount(formattedValue);
    };

    const handleRemittanceChange = (event) => {
        setRemittanceFiles(event.target.files[0]);
    };
    const handleDocumenteChange = (event) => {
        setDocumentFiles(event.target.files[0]);
    };


    const handleUpload = async () => {
        toggleVis(false)
        const formData = new FormData();
        let amountFormatted = amount?.replace(/,/g, '')
        if (
            (checklistItemType === 'EXCEL' &&
                selectedYear &&
                amount &&
                taxScheduleFiles !== null &&
                remittanceFiles.name !== null) ||
            (checklistItemType === 'PDF' && selectedYear && documentFiles !== null)
        ) {
            if (checklistItemType === 'EXCEL' &&
                selectedYear &&
                amount &&
                taxScheduleFiles !== null &&
                remittanceFiles !== null) {
                formData.append("job_id", JobID)
                formData.append("schedule", taxScheduleFiles)
                formData.append("document", remittanceFiles)
                formData.append("year", selectedYear)
                formData.append("RemittedAmount", amountFormatted)
                formData.append("doneby", staffName)
                formData.append("CheckListID", checklistItemID)
                setIsFetching(true)
                try {
                    const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-new.php', {
                        method: 'POST',
                        body: formData
                    })
                    changeScope("")
                    toggleVis(true)
                    const dataFetch = await res.json()
                    setIsFetching(false)
                    if (dataFetch.status === "400") {
                        toast.error(dataFetch.message);
                    } else {
                        toast.success(dataFetch.message);
                        // setSelectedYear("");
                        // setTaxScheduleFiles([]);
                        // setRemittanceFiles([]);
                        // setDocumentFiles([]);
                        // setAmount('');
                    }

                } catch (error) {
                    toggleVis(true)
                    setIsFetching(false)
                    console.error('Server Error:', error)
                }
            } else {
                formData.append("job_id", JobID)
                formData.append("document", documentFiles)
                formData.append("schedule", " ")
                formData.append("year", selectedYear)
                formData.append("doneby", staffName)
                formData.append("CheckListID", checklistItemID)
                formData.append("RemittedAmount", " ")
                setIsFetching(true)
                try {
                    const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-report-new.php', {
                        method: 'POST',
                        body: formData
                    })
                    changeScope("")
                    toggleVis(true)
                    const dataFetch = await res.json()
                    setIsFetching(false)
                    if (dataFetch.status === "400") {
                        toast.error(dataFetch.message);
                    } else {
                        toast.success(dataFetch.message);
                    }
                } catch (error) {
                    setIsFetching(false)
                    toggleVis(true)
                    console.error('Server Error:', error)
                }
            }

            onUpload(selectedYear, taxScheduleFiles, remittanceFiles, amountFormatted, documentFiles, checklistItem);
        } else {
            toggleVis(true)
            alert('Please fill in all required fields.');
        }
    };

    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <div className="flex justify-center my-4">
                <div>
                    <label htmlFor="year" className="block text-gray-700 text-sm font-bold">
                        Select a year:
                    </label>
                    <select id="year" className="block py-2 rounded-md" onChange={handleYearChange}>
                        <option value="">Select</option>
                        {years?.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                </div>
            </div>
            {checklistItemType === "EXCEL" ?
                <div className="grid grid-cols-3 my-5 border rounded-md p-10">
                    <div>
                        <label htmlFor="amount" className=" text-gray-700 text-sm font-bold">
                            Remitted amount:
                        </label>
                        <input type="text" value={amount} id="amount" className="px-2 py-2 border rounded-md" onChange={handleAmountChange} />
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-bold mb-2">
                            Upload Schedule  (csv):
                        </p>
                        <input onClick={(e) => (e.target.value = null)} type="file" id="taxSchedule" className=" hidden" onChange={handleTaxScheduleChange} />
                        <label
                            htmlFor='taxSchedule'
                            // style={{ backgroundColor: "#84abeb" }}
                            className="btn btn-default bg-gray-400 text-white rounded-md mx-2"
                        >
                            select file
                        </label>
                        <p className='my-4'>{taxScheduleFiles ? taxScheduleFiles.name : ""}</p>
                    </div>

                    <div>
                        <label htmlFor="remittance" className="text-gray-700 text-sm font-bold">
                            Upload Remittance (all monthly remittance):
                        </label>
                        <input type="file" id="remittance" className="px-2 py-2 border rounded-md" onChange={handleRemittanceChange} />

                    </div>

                </div>
                :
                <div className="flex justify-center gap-2  border rounded-md p-10">
                    <div>
                        <label htmlFor="document" className="block text-gray-700 text-sm font-bold">
                            Upload document:
                        </label>
                        <input type="file" id="document" className="block px-4 py-2 border rounded-md" onChange={handleDocumenteChange} />

                    </div>
                </div>
            }
            <div className="flex justify-center">
                <button type="button" onClick={handleUpload} className="mt-4 bg-blue-500 text-white rounded-md px-2 py-2 hover:bg-blue-700">Upload</button>
            </div>
        </>
    );
};

export default YearAndUpload;
