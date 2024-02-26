import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProcessorSpinner } from '../../../components/spiner';
import setAuthToken from '../../../functions/setAuthToken';
import { useForm } from 'react-hook-form';
import SectionTitle from '../../../components/section-title';
import { shallowEqual, useSelector } from 'react-redux';
import url from '../../../config/url'
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Select, Space } from "antd";

const CreateJob = () => {
    const [taxId, setTaxId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [kgtinStatus, setKgtinStatus] = useState(true)
    const { register, handleSubmit } = useForm();
    const [tpDetail, setTpDetail] = useState({})
    const [rhmUsers, setRhmUsers] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);
    const router = useRouter()
    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );


    const handleChange = (values) => {
        setSelectedValues(String(values));
    };


    const options = [];
    for (let i = 0; i < rhmUsers.length; i++) {
        options.push({
            value: rhmUsers[i].email,
            label: rhmUsers[i].name
        });
    }

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName

    const handleTaxIdChange = (e) => {
        const { value } = e.target;
        const onlyNumbers = value.replace(/[^0-9]/g, '');
        setTaxId(onlyNumbers);
    };

    


    setAuthToken()
    const validateTP = async (taxId) => {
        setIsFetching(true)
        try {
            const response = await axios.post(`${url.BASE_URL}taxpayer/view-taxpayers`, {
                KGTIN: taxId
            });
            setIsFetching(false)
            setKgtinStatus(false)
            setTpDetail(response.data.body)
            setValidationResult(response.data.body.tp_name);
        } catch (error) {
            setIsFetching(false)
            setKgtinStatus(true)
            if (error.response) {
                setValidationResult(error.response.data.message);
            } else {
                console.error('Error occurred while validating Tax ID:', error);
            }
        }
    };

    useEffect(() => {
        if (taxId.length === 10) {
            validateTP(taxId);
        }
        const fetchPost = async () => {
            try {
                const response = await fetch("https://test.rhm.backend.bespoque.ng/rhm/fix/getRHMUsers.php", {
                    method: 'POST',
                    body: JSON.stringify({
                        "param": "all"
                    })
                })
                const dataFetch = await response.json()
                setRhmUsers(dataFetch.body)
            } catch (error) {
                console.log("error", error);

            }
        }
        fetchPost()
    }, [taxId]);

    async function onSubmit(jobdata) {
        jobdata.job_kgtin = tpDetail?.KGTIN
        jobdata.job_start_status = "Pending"
        jobdata.job_progress_status = "Pending"
        jobdata.job_initiator = staffName
        jobdata.job_user = selectedValues
        try {
            const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newjob.php', {
                method: 'POST',
                body: JSON.stringify(jobdata)
            })
            setIsFetching(false)
            const dataFetch = await response.json()
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message)
            } else {
                toast.success(dataFetch.message);
                router.push("/tax-audit/all-jobs")
            }
        } catch (error) {
            console.error('Server Error:', error)
            setIsFetching(false)
        }
    }

    return (
        <>
            <ToastContainer />
            <SectionTitle title="Create new Job" />

            {isFetching && <ProcessorSpinner />}
            <div className="mx-auto mt-8">
                <form onSubmit={validateTP} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taxId">
                            Taxpayer ID:
                        </label>
                        <input
                            type="text"
                            id="taxId"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={taxId}
                            onChange={handleTaxIdChange}
                        />
                    </div>
                    {validationResult && (
                        <div>
                            <pre>{JSON.stringify(validationResult, null, 2)}</pre>
                        </div>
                    )}
                </form>

                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
                    <div className="grid grid-cols-2 gap-4 mx-auto  max-w-md mb-4">
                        <div>
                            <label className="block mb-1">Job Type:</label>
                            <select
                                required
                                id="job_job_type"
                                name="job_job_type"
                                className="border rounded-md border-gray-300 w-full"
                                ref={register()}
                            >
                                <option value="">Select type</option>
                                {/* <option value="TACC">TACC</option> */}
                                <option value="Tax audit only">Tax Audit Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Job start date:</label>
                            <input className="border rounded-md border-gray-300 w-full"
                                type="date"
                                name="job_startdate"
                                ref={register()}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mx-auto gap-4 max-w-md mb-4">
                        <div>
                            <label className="block mb-1">Audit start date:</label>
                            <input
                                required
                                type="date"
                                id="job_auditdate_start"
                                name="job_auditdate_start"
                                className="border rounded-md border-gray-300 w-full"
                                ref={register()}
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Audit end date:</label>
                            <input
                                required
                                type="date"
                                id="job_auditdate_end"
                                name="job_auditdate_end"
                                className="border rounded-md border-gray-300 w-full"
                                ref={register()}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 mx-auto gap-4 max-w-md mb-4">
                        <div>
                            <label className="block mb-1">Type</label>
                            <select
                                required
                                name="actionType"
                                className="border rounded-md border-gray-300 w-full"
                                ref={register()}
                            >
                                <option value="">Select type</option>
                                <option value="Audit Visit">Audit Visit</option>
                                {/* <option value="Demand Notice">Demand Notice</option> */}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">Auditor:</label>
                            <Space
                                direction="vertical"
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select
                                    mode="multiple"
                                    size={'large'}
                                    placeholder="Please select"
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                    }}
                                    options={options}
                                />
                            </Space>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-center">
                        <button
                            className={`${kgtinStatus ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-700'
                                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                            type="submit"
                            disabled={kgtinStatus}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateJob;
