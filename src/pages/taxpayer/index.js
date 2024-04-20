import React, { useEffect, useState } from 'react'
import axios from "axios";
import url from "../../config/url";
import setAuthToken from "../../functions/setAuthToken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Loader from 'react-loader-spinner';


export default function Index() {
    const [taxOffice, setTaxOffice] = useState([])
    const [incomeSource, setIncomSource] = useState([])
    const [state, setState] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [lga, setLga] = useState([])
    const [createError, setCreateError] = useState("")
    const [selectedOption, setSelectedOption] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [displayRegForm, setDisplayRegForm] = useState(false);
    const router = useRouter();
    const [idData, setIdData] = useState({
        surname: '',
        first_name: '',
        middle_name: '',
        birth_date: '',
        phone_number: '',
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const kogiLga = lga.filter(item => item.jtb_states === 22);

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        setInputValue('');
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleIdData = (event) => {
        const { name, value } = event.target;
        setIdData({ ...idData, [name]: value });
    };

    const handleIdVal = async (e) => {
        e.preventDefault();
        setIsFetching(true)
        const requestBody = {
            id: inputValue,
            src: selectedOption
        };

        try {
            const response = await fetch('https://centralapi.abiapay.ng/api/v1/identity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json()
            setIsFetching(false)
            if (responseData?.idtype === "NIN") {
                console.log("NIN - Number");
            }
            else if (responseData?.idtype === "BVN") {

                console.log("BVN");

                setIdData(
                    {
                        "surname": responseData?.lastname,
                        "first_name": responseData?.firstname,
                        "middle_name": responseData?.middlename,
                        "birth_date": responseData?.birthdate,
                        "phone_number": responseData?.phone,
                    }
                );
                setDisplayRegForm(true)

            } else if (responseData.status.status === "verified") {
                console.log("NIN-PHONE");
                setIdData(
                    {
                        "surname": responseData?.lastname,
                        "first_name": responseData?.firstname,
                        "middle_name": responseData?.middlename,
                        "birth_date": responseData?.birthdate,
                        "phone_number": responseData?.phone,
                    }
                );
                setDisplayRegForm(true)
            }
            else {
                setDisplayRegForm(false)
                toast.error(responseData?.message)
                setIdData('')
            }
        } catch (error) {
            console.error('Error:', error);
            setDisplayRegForm(false)

        }

    };


    useEffect(() => {
        setAuthToken();
        const fetchPost = async () => {
            try {
                let res = await axios.get(`${url.BASE_URL}user/items`);
                let itemsBody = res.data.body
                let taxOffice = itemsBody.taxOffice
                let incSource = itemsBody.incomeSource
                let stat = itemsBody.state
                let lg = itemsBody.lga
                setIncomSource(incSource)
                setTaxOffice(taxOffice)
                setState(stat)
                setLga(lg)
            } catch (e) {
                console.log(e);
            }
        };
        fetchPost();

    }, []);

    const onSubmit = (data) => {
        setIsFetching(true)
        axios.post(`${url.BASE_URL}taxpayer/new-individual`, data)
            .then(function (response) {
                setIsFetching(false)
                toast.success("Created Successfully!");
                router.push('/reports-individual')
            })
            .catch(function (error) {
                setIsFetching(false)
                if (error.response) {
                    setCreateError(() => error.response.data.message);
                    toast.error(createError)
                } else {
                    toast.error("Failed to create Taxpayer!");
                }

            })
    };

    function formatDateToMMDDYYYY(inputDate) {
        var components = inputDate?.split("-") || new Date();

        var formattedDate = components[2] + "-" + components[1] + "-" + components[0];

        return formattedDate;
    }

    return (
        <div>
            {isFetching &&
                <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen  z-50 overflow-hidden bg-black opacity-75 flex flex-col items-center justify-center">
                    <Loader
                        visible={isFetching}
                        type="ThreeDots"
                        color="#00FA9A"
                        height={19}
                        width={19}
                        timeout={0}
                        className="ml-2"
                    />
                    <p className="w-1/3 text-center text-white">
                        Processing...
                    </p>
                </div>
            }
            <div className="flex justify-center mb-4">
                <h6 className="p-2 font-bold">Register Individual Taxpayer</h6>
            </div>
            <ToastContainer />
            <p className=" font-bold mb-4 text-center">Select an ID:</p>
            <form onSubmit={handleIdVal} className="flex justify-center">
                <div className="p-4 grid grid-cols-3 gap-4">
                    <div>
                        <select
                            className="w-full border border-gray-300 rounded-md"
                            onChange={handleSelectChange}
                            value={selectedOption}
                            required
                        >
                            <option value="">Select an option</option>
                            <option value="BVN">BVN</option>
                            {/* <option value="NIN">NIN</option> */}
                            <option value="NIN-PHONE">NIN-PHONE</option>
                        </select>
                    </div>
                    <div>
                        <div>
                            <input
                                type="text"
                                className={`w-full p-2 border border-gray-300 rounded-md ${(selectedOption === 'BVN' || selectedOption === 'NIN') &&
                                    'appearance-none w-px'
                                    }`}
                                required
                                value={inputValue}
                                placeholder={`Enter ${selectedOption}`}
                                onChange={handleInputChange}
                            />

                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>

            {displayRegForm && (
                <div className="block p-6 rounded-lg bg-white w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="form-group ">
                                <p>Title <span className="text-red-400">*</span></p>
                                <select name="indv_title" required ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    <option value="">Please Select</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Mrss">Miss</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <p>Surname <span className="text-red-400">*</span></p>
                                <input name="surname" ref={register({ required: "Surname is required" })} onChange={handleIdData} value={idData?.surname} required type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                                {errors.surname && <small className="text-red-600">{errors.surname.message}</small>}
                            </div>

                            <div className="form-group ">
                                <p>First Name <span className="text-red-400">*</span></p>
                                <input name="first_name" ref={register({ required: "First Name is required" })} value={idData?.first_name} onChange={handleIdData} required type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                                {errors.first_name && <small className="text-red-600">{errors.first_name.message}</small>}
                            </div>

                            <div className="form-group ">
                                <p>Middle name</p>
                                <input name="middle_name" onChange={handleIdData} value={idData?.middle_name} ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>

                            <div className="form-group">
                                <p>Date of Birth <span className="text-red-400">*</span></p>
                                <input name="birth_date" readOnly value={formatDateToMMDDYYYY(idData?.birth_date)} required ref={register({ required: "Birthdate is required" })} type="date" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                                {errors.birth_date && <small className="text-red-600">{errors.birth_date.message}</small>}
                            </div>


                            <div className="form-group ">
                                <p>Phone Number <span className="text-red-400">*</span></p>
                                <input name="phone_number" onChange={handleIdData} value={idData?.phone_number} required ref={register({ required: "Phone number is Required" })} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                                {errors.phone_number && <small className="text-red-600">{errors.phone_number.message}</small>}
                            </div>

                            <div className="form-group ">
                                <p>Gender <span className="text-red-400">*</span></p>
                                <select name="gender" required ref={register({ required: "Gender is Required" })} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    <option value="">Please Select</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </select>
                                {errors.gender && <small className="text-red-600">{errors.gender.message}</small>}
                            </div>

                            <div className="form-group ">
                                <p>Marital Status <span className="text-red-400">*</span></p>
                                <select name="marital_status" required ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    <option value="">Please Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>

                            <div className="form-group ">
                                <p>State of residence</p>
                                <input readOnly name="state_of_residence" value="Kogi" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>

                            <div className="form-group ">
                                <p>LGA <span className="text-red-400">*</span></p>
                                <select name="lga" required ref={register({ required: "LGA is Required" })} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    <option value="">Please Select</option>
                                    {kogiLga.map((lg) => <option key={lg.idlga} value={lg.name}>{lg.name}</option>)}
                                </select>
                                {errors.lga && <small className="text-red-600">{errors.lga.message}</small>}
                            </div>
                            <div className="form-group ">
                                <p>BVN</p>
                                <input name="bvn" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p>Tax Office <span className="text-red-400">*</span></p>
                                <select name="tax_office" required ref={register({ required: "Tax office is Required" })} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    <option value="">Please Select</option>
                                    {taxOffice.map((office) => <option key={office.idstation} value={office.station_code}>{office.name}</option>)}
                                </select>
                                {errors.tax_office && <small className="text-red-600">{errors.tax_office.message}</small>}
                            </div>
                        </div>
                        <div className="m-4">
                            <hr />
                            <h6 className="m-3 font-bold">Additional Information</h6>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="form-group">
                                <p>Email</p>
                                <input name="email" ref={register()} type="email" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group">
                                <p>Alternate phone number</p>
                                <input name="mobile_number" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>

                            <div className="form-group ">
                                <p>State of Origin <span className="text-red-400">*</span></p>
                                <select name="state_of_origin" required ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    <option value="">Please select</option>
                                    {state.map((st) => <option key={st.jtb_idstates} value={st.jtb_idstates}>{st.state}</option>)}
                                </select>
                            </div>

                            <div className="form-group ">
                                <p>Birth Place <span className="text-red-400">*</span></p>
                                <input name="birth_place" required ref={register({ required: "Birth Place is Required" })} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                                {errors.birth_place && <small className="text-red-600">{errors.birth_place.message}</small>}
                            </div>
                            <div className="form-group ">
                                <p>Occupation</p>
                                <input name="occupation" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p>Mother's Name</p>
                                <input name="mother_name" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>

                            <div className="form-group ">
                                <p>House no</p>
                                <input name="house_no" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p>Street</p>
                                <input name="street" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p>Ward</p>
                                <input name="ward" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p>City</p>
                                <input name="city" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>
                            <div className="form-group ">
                                <p>Nationality</p>
                                <input name="nationality" ref={register()} readOnly value={'Nigerian'} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                                />
                            </div>

                            <div className="form-group ">
                                <p>Income Source</p>
                                <select name="income_source" ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                    {incomeSource.map((src) => <option key={src.id} value={src.source}>{src.source}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mb-6 flex justify-center">
                            <button
                                style={{ backgroundColor: "#84abeb" }}
                                className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                                type="submit"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
