import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import setAuthToken from "../../../functions/setAuthToken";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import url from "../../../config/url";
import Loader from "react-loader-spinner";
import SectionTitle from "../../../components/section-title";
import { formatNumber } from "../../../functions/numbers";
import { DatePicker } from "antd";


const Index = () => {
    const [kgtinErr, setKgtinErr] = useState("")
    const [isFetching, setIsFetching] = useState(() => false);
    const [taxpayerInfo, setTaxpayerinfo] = useState([]);
    const [payslipYear1, setPayslipYear1] = useState([]);
    const [payslipYear2, setPayslipYear2] = useState([]);
    const [payslipYear3, setPayslipYear3] = useState([]);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { dirtyFields }
    } = useForm(
        { mode: "onBlur", }
    )

    function extractYearFromDate(dateString) {
        // Convert the date string to a Date object
        const dateObject = new Date(dateString);
      
        // Get the year from the Date object
        const year = dateObject.getUTCFullYear();
      
        return String(year);
      }

    let yr1Gross = (Number(payslipYear1?.basic) + Number(payslipYear1?.housing) + Number(payslipYear1?.trans_allw) + Number(payslipYear1?.leave_allw) + Number(payslipYear1?.other_allw) + Number(payslipYear1?.benefits) + Number(payslipYear1?.utilities))
    let yr2Gross = (Number(payslipYear2?.basic) + Number(payslipYear2?.housing) + Number(payslipYear2?.trans_allw) + Number(payslipYear2?.leave_allw) + Number(payslipYear2?.other_allw) + Number(payslipYear2?.benefits) + Number(payslipYear2?.utilities))
    let yr3Gross = (Number(payslipYear3?.basic) + Number(payslipYear3?.housing) + Number(payslipYear3?.trans_allw) + Number(payslipYear3?.leave_allw) + Number(payslipYear3?.other_allw) + Number(payslipYear3?.benefits) + Number(payslipYear3?.utilities))



    const {
        register: registerkgtin,
        handleSubmit: handleSubmitkgtin,

    } = useForm(
        { mode: "onBlur", }
    )

    const watchYear1 = watch("assmtYr_1", "");
    const watchYear2 = watch("assmtYr_2", "");
    const watchYear3 = watch("assmtYr_3", "");

    setAuthToken();
    const CreateTcc = async (data) => {

        if (data?.taxYr_1 === '0' && data?.incYr_1 === '0') {
            alert("Please provide Tax and Income figures for Year one")
        }
        else {
            setIsFetching(true)

            if (data.assmtYr_2 === undefined) {
                delete data.assmtYr_2
            }

            if (data.assmtYr_3 === undefined) {
                delete data.assmtYr_3
            }

            data.incYr_1 = (data.incYr_1).replace(/,/g, '')
            data.incYr_2 = (data.incYr_2).replace(/,/g, '')
            data.incYr_3 = (data.incYr_3).replace(/,/g, '')
            data.taxYr_1 = (data.taxYr_1).replace(/,/g, '')
            data.taxYr_2 = (data.taxYr_2).replace(/,/g, '')
            data.taxYr_3 = (data.taxYr_3).replace(/,/g, '')
            data.tp_id = taxpayerInfo.KGTIN
            data.employer = payslipYear1.org_id
            data.assmtYr_1 = extractYearFromDate(watchYear1)
            data.assmtYr_2 = extractYearFromDate(watchYear2)
            data.assmtYr_3 = extractYearFromDate(watchYear3)

            await axios.post(`${url.BASE_URL}paye/tcc`, data)
                .then(function (response) {
                    setIsFetching(false)
                    console.log("response", response);
                    router.push(`/tcc/paye/${response.data.body.id}_${response.data.body.tp_id}`)
                    toast.success("Created Successfully!")
                })
                .catch(function (error) {
                    setTaxpayerinfo("")
                    setIsFetching(false)
                    if (error.response) {
                        toast.error(error.response.data.message)
                    } else {

                    }
                })
        }

    };

    const verifiyKGTIN = (data) => {
        setIsFetching(true)
        axios.post(`${url.BASE_URL}taxpayer/view-taxpayers`, data)
            .then(function (response) {
                setIsFetching(false)
                setTaxpayerinfo(response.data.body)
                setKgtinErr("")
            })
            .catch(function (error) {
                setTaxpayerinfo("")
                setIsFetching(false)
                if (error.response) {
                    setKgtinErr(error.response.data.message)
                } else {

                }
            })
    };

    useEffect(() => {
        const fetchPostYear1 = () => {
            if (dirtyFields.assmtYr_1) {
                let year = extractYearFromDate(watchYear1)
                let kgtin = taxpayerInfo.KGTIN
                setIsFetching(true)
                axios.get(`${url.BASE_URL}paye/payslip?id=tcc&kgtin=${kgtin}&year=${year}`)
                    .then(function (response) {
                        setIsFetching(false)
                        setPayslipYear1(response.data.body.payroll[0]);
                    })
                    .catch(function (error) {
                        setPayslipYear1("")
                        setIsFetching(false)
                        if (error.response) {
                            toast.error(error.response.data.message)
                        } else {

                        }
                    })

            }

        };
        fetchPostYear1();

    }, [watchYear1]);


    useEffect(() => {

        const fetchPostYear2 = () => {
            if (dirtyFields.assmtYr_2) {
                let year2 = extractYearFromDate(watchYear2)
                let kgtin = taxpayerInfo.KGTIN
                setIsFetching(true)
                axios.get(`${url.BASE_URL}paye/payslip?id=tcc&kgtin=${kgtin}&year=${year2}`)
                    .then(function (response) {
                        setIsFetching(false)
                        setPayslipYear2(response.data.body.payroll[0]);
                    })
                    .catch(function (error) {
                        setPayslipYear2("")
                        setIsFetching(false)
                        if (error.response) {
                            toast.error(error.response.data.message)
                        } else {

                        }
                    })

            }

        };
        fetchPostYear2();

    }, [watchYear2]);


    useEffect(() => {

        const fetchPostYear3 = () => {
            if (dirtyFields.assmtYr_3) {
                let year3 = extractYearFromDate(watchYear3)
                let kgtin = taxpayerInfo.KGTIN
                setIsFetching(true)
                axios.get(`${url.BASE_URL}paye/payslip?id=tcc&kgtin=${kgtin}&year=${year3}`)
                    .then(function (response) {
                        setIsFetching(false)
                        setPayslipYear3(response.data.body.payroll[0]);
                    })
                    .catch(function (error) {
                        setPayslipYear3("")
                        setIsFetching(false)
                        if (error.response) {
                            toast.error(error.response.data.message)
                        } else {

                        }
                    })

            }

        };
        fetchPostYear3();

    }, [watchYear3]);

    return (

        <>
            <ToastContainer />
            {isFetching && (
                <div className="flex justify-center item mb-2">
                    <Loader
                        visible={isFetching}
                        type="BallTriangle"
                        color="#00FA9A"
                        height={19}
                        width={19}
                        timeout={0}
                        className="ml-2"
                    />
                    <p className="font-bold">Processing...</p>
                </div>
            )}
            <SectionTitle subtitle="Paye Tcc" />
            <div className="border mb-3 p-6 rounded-lg bg-white w-full">
                <p className="text-red-600">{kgtinErr}</p>
                <form onSubmit={handleSubmitkgtin(verifiyKGTIN)} className="mb-2 grid grid-cols-4 gap-2">
                    <label className="self-center">Enter Taxpayer KGTIN</label>

                    <div className="place-self-start">
                        <input type="text" name='KGTIN' className="form-control w-full rounded" ref={registerkgtin()} placeholder="Enter KGTIN" />
                    </div>

                    <div className="self-center block">
                        <button
                            type="submit"
                            style={{ backgroundColor: "#84abeb" }}
                            className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                        >
                            Verify KGTIN
                        </button>
                    </div>
                </form>

            </div>

            <form onSubmit={handleSubmit(CreateTcc)}>

                <div className="flex border mb-3 block p-3 rounded-lg bg-white w-full">
                    <div className="">

                        <div className="mb-6 grid grid-cols-3 gap-2">
                            <label>Taxpayer:</label>

                            <div>

                                <input ref={register()} value={taxpayerInfo.tp_name} readOnly type="text" className="form-control w-full rounded"
                                />
                            </div>

                        </div>

                        <div className="mb-6 grid grid-cols-3 gap-2">
                            <label>KGTIN:</label>
                            <div>
                                <input ref={register()} value={taxpayerInfo.KGTIN} readOnly name="KGTIN" type="text" className="form-control w-full rounded" placeholder="KGTIN" />
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-3 gap-2">
                            <label>File no:</label>
                            <input ref={register()} required name="file_ref" type="text" className="form-control w-full rounded"
                            />

                        </div>

                        <div className="mb-6 grid grid-cols-3 gap-2">
                            <label htmlFor="employername">Tax Office:</label>
                            <div>
                                <input ref={register()} value={taxpayerInfo.tax_office} name="tax_station" readOnly type="text" className="form-control w-full rounded"
                                />
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <label htmlFor="employername">Processing Fee:</label>
                            <input ref={register()} required placeholder="₦" name="prc_fee" type="text" className="form-control w-full rounded"
                            />
                        </div>
                    </div>
                </div>
                <div className={`flex justify-between border mb-3 rounded-lg bg-white w-full`}>

                    <div className="p-3">
                        <h6 className="text-right mb-6">Year 1</h6>
                        <div className="mb-6 grid grid-cols-2 ">
                            <label>Assessment year </label>
                            <Controller
                                name="assmtYr_1"
                                control={control}
                                render={({ onChange, value }) => {
                                    return (
                                        <DatePicker
                                            onChange={onChange}
                                            picker="year"
                                            size='large'
                                        />
                                    );
                                }}
                            />
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <label>Gross Income</label>
                            <div>
                                <input readOnly name="incYr_1" value={formatNumber(yr1Gross)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <label>Consolidated Relief </label>
                            <div>
                                <input readOnly name="" value={formatNumber(payslipYear1.consolidated_relief)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <label>Taxable Income </label>
                            <div>
                                <input readOnly name="" value={formatNumber(yr1Gross - (Number(payslipYear1.consolidated_relief) + Number(payslipYear1.other_relief)))} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <label>Tax Payable </label>
                            <div>
                                <input readOnly name="taxYr_1" value={formatNumber(payslipYear1.tax)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="p-3 grid justify-items-stretch">
                        <h6 className="text-center mb-6">Year 2</h6>
                        <Controller
                            name="assmtYr_2"
                            control={control}
                            render={({ onChange, value }) => {
                                return (
                                    <DatePicker
                                        onChange={onChange}
                                        picker="year"
                                        size='large'
                                        className="mb-6"
                                    />
                                );
                            }}
                        />



                        <div className="mb-6 justify-self-center">

                            <div>
                                <input readOnly name="incYr_2" value={formatNumber(yr2Gross)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>

                        </div>

                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly value={formatNumber(payslipYear2.consolidated_relief)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>
                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly value={formatNumber(yr2Gross - (Number(payslipYear2.consolidated_relief) + Number(payslipYear2.other_relief)))} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>
                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly name="taxYr_2" value={formatNumber(payslipYear2.tax)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="p-3 grid justify-items-stretch">
                        <h6 className="text-center mb-6">Year 3</h6>

                        <Controller
                            name="assmtYr_3"
                            control={control}
                            render={({ onChange, value }) => {
                                return (
                                    <DatePicker
                                        onChange={onChange}
                                        picker="year"
                                        size='large'
                                        className="mb-6"
                                    />
                                );
                            }}
                        />

                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly name="incYr_3" value={formatNumber(yr3Gross)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly value={formatNumber(payslipYear3.consolidated_relief)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly value={formatNumber(yr3Gross - (Number(payslipYear3.consolidated_relief) + Number(payslipYear3.other_relief)))} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                        <div className="mb-6 justify-self-center">
                            <div>
                                <input readOnly name="taxYr_3" value={formatNumber(payslipYear3.tax)} className="form-control w-full rounded" ref={register()} type="text"
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    <button
                        style={{ backgroundColor: "#84abeb" }}
                        className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>

        </>
    )
}

export default Index