import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Widget from '../../../components/widget'
import axios from "axios";
import url from "../../../config/url";
import setAuthToken from "../../../functions/setAuthToken";
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { FormatMoneyComponentReport } from '../../../components/FormInput/formInputs';
import { useEffect } from 'react';
import { formatNumber } from 'accounting';
import { DatePicker } from 'antd';

export default function Payslip() {
    const [isFetching, setIsFetching] = useState(false)
    const [orgName, setOrgName] = useState("")
    const [orgKGTIN, setOrgKGTIN] = useState("")
    const [payerName, setPayername] = useState("")
    const [payerKGTIN, setPayerKGTIN] = useState("")
    const [station, setTaxStation] = useState([])
    const [numberVal, setNumberVal] = useState({ amount: "" });
    const [createError, setCreateError] = useState("");
    const [taxValue, setTaxValue] = useState(() => 0);
    const [payslipYear, setPaySlipYear] = useState(new Date());

    const router = useRouter();

    const {
        register,
        handleSubmit,
    } = useForm(
        { mode: "onBlur", }
    )

    const {
        register: registerTp,
        handleSubmit: handleSubmitTp,

    } = useForm(
        { mode: "onBlur", }
    )

    const {
        register: registerForm,
        watch,
        control,
        handleSubmit: handleSubmitForm,

    } = useForm(
        { mode: "onBlur", }
    )

    let otherReliefWatch = watch("other_relief", "0").replace(/,/g, '')
    let upfrontWatch = watch("upfront", "0").replace(/,/g, '')
    let watch_relief_notes = watch("other_relief_notes", "")

    let housing = watch("housing", "0").replace(/,/g, '')
    let trans_allw = watch("trans_allw", "0").replace(/,/g, '')
    let leave_allw = watch("leave_allw", "0").replace(/,/g, '')
    let utilities = watch("utilities", "0").replace(/,/g, '')
    let other_allw = watch("other_allw", "0").replace(/,/g, '')
    let benefits = watch("benefits", "0").replace(/,/g, '')
    let pension = watch("pension", "0").replace(/,/g, '')
    let month_13 = watch("month_13", "0").replace(/,/g, '')
    let nhf = watch("nhf", "0").replace(/,/g, '')
    let lap = watch("lap", "0").replace(/,/g, '')
    let basic = watch("basic", "0").replace(/,/g, '')
    let no_months = watch("no_months", "0").replace(/,/g, '')
    let consolidatedRelief
    let tax

    let allowance = (Number(housing) + Number(trans_allw) + Number(leave_allw) + Number(upfrontWatch) + Number(utilities) + Number(other_allw) + Number(benefits) + Number(month_13));
    let totalRelief = (Number(pension) + Number(nhf) + Number(lap));

    let consolidatedIncome = (Number(basic) + Number(allowance));

    let gross_inc = Number(consolidatedIncome) - Number(totalRelief);

    if (consolidatedIncome < 300000.0) {
        consolidatedRelief = 0;

    } else {
        consolidatedRelief = 200000 + 0.2 * gross_inc;
    }

    let totalDeduction = consolidatedRelief + totalRelief + Number(otherReliefWatch);
    let chargeableIncome = consolidatedIncome - totalDeduction;

    //calculate tax
    if (consolidatedIncome <= 300000.0) {
        tax = consolidatedIncome * 0.01;

        //console.log(tax+' 1');
    } else if (consolidatedIncome > 300000 && chargeableIncome < 300000) {
        tax = (chargeableIncome * 0.07);
        let taxS = (consolidatedIncome * 0.01);
        if (tax > taxS) {
            tax = tax
        }
        else {
            tax = taxS;
        }
        //console.log(tax+' tax2');
    } else if (chargeableIncome > 300000 && chargeableIncome <= 600000) {
        tax = 300000 * 0.07 + (chargeableIncome - 300000) * 0.11;

        //console.log(tax+' tax3');
    } else if (chargeableIncome > 600000 && chargeableIncome <= 1100000) {
        tax = 300000 * 0.07 + 300000 * 0.11 + (chargeableIncome - 600000) * 0.15;

        //console.log(tax + ' 4');
    } else if (chargeableIncome > 1100000 && chargeableIncome <= 1600000) {
        tax =
            300000 * 0.07 +
            300000 * 0.11 +
            500000 * 0.15 +
            (chargeableIncome - 1100000) * 0.19;

        //console.log(tax + ' 5');
    } else if (chargeableIncome > 1600000 && chargeableIncome <= 3200000) {
        tax =
            300000 * 0.07 +
            300000 * 0.11 +
            500000 * 0.15 +
            500000 * 0.19 +
            (chargeableIncome - 1600000) * 0.21;

        //console.log(tax + ' 6');
    } else if (chargeableIncome > 3200000) {
        tax =
            300000 * 0.07 +
            300000 * 0.11 +
            500000 * 0.15 +
            500000 * 0.19 +
            1600000 * 0.21 +
            (chargeableIncome - 3200000) * 0.24;

        //console.log(tax + ' 7');
    }

    tax = tax / 12 * no_months;

    let consolidatedIncomeS = (Number(basic) + ((Number(allowance) / 12) * Number(no_months)));
    let consolidatedReliefS = Number(consolidatedRelief) / 12 * Number(no_months);
    let chargeableIncomeS = Number(chargeableIncome / 12) * Number(no_months);
    let grossInc = (Number(consolidatedIncomeS / 12 * no_months));

    function extractYearFromDate(dateString) {
        // Convert the date string to a Date object
        const dateObject = new Date(dateString);

        // Get the year from the Date object
        const year = dateObject.getUTCFullYear();

        return String(year);
    }

    console.log("startDate", extractYearFromDate(payslipYear));
    let YearSelected = extractYearFromDate(payslipYear)
    setAuthToken()
    useEffect(() => {

        const fetchPost = async () => {
            try {
                let res = await axios.get(`${url.BASE_URL}user/items`);
                let office = res.data.body.taxOffice
                setTaxStation(office)

            } catch (e) {
                console.log(e);
            }
        };
        fetchPost();
    }, [])

    const handleInputChange = useCallback((event) => {
        const rawValue = event.target.value;
        const formattedValue = rawValue.replace(/\D/g, '')
        // .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // thousand seperator
        setTaxValue(formattedValue);
    }, [])

    useEffect(() => {
        setTaxValue(tax);

    }, [tax]);

    const searchOrg = (data) => {
        data.tpType = "Non-Individual"
        setIsFetching(true)

        axios.post(`${url.BASE_URL}taxpayer/taxpayer-search`, data)
            .then(function (response) {
                setIsFetching(false)
                let organization = response.data.body.taxpayer
                if (organization === '' || organization === "" || organization === null) {
                    toast.error("Organization does not exist");
                } else {
                    let organizName = organization[0].tp_name
                    let organizKGTIN = organization[0].KGTIN
                    setOrgName(organizName)
                    setOrgKGTIN(organizKGTIN)

                }

            })
            .catch(function (error) {
                setIsFetching(false)
                setOrgName("")
                setOrgKGTIN("")
                toast.error("Cannot find Organization!");
            })
    }

    const searchTp = (data) => {
        data.tpType = "Individual"
        setIsFetching(true)

        axios.post(`${url.BASE_URL}taxpayer/taxpayer-search`, data)
            .then(function (response) {
                setIsFetching(false)
                let taxPayer = response.data.body.taxpayer
                let tpName = taxPayer[0].tp_name
                let tpKGTIN = taxPayer[0].KGTIN
                setPayername(tpName)
                setPayerKGTIN(tpKGTIN)

            })
            .catch(function (error) {
                setIsFetching(false)
                setPayername("")
                setPayerKGTIN("")
                toast.error("Cannot find Taxpayer!");

            })
    }



    const createPayslip = (data) => {
        if (data.org_id === "" || data.paye_tp === "") {
            alert("Please provide Organization and Employee KGTIN")
        }
        else if (otherReliefWatch > 0 && watch_relief_notes === "") {
            alert("Please fill out the reason for other deduction")
        }
        else {
            setIsFetching(true)
            data.basic = grossInc
            data.other_allw = (data.other_allw).replace(/,/g, '')
            data.pension = (data.pension).replace(/,/g, '')
            data.nhf = (data.nhf).replace(/,/g, '')
            data.benefits = (data.benefits).replace(/,/g, '')
            data.lap = (data.lap).replace(/,/g, '')
            data.housing = (data.housing).replace(/,/g, '')
            data.trans_allw = (data.trans_allw).replace(/,/g, '')
            data.leave_allw = (data.leave_allw).replace(/,/g, '')
            data.utilities = (data.utilities).replace(/,/g, '')
            data.upfront = (data.upfront).replace(/,/g, '')
            data.month_13 = (data.month_13).replace(/,/g, '')
            data.housing = (data.housing).replace(/,/g, '')
            data.other_relief = (data.other_relief).replace(/,/g, '')
            data.payroll_year = YearSelected
            data.tax = (data.tax).replace(/,/g, '')
            data.consolidated_relief = consolidatedReliefS
            console.log(data);
            axios.post(`${url.BASE_URL}paye/payslip`, data)
                .then(function (response) {
                    setIsFetching(false)
                    toast.success("Created Successfully!");
                    setCreateError("")
                    router.push(`/pita/payslip/${response.data.body.payroll_year}_${response.data.body.id}`)

                })
                .catch(function (error) {
                    setIsFetching(false)
                    if (error.response) {
                        setCreateError(() => error.response.data.message);
                    } else {
                        toast.error("Failed to add Income Details!");
                    }
                })
        }

    }

    return (
        <>
            <ToastContainer />
            <Widget>
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
                        <p className="font-bold">Please wait...</p>
                    </div>
                )}
                <div >

                    <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:">
                        <div className="w-full lg:w-1/2 ">
                            <form onSubmit={handleSubmit(searchOrg)} className="flex">
                                <input ref={register()} required name="search" className="form-control rounded font-light text-gray-500" type="text" placeholder="organization kgtin/name" />
                                <button
                                    style={{ backgroundColor: "#84abeb" }}
                                    className="btn btn-default text-white btn-outlined ml-2 bg-transparent rounded-md"
                                    type="submit"

                                >
                                    Search organisation
                                </button>
                            </form>
                            <div>
                                <p>{orgName}</p>
                                <p>{orgKGTIN}</p>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <form className="flex" onSubmit={handleSubmitTp(searchTp)}>

                                <input ref={registerTp()} required type="text" name="search" defaultValue={payerKGTIN} placeholder="kgtin, name, or phone" className="form-control rounded font-light text-gray-500" />
                                <button

                                    style={{ backgroundColor: "#84abeb" }}
                                    className="btn btn-default text-white btn-outlined bg-transparent ml-2 rounded-md"
                                >
                                    Search Taxpayer
                                </button>
                            </form>
                            <div>
                                <p>{payerName}</p>
                                <p>{payerKGTIN}</p>
                            </div>
                        </div>
                    </div>

                </div>

            </Widget>
            <form onSubmit={handleSubmitForm(createPayslip)} className="border mb-3 block p-6 rounded-lg w-full">
                <p className="text-red-600 mb-3">{createError}</p>
                <Widget>
                    <div className="flex gap-2 justify-center ">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="form-group ">
                                <p>Organization/Employer <small className="font-bold text-red-600">*</small></p>
                                <input name="org_id" ref={registerForm()} required placeholder={orgName} defaultValue={orgKGTIN} readOnly type="text" className="form-control  w-full rounded font-light text-gray-500"
                                />
                            </div>

                            <div className="form-group ">
                                <p>Taxpayer/Employee <small className="font-bold text-red-600">*</small></p>
                                <input name="paye_tp" ref={registerForm()} required placeholder={payerName} defaultValue={payerKGTIN} readOnly type="text" className="form-control  w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p className="block">Year <small className="font-bold text-red-600">*</small></p>

                                <DatePicker
                                    onChange={(date) => setPaySlipYear(date)}
                                    picker="year"
                                    size='large'
                                    className="mb-6"
                                    required
                                />

                            </div>


                            <div className="form-group ">
                                <p>Number of months <small className="font-bold text-red-600">*</small></p>
                                <input name="no_months" defaultValue={"12"} ref={registerForm()} max="12" min="1" type="number" className="form-control  w-full rounded font-light text-gray-500"
                                />
                            </div>


                            <div className="form-group ">
                                <p>Tax Office <small className="font-bold text-red-600">*</small></p>
                                <select required ref={registerForm()} name="tax_office" className="form-control  SlectBox w-full rounded font-light text-gray-500">
                                    {station.map((office) => <option key={office.idstation} value={office.station_code}>{office.name}</option>)}
                                </select>
                            </div>


                            <div className="form-group ">
                                <p>Rank/G-Level</p>
                                <input name="rank" ref={registerForm()} type="text" className="form-control  w-full rounded font-light text-gray-500"
                                />
                            </div>

                        </div>
                    </div>
                </Widget>

                <Widget>
                    <div className="flex gap-2 justify-center">
                        <div className="grid grid-cols-2 gap-4 w-1/2 border-r pr-3">
                            <p className="font-bold">INCOME </p>
                            <p></p>
                            <div className="form-group ">
                                <p>Basic Annual Salary <small className="font-bold text-red-600">*</small></p>
                                <FormatMoneyComponentReport
                                    ref={registerForm()}
                                    name="basic"
                                    control={control}
                                    defaultValue={""}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>Housing Allowance</p>
                                <FormatMoneyComponentReport
                                    name="housing"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>Transport Allowance</p>
                                <FormatMoneyComponentReport
                                    name="trans_allw"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>Leave Allowance</p>
                                <FormatMoneyComponentReport
                                    name="leave_allw"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>Utilities</p>
                                <FormatMoneyComponentReport
                                    name="utilities"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>Other Allowance</p>
                                <FormatMoneyComponentReport
                                    name="other_allw"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>Upfront</p>
                                <FormatMoneyComponentReport
                                    name="upfront"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group">
                                <p>Benefits</p>
                                <FormatMoneyComponentReport
                                    name="benefits"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group">
                                <p>Thirteenth Month</p>
                                <FormatMoneyComponentReport
                                    name="month_13"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4 w-1/2 content-start">
                            <p className="font-bold">DEDUCTONS</p>
                            <p></p>
                            <div className="form-group ">
                                <p>Pension</p>
                                <FormatMoneyComponentReport
                                    name="pension"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>

                            <div className="form-group ">
                                <p>National Housing Fund (NHF)</p>
                                <FormatMoneyComponentReport
                                    name="nhf"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>
                            <div className="form-group ">
                                <p>Life Assurance (LAP)</p>
                                <FormatMoneyComponentReport
                                    name="lap"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>
                            <div className="form-group ">
                                <p>Other Deduction</p>
                                <FormatMoneyComponentReport
                                    name="other_relief"
                                    control={control}
                                    defaultValue={"0"}
                                    onValueChange={(v) => setNumberVal({ amount: v })}
                                    ref={registerForm()}
                                    required={true}
                                />
                            </div>
                            <div className="form-group">
                                <p>Reason for Other Deduction</p>
                                <textarea name="other_relief_notes" ref={registerForm()} id="" cols="30" rows="2"></textarea>
                            </div>
                            <p className="form-group"></p>

                            <p className="font-bold">TAX CALCULATION</p>
                            <p></p>

                            <div className="form-group">
                                <p className="font-bold">Gross Income</p>
                                <p className="font-bold">{formatNumber(grossInc)}</p>
                            </div>
                            <div className="form-group">
                                <p className="font-bold">Consolidated Relief</p>
                                <p className="font-bold">{formatNumber(consolidatedReliefS)}</p>
                            </div>
                            <div className="form-group">
                                <p className="font-bold">Taxable Income</p>
                                <p className="font-bold">{formatNumber(chargeableIncomeS)}</p>
                            </div>
                            <div className="form-group">

                                <p className="font-bold">Tax Payable</p>
                                <input
                                    type="text"
                                    name="tax"
                                    ref={registerForm()}
                                    value={formatNumber(taxValue)}
                                    onChange={handleInputChange}
                                />
                                {/* <p className="font-bold">{formatNumber(tax)}</p> */}
                            </div>
                        </div>
                    </div>
                </Widget>

                <div className="flex justify-center">
                    <button

                        style={{ backgroundColor: "#84abeb" }}
                        className="btn btn-default text-white my-4 btn-outlined bg-transparent rounded-md"
                    >
                        Submit
                    </button>

                </div>
            </form>
        </>
    )

}
