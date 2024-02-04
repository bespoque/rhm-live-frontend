import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProcessorSpinner } from '../../../../components/spiner';
import { useRouter } from 'next/router';
import { SignatureCol } from '../../../../components/Images/Images';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useForm } from 'react-hook-form';



const checks =
    [
        {
            "checklist_id": "1",
            "checklist_item": "Payment Voucher / Cheque / Cash Book"
        },
        {
            "checklist_id": "2",
            "checklist_item": "Petty Cash Voucher"
        },
        {
            "checklist_id": "3",
            "checklist_item": "Bank Statement"
        },
        {
            "checklist_id": "4",
            "checklist_item": "Audited Financial Statement / Management Account"
        },
        {
            "checklist_id": "5",
            "checklist_item": "Schedule of Tax Remittance / Receipts"
        },
        {
            "checklist_id": "6",
            "checklist_item": "Schedule of Interest Payment on Fixed Deposit and Savings Account"
        },
        {
            "checklist_id": "7",
            "checklist_item": "Trial balance of the company (for the relevant years under consideration)"
        },
        {
            "checklist_id": "8",
            "checklist_item": "List of Suppliers/Contractors (Hard & Soft copy)"
        },
        {
            "checklist_id": "9",
            "checklist_item": "Rent Schedule"
        },
        {
            "checklist_id": "10",
            "checklist_item": "Names/Address of Directors with copies of their Tax Clearance Certificate"
        },
        {
            "checklist_id": "11",
            "checklist_item": "Copy of Certificate of Incorporation"
        },
        {
            "checklist_id": "12",
            "checklist_item": "Last Clearance Letter of Tax Audit from KGIRS"
        },
        {
            "checklist_id": "13",
            "checklist_item": "Letter of Expatriate Quota / monthly immigration returns (if any)"
        },
        {
            "checklist_id": "14",
            "checklist_item": "Staff list with designation"
        },
        {
            "checklist_id": "15",
            "checklist_item": "Debtors and Creditors Ledger"
        },
        {
            "checklist_id": "16",
            "checklist_item": "Staff salary structure - Annual (Soft & Hard copies)"
        },
        {
            "checklist_id": "17",
            "checklist_item": "Evidence of Payment in respect of Business Premises\nRegistration/Renewal"
        },
        {
            "checklist_id": "18",
            "checklist_item": "Copy of certificate of Approved Pension Fund"
        },
        {
            "checklist_id": "19",
            "checklist_item": "Evidence of registration with NHF"
        },
        {
            "checklist_id": "20",
            "checklist_item": "Evidence of NHIS and LAP remittances"
        },
        {
            "checklist_id": "21",
            "checklist_item": "Fixed Asset Register"
        },
        {
            "checklist_id": "22",
            "checklist_item": "Schedule of asset Disposal"
        },
        {
            "checklist_id": "23",
            "checklist_item": "Schedule of Commission paid"
        },
        {
            "checklist_id": "24",
            "checklist_item": "Schedule of WHT paid"
        },
        {
            "checklist_id": "25",
            "checklist_item": "General Ledger"
        },
        {
            "checklist_id": "26",
            "checklist_item": "Analysis of Staff Cost"
        },
        {
            "checklist_id": "27",
            "checklist_item": "All receipts booklet issued Stub or duplicates"
        },
        {
            "checklist_id": "28",
            "checklist_item": "All business agreement enter with a third party"
        },
        {
            "checklist_id": "29",
            "checklist_item": "Certificate of Occupancy and other relevant documents to the Land"
        },
        {
            "checklist_id": "30",
            "checklist_item": "Evidence of remittance of Ground Rent for the year under review"
        },
        {
            "checklist_id": "31",
            "checklist_item": "Deed of Assignment relating to the Land"
        },
        {
            "checklist_id": "32",
            "checklist_item": "Documents relating to Leasehold properties"
        },
        {
            "checklist_id": "33",
            "checklist_item": "Evidence of remittance of Stamp duty"
        },
        {
            "checklist_id": "34",
            "checklist_item": "Delivery Note/ Register/Waybills"
        },
    ]


const scope = {
    "checklists": [
        {
            "checklist_id": "1",
            "checklist_item": "Pay as you Earn"
        },
        {
            "checklist_id": "2",
            "checklist_item": "Capital Gain Tax"
        },
        {
            "checklist_id": "3",
            "checklist_item": "Withholding Tax"
        },
        {
            "checklist_id": "4",
            "checklist_item": "Stamp Duty"
        },
        {
            "checklist_id": "5",
            "checklist_item": "Business Premises"
        },
        {
            "checklist_id": "6",
            "checklist_item": "Ground Rent"
        },
        {
            "checklist_id": "7",
            "checklist_item": "Development Levy"
        },
        {
            "checklist_id": "8",
            "checklist_item": "Haulage fee"
        },
        {
            "checklist_id": "9",
            "checklist_item": "Others"
        },
    ],
}




const VisitModal = ({ isOpen, closeModal, id }) => {

    const [isFetching, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const router = useRouter()

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName


    const onSubmit = async (data) => {
        data.job_id = id
        data.doneby = staffName
        setIsLoading(true)
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newauditlog.php', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            const dataFetch = await res.json()
            setIsLoading(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                router.reload()
            }

        } catch (error) {
            setIsLoading(false)
            console.error('Server Error:', error)
        } finally {
            setIsLoading(false)
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
                <div >
                    <h6 className="my-3">New Audit Visit</h6>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="mb-2">
                            <label className="block mb-1  ">
                                Visit Date:
                            </label>
                            <input
                                type="date"
                                name='visitdate'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Personel met:
                            </label>
                            <input type="text"
                                name="personnelmet"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Purpose of visit:
                            </label>
                            <input type="text"
                                name="purpose"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Designation:
                            </label>
                            <input type="text"
                                name='designation'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                placeholder='eg, internal auditor'
                                ref={register()}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Department:
                            </label>
                            <input type="text"
                                name="department"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Was the purpose of visit achieved ?:
                            </label>
                            <input type="radio" name="purposeachieved" value="Yes" ref={register()} /> Yes <span className='mr-4'></span>
                            <input type="radio" name="purposeachieved" value="No" ref={register()} /> NO <span className='mr-4'></span>
                            <input type="radio" name="purposeachieved" value="partially" ref={register()} /> Partially 
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Rate your visit:
                            </label>

                            <div >
                                <label htmlFor="" className='p-1'>1</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="1" ref={register()} />

                                <label htmlFor="" className='p-1'>2</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="2" ref={register()} />

                                <label htmlFor="" className='p-1'>3</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="3" ref={register()} />

                                <label htmlFor="" className='p-1'>4</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="4" ref={register()} />

                                <label htmlFor="" className='p-1'>5</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="5" ref={register()} />

                                <label htmlFor="" className='p-1' >6</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="6" ref={register()} />

                                <label htmlFor="" className='p-1'>7</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="7" ref={register()} />
                            </div>


                        </div>

                        <div className="mb-2">
                            <label className="block mb-1">
                                Note:
                            </label>
                            <textarea

                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                                name='note'
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
        </>
    );
};

export default VisitModal;
