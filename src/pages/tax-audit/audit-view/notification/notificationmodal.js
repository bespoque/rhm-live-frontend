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




const NotificationModal = ({ isOpen, closeModal, id, auditStartYr, auditEndYr, address }) => {
    const [isFetching, setIsLoading] = useState(false);
    const [checkboxes, setCheckboxes] = useState(new Array(scope.checklists.length).fill(false));
    const [selectedItems, setSelectedItems] = useState([]);
    const [letterState, setLetterState] = useState('hidden')
    const [formState, setFormState] = useState('')
    const [selectedValuesItems, setSelectedValuesItems] = useState(checks.map(() => 'NO'));
    const [selectedChecklistItems, setSelectedChecklistItems] = useState([]);
    const dropdownRef = useRef(null);

    const router = useRouter()
    const [isOpenCheckItems, setIsOpenCheckItems] = useState(false);

    const toggleDropdown = () => {
        setIsOpenCheckItems(!isOpenCheckItems);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenCheckItems(false);
            }
        }
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);


    var currentDate = new Date();

    var formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const emailAdd = decoded.user

    const [formData, setFormData] = useState({
        notification_date: '',
        notification_email: '',
        notification_fileno: '',
        notification_addressee: '',
        actionType: 'Audit Visit',
        reviewstatus: 'Draft',
        approvestatus: 'Draft',
        doneby: emailAdd,
        notification_status: 'Created',
        notification_delivery: 'Email',
        notification_note: 'Audit Visit',

    });

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setCheckboxes(updatedCheckboxes);

        if (updatedCheckboxes[index]) {
            setSelectedItems((prevItems) => [...prevItems, scope.checklists[index].checklist_item]);
        } else {
            setSelectedItems((prevItems) =>
                prevItems.filter((item) => item !== scope.checklists[index].checklist_item)
            );
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleOptionChange = (index) => {
        const newSelectedValues = [...selectedValuesItems];
        if (newSelectedValues[index] === 'NO') {
            newSelectedValues[index] = 'YES';
            setSelectedChecklistItems([...selectedChecklistItems, checks[index].checklist_item]); // Add the checklist_item
        } else {
            newSelectedValues[index] = 'NO';
            setSelectedChecklistItems(selectedChecklistItems.filter(item => item !== checks[index].checklist_item)); // Remove the checklist_item
        }
        setSelectedValuesItems(newSelectedValues);
    };


    function Letter() {
        return (
            <div>
                <div>
                    <div className="text-justify" >
                        <p className="flex justify-between mt-3">   </p>
                        <p>Ref - {formData.notification_fileno}</p>
                        <p>Date - {formattedDate}</p>
                        <p className="w-64">{address}</p>
                        <p className="font-bold">Dear {formData.notification_addressee},</p><br />
                        <div>
                            <p className="font-bold">NOTIFICATION OF BACKDUTY TAX AUDIT EXERCISE {` (Jan ${auditStartYr} - Dec ${auditEndYr})`}</p><br />
                        </div>
                        <p>The above Subject refers;</p>
                        <p>
                            This is to notify you that the Kogi State Internal Revenue Service (KGIRS) wishes to carry
                            out Tax Audit of all Taxes due from your Organization to the Kogi State Government for
                            the period stated above. The exercise is instituted pursuant to section 46, 47 (4) and (4)
                            of the Personal Income Tax Act, Cap P8, and Laws of the Federation of Nigeria as
                            amended. The Audit will cover the following Taxes/Levies;
                        </p><br />
                        <div className="p-4">
                            <ol style={{ listStyle: "i" }} >
                                {selectedItems.map((item) => (
                                    <li>{item}</li>

                                ))}
                            </ol>
                        </div>

                        <br />

                        <p>
                            The date scheduled for the commencement of the audit exercise at your Organization is
                            two (2) weeks from the date of receipt of this letter. We hope that you will provide all
                            necessary documents and support to the audit team to facilitate the exercise as required
                            by law.

                        </p><br />
                        <p>
                            It is pertinent to apprise you that exercise is for information gathering only and the
                            auditors are not authorized to assess your Organization to tax. All reports are subjected to
                            further checks and falsified or unsatisfactory reports will be rejected and investigated in
                            the course of the assessment.

                        </p><br />
                        <p>
                            Kindly note that in the event of any obstruction to this exercise, submission of incorrect or
                            false information/reports, or any other action that may delay this exercise, the Chairman
                            and/or the Directors of your Organization would be vicariously held liable and penalized in
                            accordance with the statutory provisions of Personal Income Tax 1993 and as amended to
                            date.
                        </p><br />
                        <p>
                            In case of any undue advances to connive on the part of our representatives, please get in
                            touch with Executive Chairman, Kogi State Internal Revenue Service immediately.
                            Attached is the list of documents required for the Audit Exercise.
                        </p><br />
                        <div className="p-4">
                            <ol style={{ listStyle: "i" }} >
                                {selectedChecklistItems.map((item) => (
                                    <li>{item}</li>

                                ))}
                            </ol>
                        </div><br />
                        <p>Thank you for the anticipated cooperation.</p> <br />
                        <p>
                            Yours Faithfully..
                        </p>
                        <p>For: <span className="font-bold">KOGI STATE INTERNAL REVENUE SERVICE </span></p><br />
                        <SignatureCol />
                        <p className="font-bold">Sule Salihu Enehe</p>
                        Executive Chairman

                    </div>

                </div>
            </div>
        )
    }


    const Proceed = (e) => {
        e.preventDefault()
        if (selectedItems.length === 0 || !selectedValuesItems.includes("YES")) {
            toast.error("Please select Audit scope and Audit documents")
        } else {
            setLetterState('')
            setFormState('hidden')
        }
    }


    const submitNotice = async () => {

        formData.auditscope = String(selectedItems)
        formData.checklists = String(selectedValuesItems)
        formData.notification_date = formattedDate
        formData.job_id = id
        setIsLoading(true)

        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newnotification.php', {
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
                className="fixed inset-0 bg-white border max-w-lg p-4 mx-auto overflow-y-scroll"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"

            >
                <div className={`${letterState}`}>
                    <Letter />
                </div>
                <div className={`${formState}`}>
                    <h6 className="text-dark text-center">Notice of Audit</h6>
                    <form onSubmit={Proceed}>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="mb-2">
                                <label className="block mb-1  text-dark">
                                    Letter date:
                                </label>
                                <input
                                    type="text"
                                    // name='notification_date'
                                    value={formattedDate}
                                    // onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required
                                    readOnly

                                />
                            </div>
                            <div className="mb-1">
                                <label className="block mb-1 text-dark">
                                    Recipient Email:
                                </label>
                                <input
                                    name="notification_email"
                                    type="email"
                                    value={formData.notification_email}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />
                            </div>
                            <div className="mb-1">
                                <label className="text-dark  block mb-1">
                                    File Ref:
                                </label>
                                <input type="text"
                                    name='notification_fileno'
                                    value={formData.notification_fileno}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />

                            </div>
                            <div className="mb-1">
                                <label className="text-dark  block mb-1">
                                    Addresse:
                                </label>
                                <input type="text"
                                    name='notification_addressee'
                                    onChange={handleInputChange}
                                    placeholder="Eg. Managing director"
                                    value={formData.notification_addressee}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                    required

                                />

                            </div>
                
                        </div>
                        <div className="my-4">
                            <hr />
                        </div>
                        <p className="font-bold my-4 text-center">Audit Scope</p>
                        <div className="grid grid-cols-3 gap-2">
                            {scope.checklists.map((checklist, index) => (
                                <div key={checklist.checklist_id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${checklist.checklist_id}`}
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                        checked={checkboxes[index]}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                    <label htmlFor={`checkbox-${checklist.checklist_id}`} className="ml-2">
                                        {checklist.checklist_item}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="my-4">
                            <hr />
                        </div>

                        <p className="font-bold my-4 text-center">Audit Documents</p>

                        <div className="flex justify-center">
                            <div ref={dropdownRef}>
                                <div>
                                    <button
                                        onClick={toggleDropdown}
                                        type="button"
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
                                    >
                                        Select Options
                                        {isOpenCheckItems ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}

                                    </button>
                                </div>
                                {isOpenCheckItems && (
                                    <div className="origin-top-right right-0 mt-2 w-72 h-32 overflow-y-scroll rounded-md shadow-lg bg-white ring-1">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {checks.map((option, index) => (
                                                <label key={option.checklist_id} className="block pl-4 pr-12 py-2 hover:bg-gray-100">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-5 w-5 text-blue-500 mr-2"
                                                        onChange={() => handleOptionChange(index)}
                                                        checked={selectedValuesItems[index] === 'YES'}
                                                    />
                                                    {option.checklist_item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-evenly mt-4">
                            <button
                                className="bg-green-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
                                type="submit"
                            >
                                Proceed
                            </button>

                            <button
                                className="bg-red-400 hover:bg-gray-400 text-white py-2 px-4 rounded mt-4 ml-2"
                                onClick={() => {
                                    setFormState('')
                                    setLetterState('hidden')
                                    closeModal()
                                }}
                            >
                                Close
                            </button>
                        </div>

                    </form>
                </div>

                <div className={`${letterState} flex justify-evenly`}>
                    <button
                        className="bg-green-500 hover:bg-gray-400 text-white py-2 px-4 rounded mt-4 ml-2"
                        onClick={submitNotice}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-red-500 hover:bg-gray-400 text-white py-2 px-4 rounded mt-4 ml-2"
                        onClick={() => {
                            setFormState('')
                            setLetterState('hidden')
                            closeModal()
                        }}
                    >
                        Close
                    </button>
                </div>

            </Modal>
        </>
    );
};

export default NotificationModal;
