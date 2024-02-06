import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner';
import setAuthToken from '../../../functions/setAuthToken';
import axios from "axios";
import url from '../../../config/url';
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";
import { shallowEqual, useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import jwt from "jsonwebtoken";


function ViewAnnualDocs() {
    const [isFetching, setIsFetching] = useState(() => true);
    const [uploadedDocs, setDocuments] = useState([])
    const [tableListYear, setTableListYear] = useState("")
    const [submitStatus, setStatus] = useState("")
    const [declineModal, setDeclineModal] = useState(false);
    const [kgtin, setKgtin] = useState(false);
    const [year, setYear] = useState(false);

    const router = useRouter();

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );


    const verify = [29, 1]
    const approve = [30, 1]
    const decoded = jwt.decode(auth);
    const userGroup = decoded.groups

    const declinePopup = (e) => {
        // e.preventDefault()
        setDeclineModal(!declineModal);
    };
    const {
        register,
        handleSubmit,
    } = useForm()

    setAuthToken()
    useEffect(() => {
        if (router && router.query) {
            let routerData = String(router.query.ref);
            let queryParams = routerData.split("_")
            let kgtin = queryParams[0]
            let year = queryParams[1]
            let docStatus = queryParams[2]
            setStatus(docStatus)
            setYear(year)
            setKgtin(kgtin)
            setTableListYear(year)
            let data = {
                "employerId": kgtin,
                "year": year
            }
            const fetchPost = async () => {
                setIsFetching(true);
                try {

                    let response = await axios.post(`${url.BASE_URL}annual/view-annual-uploads`, data)
                    let docs = response.data.body.uploads;
                    setDocuments(docs)
                    setIsFetching(false);
                } catch (error) {
                    setIsFetching(false);
                    console.log(error)
                }
            };
            fetchPost();

        }
    }, [router]);

    const coverLetter = uploadedDocs.filter(c => c.doc_title === "cover_letter")

    const coverL = coverLetter.map((doc) => {
        return doc.doc_name
    })


    const expertriateLetter = uploadedDocs.filter(c => c.doc_title === "exp_order_letter")

    const expertriateL = expertriateLetter.map((doc) => {
        return doc.doc_name
    })

    const monthlyPayrollSchedule = uploadedDocs.filter(c => c.doc_title === "mnthly_pay_sched")

    const monthlyPayrollS = monthlyPayrollSchedule.map((doc) => {
        return doc.doc_name
    })

    const payeRemittance = uploadedDocs.filter(c => c.doc_title === "paye_remittance")

    const evidenceOfPayeR = payeRemittance.map((doc) => {
        return doc.doc_name
    })

    const existStaffList = uploadedDocs.filter(c => c.doc_title === "exit_staff_list")

    const exitStaffL = existStaffList.map((doc) => {
        return doc.doc_name
    })



    const withHoldingTaxDeduct = uploadedDocs.filter(c => c.doc_title === "wht_tax_deduct")
    const withTaxD = withHoldingTaxDeduct.map((doc) => {
        return doc.doc_name
    })

    const withHoldingTaxReceipt = uploadedDocs.filter(c => c.doc_title === "wht_tax_receipts")
    const withTaxR = withHoldingTaxReceipt.map((doc) => {
        return doc.doc_name
    })

    const monthlyImmigrationReturn = uploadedDocs.filter(c => c.doc_title === "mnthly_immi_returns")
    const monthlyImmR = monthlyImmigrationReturn.map((doc) => {
        return doc.doc_name
    })

    const devLevyReceipts = uploadedDocs.filter(c => c.doc_title === "dev_levy_receipts")
    const devLevyR = devLevyReceipts.map((doc) => {
        return doc.doc_name
    })

    const busPremReceipts = uploadedDocs.filter(c => c.doc_title === "bus_premises_receipt")
    const busPremisesR = busPremReceipts.map((doc) => {
        return doc.doc_name
    })

    const groundRentReceipts = uploadedDocs.filter(c => c.doc_title === "grnd_rent_receipts")
    const groundRentR = groundRentReceipts.map((doc) => {
        return doc.doc_name
    })

    const sscl = uploadedDocs.filter(c => c.doc_title === "sscl")

    const SSCLevy = sscl.map((doc) => {
        return doc.doc_name
    })
    const pensionRemittance = uploadedDocs.filter(c => c.doc_title === "pension_remittance")

    const pensionR = pensionRemittance.map((doc) => {
        return doc.doc_name
    })

    const nhfRemittance = uploadedDocs.filter(c => c.doc_title === "nhf_remittance")
    const nhfR = nhfRemittance.map((doc) => {
        return doc.doc_name
    })

    const nhisRemittance = uploadedDocs.filter(c => c.doc_title === "nhis_remittance")

    const nhisR = nhisRemittance.map((doc) => {
        return doc.doc_name
    })

    const lapRemittance = uploadedDocs.filter(c => c.doc_title === "lap_remittance")
    const lapR = lapRemittance.map((doc) => {
        return doc.doc_name
    })


    let verifyDoc = async (e) => {
        e.preventDefault()
        setIsFetching(true)
        let verifyDoc = {
            status: "Verified",
            employerId: kgtin,
            year: year
        }
        try {
            await axios.post(`${url.BASE_URL}annual/annual-returns-status`, verifyDoc);
            setIsFetching(false)
            router.push('/paye-annual')
            toast.success("Success!");
        } catch (error) {
            toast.error("Failed!");
            console.log(error);
            setIsFetching(false)
        }
    }

    const ApproveDoc = async (e) => {
        e.preventDefault()
        setIsFetching(true)
        let appDoc = {
            status: "Approved",
            employerId: kgtin,
            year: year
        }
        try {
            await axios.post(`${url.BASE_URL}annual/annual-returns-status`, appDoc);
            setIsFetching(false)
            router.push('/paye-annual')
            toast.success("Success!");
        } catch (error) {
            toast.error("Failed!");
            console.log(error);
            setIsFetching(false)
        }
    }

    const Decline = (data) => {
        setIsFetching(true)
        let declineTcc = {
            comment: data.comment,
            status: "Declined",
            employerId: kgtin,
            year: year

        }
        axios.post(`${url.BASE_URL}annual/annual-returns-status`, declineTcc)
            .then(function (response) {
                setIsFetching(false)
                toast.success("Success!");
                router.push('/paye-annual')
            })
            .catch(function (error) {
                toast.error("Failed!");
                setIsFetching(false)
            })
    }

    return (
        <>
            <ToastContainer />

            {declineModal && (
                <div className="modal">
                    {/* <div onClick={toggleModal} className="overlay"></div> */}
                    <div className="modal-content" width="300">
                        <div className="text-center">
                            <p>Are you sure you want to Decline ?</p>
                            <p>Please state reason why</p>
                        </div>

                        <form onSubmit={handleSubmit(Decline)}>
                            <textarea name="comment" ref={register()} required className="form-control w-full rounded" minlength="10" placeholder="comment"></textarea>
                            <div className="mt-2 flex justify-between">
                                <button onClick={declinePopup}
                                    className="btn w-32 bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn w-32 bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                                    type="submit"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isFetching && (
                <div className="flex justify-start item mb-2">
                    <Loader
                        visible={isFetching}
                        type="BallTriangle"
                        color="#00FA9A"
                        height={19}
                        width={19}
                        timeout={0}
                        className="ml-2"
                    />
                    <p>Processing data...</p>
                </div>

            )}
            <div>
                <div className="flex justify-between mb-4">


                    <button
                        className="btn bg-purple-400 btn-default text-white btn-outlined bg-transparent rounded-md"
                        type="submit"
                        onClick={() => router.back(`/paye-annual/view-csv/${kgtin}_${year}_${submitStatus}`)}
                    >
                        View schedule
                    </button>

                    <button
                        className="btn bg-gray-400 btn-default text-white btn-outlined bg-transparent rounded-md"
                        type="submit"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>

                </div>

                {submitStatus === "Declined" ?
                    <div className="flex justify-between">
                    </div> :
                    <div className="mb-6">
                        <div>
                            {submitStatus === "Submitted" ?
                                <div className="flex justify-between">
                                    <p></p>
                                    {userGroup.some(r => verify.includes(r)) ?
                                        <div className="flex">
                                            <form onSubmit={verifyDoc} className=" mr-3">
                                                <button
                                                    className="btn bg-purple-400 btn-default text-white btn-outlined bg-transparent rounded-md"
                                                    type="submit"
                                                >
                                                    Verify
                                                </button>
                                            </form>
                                            <div className=" mr-3">
                                                <button onClick={declinePopup}
                                                    className="btn bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"

                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                        : ""}

                                </div> : ""
                            }
                        </div>
                        <div>
                            {submitStatus === "Verified" ?
                                <div className="flex justify-between">
                                    <p></p>
                                    {userGroup.some(r => approve.includes(r)) ?
                                        <div className="flex">
                                            <form onSubmit={ApproveDoc} className=" mr-3">
                                                <button
                                                    className="btn bg-green-400  mr-3 btn-default text-white btn-outlined bg-transparent rounded-md"
                                                    type="submit"
                                                >
                                                    Approve
                                                </button>
                                            </form>
                                            <div className=" mr-3">
                                                <button onClick={declinePopup}
                                                    className="btn bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"

                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>

                                        : ""}
                                </div> : ""
                            }
                        </div>


                    </div>

                }


                <p className="font-bold flex justify-center">Year {tableListYear} - {submitStatus}</p>
                <div className="grid justify-items-start">

                    <div className="font-semibold">
                        Cover letter for the submission of annual returns
                    </div>

                    <div className="flex">
                        {coverL.map((element, i) => (
                            <div key={i} className="p-2">
                                {/* <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/cover_letter/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a> */}
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/cover_letter/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>

                </div>
                
     

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Letter of expatriate quota
                    </div>

                    <div className="flex">
                        {expertriateL.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/exp_order_letter/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>

                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Monthly payroll schedule
                    </div>

                    <div className="flex">
                        {monthlyPayrollS.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/mnthly_pay_sched/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>

                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Evidence of PAYE remittance
                    </div>

                    <div className="flex">
                        {evidenceOfPayeR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/paye_remittance/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Exit staff list
                    </div>
                    <div className="flex">
                        {exitStaffL.map((element, i) => (
                            <div key={i} className="p-2">
                                <a target="_blank" href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/exit_staff_list/${element}`} className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>


                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Schedule of withholding tax deductions
                    </div>
                    <div className="flex">
                        {withTaxD.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/wht_tax_deduct/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Withholding tax receipts
                    </div>
                    <div className="flex">
                        {withTaxR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/wht_tax_receipts/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Monthly Immigration returns
                    </div>
                    <div className="flex">
                        {monthlyImmR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a target="_blank" href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/mnthly_immi_returns/${element}`} className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Development levy receipts
                    </div>
                    <div className="flex">
                        {devLevyR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a target="_blank" href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/dev_levy_receipts/${element}`} className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Business premises receipts
                    </div>
                    <div className="flex">
                        {busPremisesR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/bus_premises_receipt/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Ground rent receipts
                    </div>
                    <div className="flex">
                        {groundRentR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/grnd_rent_receipts/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Social service contributions levy
                    </div>
                    <div className="flex">
                        {SSCLevy.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/sscl/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Evidence of remittance of pension
                    </div>
                    <div className="flex">
                        {pensionR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/pension_remittance/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Evidence of remittance of NHF
                    </div>
                    <div className="flex">
                        {nhfR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/nhf_remittance/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Evidence of remittance of NHIS
                    </div>
                    <div className="flex">
                        {nhisR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/nhis_remittance/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                <div className="grid justify-items-start">
                    <div className="font-semibold">
                        Evidence of remittance of LAP
                    </div>
                    <div className="flex">
                        {lapR.map((element, i) => (
                            <div key={i} className="p-2">
                                <a href={`https://annualuploads.bespoque.dev/portal-live/uploads/annual-returns/lap_remittance/${element}`} target="_blank" className="underline underline-offset-4 text-blue-600">Download</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <style
                jsx>{
                    `
        body.active-modal {
          overflow-y: hidden;
      }
      
      // .btn-modal {
      //     padding: 10px 20px;
      //     display: block;
      //     margin: 100px auto 0;
      //     font-size: 18px;
      // }
      
      .modal, .overlay {
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: fixed;
      }
      
      .overlay {
          background: rgba(49,49,49,0.8);
      }
      .modal-content {
          position: absolute;
          top: 20%;
          left: 60%;
          transform: translate(-50%, -50%);
          line-height: 1.4;
          background: #f1f1f1;
          padding: 14px 28px;
          border-radius: 3px;
          max-width: 400px;
          min-width: 300px;
      }
      
      .close-modal {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 7px;
      }
        `
                }
            </style>
        </>
    )
}

export default ViewAnnualDocs