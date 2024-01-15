import Widget from "../widget";
import { formatNumber } from "../../functions/numbers";
import dateformat from "dateformat";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { FiTriangle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import url from '../../config/url';
import axios from "axios";
import setAuthToken from "../../functions/setAuthToken";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WarningRounded } from "@material-ui/icons";

export const StartAssessment = () => {
  const [invalidkgtinmessage, Setinvalidkgtinmessage] = useState('')
  const [disabled, setDisabled] = useState(true);
  const [validmsg, setvalidmsg] = useState("hidden");
  const [invalidmsg, setinvalidmsg] = useState("hidden");
  const [payerDetails, setpayerDetails] = useState([]);
  const [validateMssg, setValidateMssg] = useState([]);
  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(() => false);
  const [isFetching2, setIsFetching2] = useState(() => false);
  const [modal, setModal] = useState(false);

  const toggleModal = (e) => {
    // e.preventDefault()
    setModal(!modal);
  };

  const userKGTN = payerDetails.KGTIN

  const TaxOffice = payerDetails.tax_office

  let kgtinWatch = watch("kgtin")
  let typeWatch = watch("type")
  let yearWatch = watch("year")

  const KGTIN = userKGTN
  const station = TaxOffice


  setAuthToken();
  const onSubmitform = async data => {

    let createAsses = {
      year: yearWatch,
      kgtin: kgtinWatch,
      tax_office: station,
      assessment_type: typeWatch
    }
    setIsFetching2(true)
    try {
      const res = await axios.post(`${url.BASE_URL}forma/new-assessment`, createAsses);
      let assessment_id = res.data.body.assessment_id
      setIsFetching2(false)
      if (data.type === "Assessment") {
        router.push(`/direct-asses/${assessment_id}_${yearWatch}_${KGTIN}`)
      } else {
        router.push(`/view/boj/${assessment_id}_${yearWatch}_${KGTIN}`)
      }
    }
    catch (err) {
      setIsFetching2(false)
      console.log(err);
    }
  };

  setAuthToken();
  const validateAssessment = data => {
    setIsFetching(true)

    let valAsses = {
      year: data.year,
      kgtin: data.kgtin,
    }

    let createAssesment = {
      year: yearWatch,
      kgtin: kgtinWatch,
      tax_office: station,
      assessment_type: typeWatch
    }

    axios.post(`${url.BASE_URL}forma/validate-assessment`, valAsses)
      .then(function (response) {
        setIsFetching(false)
        axios.post(`${url.BASE_URL}forma/new-assessment`, createAssesment)
          .then(function (response) {
            let assessment_id = response.data.body.assessment_id
            if (typeWatch === "Assessment") {
              router.push(`/direct-asses/${assessment_id}_${yearWatch}_${kgtinWatch}`)
            } else {
              router.push(`/view/boj/${assessment_id}_${yearWatch}_${kgtinWatch}`)
            }
          })

      })
      .catch(function (error) {
        setIsFetching(false)
        setModal(true)
        if (error.response) {
          setValidateMssg((error.response.data.message).replaceAll("Error", "Warning"));
        } else {
          toast.error("Failed!");
        }
      })
  };


  setAuthToken();
  const verifiyKGTIN = async () => {
    let kgtin = {
      KGTIN: kgtinWatch
    }
    setIsFetching(true)

    try {
      let res = await axios.post(`${url.BASE_URL}taxpayer/view-taxpayers`, kgtin);
      setIsFetching(false)
      let userpayer = res.data.body
      setpayerDetails(userpayer)
      setDisabled(false)
      setvalidmsg('')
      setinvalidmsg('hidden')
    } catch (err) {
      setIsFetching(false)
      setDisabled(true)
      setinvalidmsg('')
      setvalidmsg('hidden')
      Setinvalidkgtinmessage("Invalid KGTIN");
    }
  };

  return (
    <>
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
          <p className="font-bold">Processing ...</p>
        </div>
      )}

      {isFetching2 && (
        <div className="flex justify-center item mb-2">
          <Loader
            visible={isFetching2}
            type="BallTriangle"
            color="#00FA9A"
            height={19}
            width={19}
            timeout={0}
            className="ml-2"
          />
          <p className="font-bold">Creating Assessment...</p>
        </div>
      )}

      {modal && (
        <div className="modal">
          <div className="modal-content" width="300">
            <form onSubmit={handleSubmit(onSubmitform)}>
              <div className="flex justify-center">
                <WarningRounded
                  size={15}
                  className="text-yellow-400"
                />
              </div>
              <p>{validateMssg}</p>
              <div className="mt-2 flex justify-between">
                <button onClick={toggleModal}
                  className="btn w-32 bg-red-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                >
                  Cancel
                </button>
                <div>

                </div>
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

      <p className="flex justify-center font-bold">Start Assessment</p>
      <Widget>
        <div >
          <form onSubmit={handleSubmit(validateAssessment)}>
            <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">

              <div className="w-full lg:w-2/5">
                <div className="">
                  <input ref={register()} type="text" name="kgtin" placeholder="Enter KGTIN" />
                </div>
              </div>

              <div className="w-full lg:w-2/5 py-2 self-center">
                <p
                  onClick={verifiyKGTIN}
                  style={{ backgroundColor: "#84abeb" }}
                  className="btn btn-default text-white btn-outlined bg-transparent cursor-pointer rounded-md"
                >
                  Verify
                </p>
              </div>

              <div className="w-full lg:w-4/5">
                <div>
                  <select required ref={register()} name="year" id="">
                    <option value="">Select Year</option>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-4/5 ">
                <select ref={register()} name="type" id="">
                  <option value="Assessment">Assessment</option>
                  <option value="BOJ">BOJ Assessment</option>
                </select>
              </div>

              <div className="w-full lg:w-5/5 self-center">
                <button
                  style={{ backgroundColor: "#84abeb" }}
                  className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                  type="submit"
                  disabled={disabled}
                >
                  Start Assessment
                </button>
              </div>
            </div>
            <div>
              <small className={`${validmsg}`}>{payerDetails.tp_name}</small>
              <small className={`text-red-600 ${invalidmsg}`}>{invalidkgtinmessage}</small>
            </div>
          </form>
        </div>
      </Widget>
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
  );
};


export const StartSingleIndividualAssessment = ({ kgtinVal, assessmentYear, payerprop, routerAssId }) => {
  let assessment_id = routerAssId
  let indvData = payerprop

  const [toggleel, setToggle] = useState('hidden')
  const [togglee2, setToggle2] = useState('hidden')
  const [togglee3, setToggle3] = useState('hidden')
  const [togglee4, setToggle4] = useState('hidden')
  const [togglee5, setToggle5] = useState('hidden')
  const [togglee6, setToggle6] = useState('hidden')
  const [togglee7, setToggle7] = useState('hidden')
  const [togglee8, setToggle8] = useState('hidden')
  const [togglee9, setToggle9] = useState('hidden')
  const [togglee10, setToggle10] = useState('hidden')
  const [togglee11, setToggle11] = useState('hidden')
  const [togglee12, setToggle12] = useState('hidden')
  const [togglee13, setToggle13] = useState('hidden')
  const [togglee14, setToggle14] = useState('hidden')
  const [togglee15, setToggle15] = useState('hidden')
  const [resiToggle, setresToggle] = useState('hidden')
  const [marriedToggle, setmarriedToggle] = useState('hidden')
  const [childrenToggle, setchildrenToggle] = useState('hidden')
  const [servantsToggle, setservantsToggle] = useState('hidden')
  const [form1toggle, setform1toggle] = useState('')
  const [form2toggle, setform2toggle] = useState('')
  const [empName, setEmpName] = useState("");
  const [empAdd, setEmpAdd] = useState("");
  const [startDate, setStartDate] = useState("");
  const [grossPay, setGrossPay] = useState("");
  const [taxDeduct, setTaxDeduct] = useState("");
  const [paySLip, setPaySlip] = useState(null);
  const [isFetching3, setIsFetching3] = useState(() => false);
  const [isFetching4, setIsFetching4] = useState(() => false);
  const [isFetching5, setIsFetching5] = useState(() => false);
  const [isFetching6, setIsFetching6] = useState(() => false);
  const [isFetching7, setIsFetching7] = useState(() => false);
  const [isFetching8, setIsFetching8] = useState(() => false);
  const [isFetching9, setIsFetching9] = useState(() => false);
  const [isFetching10, setIsFetching10] = useState(() => false);
  const [isFetching11, setIsFetching11] = useState(() => false);
  const [isFetching12, setIsFetching12] = useState(() => false);
  const [isFetching13, setIsFetching13] = useState(() => false);
  const [isFetching14, setIsFetching14] = useState(() => false);
  const [isFetching15, setIsFetching15] = useState(() => false);
  const [isFetching16, setIsFetching16] = useState(() => false);
  const [isFetching17, setIsFetching17] = useState(() => false);
  const [isFetching18, setIsFetching18] = useState(() => false);
  const [isFetching19, setIsFetching19] = useState(() => false);
  const [isFetching20, setIsFetching20] = useState(() => false);
  const [isFetching21, setIsFetching21] = useState(() => false);
  const [isFetching22, setIsFetching22] = useState(() => false);
  const [isFetching23, setIsFetching23] = useState(() => false);
  const [busTypes, setBusTypes] = useState([]);
  const router = useRouter();

  const [formValues, setFormValues] = useState([{ assessment_id: `${assessment_id}`, source: "", gross_amount: "", comments: "" }])

  let handleChange1 = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  }

  const [fixedValues, fixValues] = useState({ amount: 0 });
  const { control, handleSubmit } = useForm({ amount: 0 });

  useEffect(() => {
    setAuthToken();
    const fetchPost = async () => {
      try {
        let res = await axios.get(`${url.BASE_URL}forma/business-type`);
        res = res.data.body;
        setBusTypes(res)
        console.log("res", res)

      } catch (e) {
        console.log(e.response);
      }
    };
    fetchPost();
  }, []);

  let handleSubmit1 = (event) => {
    event.preventDefault();
    let formVal = (formValues)
    for (let index = 0; index < formVal.length; index++) {
      const element = formVal[index];
      axios.post(`${url.BASE_URL}forma/outside`, element)
        .then(function (response) {
          toast.success("Saved Successfully!");
          console.log(response);
        })
        .catch(function (error) {
          toast.error("Failed!");
          console.log(error);
        });
    }
  }
  let addFormFields1 = () => {
    setFormValues([...formValues, { assessment_id: `${assessment_id}`, source: "", gross_amount: "", comments: "" }])
  }

  let handleSpouseSubmit = (event) => {
    event.preventDefault();
    setIsFetching5(true)
    let formVal = (spouse)
    for (let index = 0; index < formVal.length; index++) {
      const element = formVal[index];
      axios.post(`${url.BASE_URL}forma/spouse`, element)
        .then(function (response) {
          setIsFetching5(false)
          toast.success("Saved Successfully!");
        })
        .catch(function (error) {
          setIsFetching5(false)
          toast.error("Failed! please try again");
        });
    }
  }


  const [spouse, setSpouse] = useState(
    [{
      assessment_id: `${assessment_id}`, name: "", employer: "",
      dob: "", occupation: "", employer_addr: ""
    }]
  )

  let handleSpouseChange = (i, e) => {
    let newSpouseValues = [...spouse];
    newSpouseValues[i][e.target.name] = e.target.value;
    setSpouse(newSpouseValues);
  }

  let addSpouseFields = () => {
    setSpouse([...spouse, {
      assessment_id: `${assessment_id}`,
      name: "", employer: "", dob: "", occupation: "", employer_addr: ""
    }])
  }

  let removeSpouseFields = (i) => {
    let newSpouseValues = [...spouse];
    newSpouseValues.splice(i, 1);
    setSpouse(newSpouseValues)
  }

  const [children, setChildren] = useState(
    [{
      assessment_id: `${assessment_id}`, name: "", dob: "", school_name: "",
      school_addr: "", school_fees: "", child_income: ""
    }]
  )

  let handleChildrenChange = (i, e) => {
    let newChildValues = [...children];
    newChildValues[i][e.target.name] = e.target.value;
    setChildren(newChildValues);
    console.log(newChildValues);
  }

  let addChildFields = () => {
    setChildren([...children, {
      assessment_id: `${assessment_id}`, name: "", dob: "",
      school_name: "", school_addr: "", school_fees: "", child_income: ""
    }])
  }

  let removeChildFields = (i) => {
    let newChildValues = [...children];
    newChildValues.splice(i, 1);
    setChildren(newChildValues)

  }

  let handleChildSubmit = (event) => {
    event.preventDefault();
    setIsFetching11(true)
    let formVal = (children)
    for (let index = 0; index < formVal.length; index++) {
      const element = formVal[index];
      axios.post(`${url.BASE_URL}forma/children`, element)
        .then(function (response) {
          setIsFetching11(false)
          toast.success("Saved Successfully!");
        })
        .catch(function (error) {
          setIsFetching11(false)
          toast.error("Failed! please try again");
        });
    }
  }

  const [domesticStaff, setDomesticStaff] = useState(
    [{
      assessment_id: `${assessment_id}`, title: "", name: "", house_no: "", street: "",
      town: "", lga: "", state: "", amount_paid: "", payer: ""
    }]
  )

  let handleDomesticStaffChange = (i, e) => {
    let newStaffValues = [...domesticStaff];
    newStaffValues[i][e.target.name] = e.target.value;
    setDomesticStaff(newStaffValues);
    console.log(newStaffValues);
  }

  let addStaffFields = () => {
    setDomesticStaff([...domesticStaff, {
      assessment_id: `${assessment_id}`, title: "", name: "", house_no: "", street: "",
      town: "", lga: "", state: "", amount_paid: "", payer: ""
    }])
  }

  let removeStaffFields = (i) => {
    let newStaffValues = [...domesticStaff];
    newStaffValues.splice(i, 1);
    setDomesticStaff(newStaffValues)
  }

  let handleStaffSubmit = (event) => {
    event.preventDefault();
    setIsFetching12(true)
    let formVal = (domesticStaff)
    for (let index = 0; index < formVal.length; index++) {
      const element = formVal[index];
      axios.post(`${url.BASE_URL}forma/domestic-staff`, element)
        .then(function (response) {
          setIsFetching12(false)
          toast.success("Saved Successfully!");
        })
        .catch(function (error) {
          setIsFetching12(false)
          toast.error("Failed! please try again");
        });
    }
  }

  const [pensionDeduct, setPensionDeduct] = useState(
    { assessment_id: "", pfa: "", pfa_addr: "", rsa_no: "", amount: "", comments: "" }
  )


  const [childData, setChildData] = useState(
    { assessment_id: "", name: "", dob: "", school_name: "", school_addr: "", school_fees: "", child_income: "" }
  )

  const [residentialAddress, setResidentialAddress] = useState(
    {
      assessment_id: "", house_no: "", street: "", town: "", lga: "", residence_type: "",
      residence_owner: "", annual_rent: "", owner_name: "", owner_phone: ""
    }
  )



  const [partnerData, setPartnerData] = useState(
    {
      assessment_id: "", name: "", addr: "", phone: "", percentage: "",
      comments: ""
    }
  )

  const [farmland, setFarmland] = useState(
    {
      assessment_id: "", addr: "", acq_date: "", land_cost: "", produce_cost: "",
    }
  )


  const [selfEmployed, setSelfEmployed] = useState(
    {
      assessment_id: "", business_type: "", business_name: "", business_addr: "", business_start_date: "", income_earned: "",
      other_income: "", cash_inc_expense: "", expense: "", figures_estimated: ""
    }
  )

  let incEarned = Number(selfEmployed.income_earned)
  let otherInc = Number(selfEmployed.other_income)
  const totalBusInc = incEarned + otherInc

  const [expensesData, setExpenses] = useState(
    {
      assessment_id: "", item: "", amount: ""
    }
  )

  let expenseAmount = Number(expensesData.amount)
  const netProfit = Number(totalBusInc) - expenseAmount

  const [nhisData, setNhis] = useState(
    {
      assessment_id: "", company: "", addr: "", insurance_no: "", amount: "", comments: ""
    }
  )

  const [lifeInsData, setLifeInsData] = useState(
    {
      assessment_id: "", company: "", addr: "", rsa_no: "", amount: "", comments: ""
    }
  )

  const [bankInterest, setBankInterest] = useState(
    {
      assessment_id: "", name: "", account: "", bvn: "", gross_amount: "", comments: ""
    }
  )

  const [rentIncome, setRentIncome] = useState(
    {
      assessment_id: "", prop_type: "", prop_address: "",
      rental_type: "", rental_amount: "",
      renter_phone: "", renter_name: "", comments: ""
    }
  )
  const [dividends, setDividends] = useState(
    {
      assessment_id: "", name: "", addr: "", amount: "", comments: "",
    }
  )

  const [pension, setPension] = useState(
    {
      assessment_id: "", pfa: "", pfa_addr: "", gross_amount: "", comments: "",
    }
  )
  const [asset, setAsset] = useState(
    {
      assessment_id: "", asset_type: "", asset_addr: "", buyer_name: "",
      buyer_addr: "", buyer_phone: "", amount: "", comments: ""
    }
  )

  const [outsideSource, SetOutsideSource] = useState(
    {
      assessment_id: "", source: "", gross_amount: "", comments: ""
    }
  )

  const [vehicle, setVehicle] = useState(
    {
      assessment_id: "", purchase_date: "", cost: "", brand: "", model: "", year: ""
    }
  )
  const [land, SetLand] = useState(
    {
      assessment_id: "", addr: "", prop_type: "", date_completion: "",
      construction_cost: "",
    }
  )

  function handlePenDeductChange(evt) {
    const value = evt.target.value;
    setPensionDeduct({
      ...pensionDeduct,
      [evt.target.name]: value
    });
  }


  function handleResidentialChange(evt) {
    const value = evt.target.value;
    setResidentialAddress({
      ...residentialAddress,
      [evt.target.name]: value
    });
    console.log(residentialAddress);
  }

  function handleSelfEmployedChange(evt) {
    const value = evt.target.value;
    setSelfEmployed({
      ...selfEmployed,
      [evt.target.name]: value
    });
  }


  function handleExpenseChange(evt) {
    const value = evt.target.value;
    setExpenses({
      ...expensesData,
      [evt.target.name]: value
    });
  }

  function handleNHISChange(evt) {
    const value = evt.target.value;
    setNhis({
      ...nhisData,
      [evt.target.name]: value
    });
  }

  function handleLifeInsChange(evt) {
    const value = evt.target.value;
    setLifeInsData({
      ...lifeInsData,
      [evt.target.name]: value
    });
  }

  function handlePartnershipChange(evt) {
    const value = evt.target.value;
    setPartnerData({
      ...partnerData,
      [evt.target.name]: value
    });
  }

  function handleRentIncomeChange(evt) {
    const value = evt.target.value;
    setRentIncome({
      ...rentIncome,
      [evt.target.name]: value
    });

  }

  function handleBankInterestChange(evt) {
    const value = evt.target.value;
    setBankInterest({
      ...bankInterest,
      [evt.target.name]: value
    });

  }

  function handleDividendsChange(evt) {
    const value = evt.target.value;
    setDividends({
      ...dividends,
      [evt.target.name]: value
    });
  }

  function handlePensionChange(evt) {
    const value = evt.target.value;
    setPension({
      ...pension,
      [evt.target.name]: value
    });
  }

  function handleAssetChange(evt) {
    const value = evt.target.value;
    setAsset({
      ...asset,
      [evt.target.name]: value
    });
  }

  function handleOutsideSourceChange(evt) {
    const value = evt.target.value;
    SetOutsideSource({
      ...outsideSource,
      [evt.target.name]: value
    });
  }

  function handleVehicleChange(evt) {
    const value = evt.target.value;
    setVehicle({
      ...vehicle,
      [evt.target.name]: value
    });
    console.log(vehicle);
  }

  function handleLandChange(evt) {
    const value = evt.target.value;
    SetLand({
      ...land,
      [evt.target.name]: value
    });
  }

  function handlefarmChange(evt) {
    const value = evt.target.value;
    setFarmland({
      ...farmland,
      [evt.target.name]: value
    });
  }



  setAuthToken();
  let submitDataEmployed = async (e) => {
    e.preventDefault()
    setIsFetching3(true)
    const formData = new FormData();
    formData.append('assessment_id', assessment_id);
    formData.append('emp_name', empName);
    formData.append('emp_addr', empAdd);
    formData.append('start_date', startDate);
    formData.append('gross_pay', grossPay);
    formData.append('tax_deducted', taxDeduct);
    formData.append('pay_slip', paySLip);
    try {
      let res = await axios.post(`${url.BASE_URL}forma/employed`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      toast.success("Saved Successfully!");
      setIsFetching3(false)
    } catch (error) {
      setIsFetching3(false)
      toast.error("error, Please try again!");
    }

  }

  setAuthToken();
  let submitDataPenDeduct = async (e) => {
    e.preventDefault()
    setIsFetching4(true)
    let pendedObj = {
      assessment_id: `${assessment_id}`,
      pfa: `${pensionDeduct.pfa}`,
      pfa_addr: `${pensionDeduct.pfa_addr}`,
      rsa_no: `${pensionDeduct.rsa_no}`,
      amount: `${pensionDeduct.amount}`,
      comments: `${pensionDeduct.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/pension-ded`, pendedObj);
      setIsFetching4(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      setIsFetching4(false)
    }

  }


  setAuthToken();
  let submitDataResAdd = async (e) => {
    e.preventDefault()
    setIsFetching6(true)
    let resAddObj = {
      assessment_id: `${assessment_id}`,
      house_no: `${residentialAddress.house_no}`,
      street: `${residentialAddress.street}`,
      town: `${residentialAddress.town}`,
      lga: `${residentialAddress.lga}`,
      residence_type: `${residentialAddress.residence_type}`,
      residence_owner: `${residentialAddress.residence_owner}`,
      annual_rent: `${residentialAddress.annual_rent}`,
      owner_name: `${residentialAddress.owner_name}`,
      owner_phone: `${residentialAddress.owner_phone}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/residence-addr`, resAddObj);
      setIsFetching6(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      setIsFetching6(false)
    }

  }

  setAuthToken();
  let submitDataselfEmp = async (e) => {
    e.preventDefault()
    setIsFetching7(true)
    let selfEmpObj = {
      assessment_id: `${assessment_id}`,
      business_type: `${selfEmployed.business_type}`,
      business_name: `${selfEmployed.business_name}`,
      business_addr: `${selfEmployed.business_addr}`,
      business_start_date: `${selfEmployed.business_start_date}`,
      income_earned: `${selfEmployed.income_earned}`,
      other_income: `${selfEmployed.other_income}`,
      cash_inc_expense: `${selfEmployed.cash_inc_expense}`,
      expense: `${selfEmployed.expense}`,
      figures_estimated: `${selfEmployed.figures_estimated}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/self-employed`, selfEmpObj);
      setIsFetching7(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      console.log(error);
      toast.error("error, Please try again!");
      setIsFetching7(false)
    }

  }


  setAuthToken();
  let submitDataNhis = async (e) => {
    e.preventDefault()
    setIsFetching8(true)
    let nhisDataObj = {
      assessment_id: `${assessment_id}`,
      company: `${nhisData.company}`,
      addr: `${nhisData.addr}`,
      insurance_no: `${nhisData.insurance_no}`,
      amount: `${nhisData.amount}`,
      comments: `${nhisData.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/nhis`, nhisDataObj);
      setIsFetching8(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching8(false)
    }

  }

  setAuthToken();
  let submitDataLifIns = async (e) => {
    e.preventDefault()
    setIsFetching9(true)
    let lifeInsDataObj = {
      assessment_id: `${assessment_id}`,
      company: `${lifeInsData.company}`,
      addr: `${lifeInsData.addr}`,
      rsa_no: `${lifeInsData.rsa_no}`,
      amount: `${lifeInsData.amount}`,
      comments: `${lifeInsData.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/lap`, lifeInsDataObj);
      setIsFetching9(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      setIsFetching9(false)
    }

  }

  setAuthToken();
  let submitDataExpense = async (e) => {
    e.preventDefault()
    setIsFetching10(true)
    let expenseDataObj = {
      assessment_id: `${assessment_id}`,
      item: `${expensesData.item}`,
      amount: `${expensesData.amount}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/expenses`, expenseDataObj);
      setIsFetching10(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching10(false)
    }
  }

  setAuthToken();
  let submitDataPartner = async (e) => {
    e.preventDefault()
    setIsFetching13(true)
    let partnerDataObj = {
      assessment_id: `${assessment_id}`,
      name: `${partnerData.name}`,
      addr: `${partnerData.addr}`,
      phone: `${partnerData.phone}`,
      percentage: `${partnerData.percentage}`,
      comments: `${partnerData.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/partner`, partnerDataObj);
      setIsFetching13(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching13(false)
    }
  }

  setAuthToken();
  let submitDataRentInc = async (e) => {
    e.preventDefault()
    setIsFetching14(true)
    let rentIncomeDataObj = {
      assessment_id: `${assessment_id}`,
      prop_type: `${rentIncome.prop_type}`,
      prop_address: `${rentIncome.prop_address}`,
      rental_type: `${rentIncome.rental_type}`,
      rental_amount: `${rentIncome.rental_amount}`,
      renter_name: `${rentIncome.renter_name}`,
      renter_phone: `${rentIncome.renter_phone}`,
      comments: `${rentIncome.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/rent-income`, rentIncomeDataObj);
      setIsFetching14(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching14(false)
    }
  }

  setAuthToken();
  let submitDataBankInt = async (e) => {
    e.preventDefault()
    setIsFetching16(true)
    let bankInterestDataObj = {
      assessment_id: `${assessment_id}`,
      name: `${bankInterest.name}`,
      account: `${bankInterest.account}`,
      bvn: `${bankInterest.bvn}`,
      gross_amount: `${bankInterest.gross_amount}`,
      comments: `${bankInterest.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/bank-interest`, bankInterestDataObj);
      setIsFetching16(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching16(false)
    }
  }

  setAuthToken();
  let submitDataDividends = async (e) => {
    e.preventDefault()
    setIsFetching17(true)
    let dividendsDataObj = {
      assessment_id: `${assessment_id}`,
      name: `${dividends.name}`,
      addr: `${dividends.addr}`,
      amount: `${dividends.amount}`,
      comments: `${dividends.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/dividends`, dividendsDataObj);
      setIsFetching17(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching17(false)
    }
  }

  setAuthToken();
  let submitDataPension = async (e) => {
    e.preventDefault()
    setIsFetching18(true)
    let pensionDataObj = {
      assessment_id: `${assessment_id}`,
      pfa: `${pension.pfa}`,
      pfa_addr: `${pension.pfa_addr}`,
      gross_amount: `${pension.gross_amount}`,
      comments: `${pension.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/pension`, pensionDataObj);
      setIsFetching18(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching18(false)
    }
  }

  setAuthToken();
  let submitDataAsset = async (e) => {
    e.preventDefault()
    setIsFetching19(true)
    let assetDataObj = {
      assessment_id: `${assessment_id}`,
      asset_type: `${asset.asset_type}`,
      asset_addr: `${asset.asset_addr}`,
      buyer_name: `${asset.buyer_name}`,
      buyer_addr: `${asset.buyer_addr}`,
      buyer_phone: `${asset.buyer_phone}`,
      amount: `${asset.amount}`,
      comments: `${asset.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/assets`, assetDataObj);
      setIsFetching19(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching19(false)
    }
  }

  setAuthToken();
  let submitDataOutsideSource = async (e) => {
    e.preventDefault()
    setIsFetching20(true)
    let outsideSourceDataObj = {
      assessment_id: `${assessment_id}`,
      source: `${outsideSource.source}`,
      gross_amount: `${outsideSource.gross_amount}`,
      comments: `${outsideSource.comments}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/outside-source`, outsideSourceDataObj);
      setIsFetching20(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching20(false)
    }
  }

  let vehYear = dateformat(vehicle.year, "yyyy")
  setAuthToken();
  let submitDataVehicle = async (e) => {
    e.preventDefault()
    setIsFetching21(true)
    let vehicleDataObj = {
      assessment_id: `${assessment_id}`,
      purchase_date: `${vehicle.purchase_date}`,
      cost: `${vehicle.cost}`,
      brand: `${vehicle.brand}`,
      model: `${vehicle.model}`,
      year: `${vehYear}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/vechicles`, vehicleDataObj);
      setIsFetching21(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching21(false)
    }
  }

  setAuthToken();
  let submitDataLand = async (e) => {
    e.preventDefault()
    setIsFetching22(true)
    let landDataObj = {
      assessment_id: `${assessment_id}`,
      addr: `${land.addr}`,
      prop_type: `${land.prop_type}`,
      date_completion: `${land.date_completion}`,
      construction_cost: `${land.construction_cost}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/land`, landDataObj);
      setIsFetching22(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching22(false)
    }
  }

  setAuthToken();
  let submitDataFarm = async (e) => {
    e.preventDefault()
    setIsFetching23(true)
    let farmDataObj = {
      assessment_id: `${assessment_id}`,
      addr: `${farmland.addr}`,
      acq_date: `${farmland.acq_date}`,
      land_cost: `${farmland.land_cost}`,
      produce_cost: `${farmland.produce_cost}`,
    }
    try {
      let res = await axios.post(`${url.BASE_URL}forma/farm`, farmDataObj);
      setIsFetching23(false)
      toast.success("Saved Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching23(false)
    }
  }

  let formSubmitNhisCal = Number(nhisData.amount)
  let formSubmitLapCal = Number(lifeInsData.amount)
  let formSubmitPensCal = Number(pensionDeduct.amount)
  let formSubmitGrossPayCal = Number(grossPay)
  let formSubmitNetProfitCal = Number(netProfit)

  setAuthToken();
  let submitAssessmentForm = async (e) => {
    e.preventDefault()
    setIsFetching15(true)
    let assessFormObj = {
      assessment_id: `${assessment_id}`,
      employed: `${formSubmitGrossPayCal}`,
      selfEmployed: `${formSubmitNetProfitCal}`,
      nhis: `${formSubmitNhisCal}`,
      lap: `${formSubmitLapCal}`,
      pension: `${formSubmitPensCal}`,
      year: assessmentYear,
      kgtin: kgtinVal
    }
    try {
      let res = await axios.put(`${url.BASE_URL}forma/tax-cal`, assessFormObj);
      console.log(res);
      setIsFetching15(false)
      router.push('/view/completeddirect')
      toast.success("Submitted Successfully!");
    } catch (error) {
      toast.error("error, Please try again!");
      console.log(error);
      setIsFetching15(false)
    }

  }

  const onChange = e => {
    let toggleval = ''
    setToggle(toggleval)
  };

  const onChange2 = e => {
    // e.preventDefault()
    let toggleval = 'hidden'
    setToggle(toggleval)
  };

  const onChange3 = e => {
    let toggleval = ''
    setToggle2(toggleval)

  };
  const onChange4 = e => {
    // e.preventDefault()
    let toggleval = 'hidden'
    setToggle2(toggleval)

  };
  const onChange5 = e => {
    let toggleval = ''
    setToggle3(toggleval)
  };

  const onChange6 = e => {
    let toggleval = 'hidden'
    setToggle3(toggleval)
  };
  const onChange7 = e => {
    let toggleval = ''
    setToggle4(toggleval)

  };
  const onChange8 = e => {
    let toggleval = 'hidden'
    setToggle4(toggleval)

  };
  const onChange9 = e => {
    let toggleval = ''
    setToggle5(toggleval)
  };

  const onChange10 = e => {
    let toggleval = 'hidden'
    setToggle5(toggleval)
  };
  const onChange11 = e => {
    let toggleval = ''
    setToggle6(toggleval)

  };
  const onChange12 = e => {
    let toggleval = 'hidden'
    setToggle6(toggleval)

  };
  const onChange13 = e => {
    let toggleval = ''
    setToggle7(toggleval)
  };

  const onChange14 = e => {
    let toggleval = 'hidden'
    setToggle7(toggleval)
  };
  const onChange15 = e => {
    let toggleval = ''
    setToggle8(toggleval)

  };
  const onChange16 = e => {
    let toggleval = 'hidden'
    setToggle8(toggleval)

  };
  const onChange17 = e => {
    let toggleval = ''
    setToggle9(toggleval)
  };

  const onChange18 = e => {
    let toggleval = 'hidden'
    setToggle9(toggleval)
  };
  const onChange19 = e => {
    let toggleval = ''
    setToggle10(toggleval)

  };
  const onChange20 = e => {
    let toggleval = 'hidden'
    setToggle10(toggleval)

  };
  const onChange21 = e => {
    let toggleval = ''
    setToggle11(toggleval)
  };

  const onChange22 = e => {
    let toggleval = 'hidden'
    setToggle11(toggleval)
  };
  const onChange23 = e => {
    let toggleval = ''
    setToggle12(toggleval)

  };
  const onChange24 = e => {
    let toggleval = 'hidden'
    setToggle12(toggleval)

  };
  const onChange25 = e => {
    let toggleval = ''
    setToggle13(toggleval)

  };
  const onChange26 = e => {
    let toggleval = 'hidden'
    setToggle13(toggleval)

  };
  const onChange27 = e => {
    let toggleval = ''
    setToggle14(toggleval)

  };
  const onChange28 = e => {
    let toggleval = 'hidden'
    setToggle14(toggleval)

  };
  const onChange29 = e => {
    let toggleval = ''
    setToggle15(toggleval)

  };
  const onChange30 = e => {
    let toggleval = 'hidden'
    setToggle15(toggleval)

  };

  const onresidenceToggleYes = e => {
    let toggleval = 'hidden'
    setresToggle(toggleval)
  };

  const onresidenceToggleNo = e => {
    let toggleval = ''
    setresToggle(toggleval)

  };

  const MarriedYes = e => {
    let toggleval = ''
    setmarriedToggle(toggleval)

  };
  const MarriedNo = e => {
    let toggleval = 'hidden'
    setmarriedToggle(toggleval)

  };
  const childrenYes = e => {
    let toggleval = ''
    setchildrenToggle(toggleval)

  };
  const childrenNo = e => {
    let toggleval = 'hidden'
    setchildrenToggle(toggleval)

  };
  const servantsYes = e => {
    let toggleval = ''
    setservantsToggle(toggleval)

  };
  const servantsNo = e => {
    let toggleval = 'hidden'
    setservantsToggle(toggleval)

  };


  const formTog1 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle(toggleval)

  };
  const formTog2 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle2(toggleval)

  };
  const formTog3 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle3(toggleval)

  };
  const formTog4 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle4(toggleval)

  };
  const formTog5 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle5(toggleval)

  };
  const formTog6 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle6(toggleval)

  };
  const formTog7 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle7(toggleval)

  };
  const formTog8 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle8(toggleval)

  };
  const formTog9 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle9(toggleval)

  };
  const formTog10 = e => {
    e.preventDefault()
    let toggleva = 'hidden'
    setToggle10(toggleva)

  };
  const formTog11 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle11(toggleval)

  };
  const formTog12 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle12(toggleval)

  };
  const formTog13 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle13(toggleval)

  };

  const formTog14 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle14(toggleval)

  };
  const formTog15 = e => {
    e.preventDefault()
    let toggleval = 'hidden'
    setToggle15(toggleval)

  };

  return (
    <>
      <ToastContainer />
      <div className="block p-6 rounded-lg bg-white w-full">
        <div className="flex">
          <h6 className="p-2">Taxpayer Information
            <small className="text-blue-600">
              <Link legacyBehavior href={`/update-individual/${kgtinVal}`}>Edit</Link>
            </small>
          </h6>
        </div>
        <p className="mb-3 font-bold"></p>
        <form>
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <p>Name</p>

              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.tp_name} disabled />

            </div>

            <div className="form-group mb-6">
              <p>KGTIN</p>

              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.KGTIN} disabled />

            </div>

            <div className="form-group mb-6">
              <p>Email</p>
              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.email} disabled />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group mb-6">
              <p>Phone</p>
              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.phone_number} disabled />
            </div>

            <div className="form-group mb-6">
              <p>Tax Office</p>
              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.tax_office} disabled />
            </div>
            <div className="form-group mb-6">
              <p>Taxpayer Type</p>
              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.tp_type} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="form-group mb-6">
              <p>Address</p>
              <input type="text" className="form-control w-full rounded font-light text-gray-500"
                value={indvData.address} disabled />
            </div>
          </div>
        </form>
      </div>

      <div className="block p-6 rounded-lg bg-white w-full">
        <div className="flex">
          <h6 className="p-2">Current Residential address</h6>
        </div>
        {isFetching6 && (
          <div className="flex justify-center item mb-2">
            <Loader
              visible={isFetching6}
              type="BallTriangle"
              color="#00FA9A"
              height={19}
              width={19}
              timeout={0}
              className="ml-2"
            />
            <p className="font-bold">Saving...</p>
          </div>
        )}
        <form onSubmit={submitDataResAdd}>
          <div className="grid grid-cols-3 gap-4">
            <div className="mb-6">
              <p>House No</p>
              <input onChange={handleResidentialChange} type="text" className="form-control w-full rounded font-light text-gray-500"
                name="house_no" value={residentialAddress.house_no} />
            </div>

            <div className="form-group mb-6">
              <p>Street</p>
              <input onChange={handleResidentialChange} type="text" className="form-control w-full rounded font-light text-gray-500"
                name="street" value={residentialAddress.street} />
            </div>
            <div className="form-group mb-6">
              <p>LGA</p>
              <input onChange={handleResidentialChange} type="text" className="form-control w-full rounded font-light text-gray-500"
                name="lga" value={residentialAddress.lga} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group mb-6">
              <p>Town</p>
              <input onChange={handleResidentialChange} type="text" className="form-control w-full rounded font-light text-gray-500"
                name="town" value={residentialAddress.town} />

            </div>

            <div className="form-check form-check-inline">
              <p>Type of Residence</p>
              <select onChange={handleResidentialChange} className="form-select w-full" name="residence_type" value={residentialAddress.residence_type}>
                <option value="select">Select</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Mansion">Mansion</option>
                <option value="Apartment or Flat">Apartment or Flat</option>
                <option value="Terraced house">Terraced house</option>
                <option value="Duplex">Duplex</option>
                <option value="Traditional house">Traditional house</option>
              </select>
            </div>

            <div className="form-check form-check-inline ml-5 self-center">
              <p>Do you own your place of residence?</p>
              <div className="flex">
                <div className="form-check form-check-inline">
                  <input onClick={onresidenceToggleYes} onChange={handleResidentialChange} name="residence_owner" value="Owner" checked={residentialAddress.residence_owner === "Owner"} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" id="inlineRadio1" />
                  <label className="form-check-label inline-block text-gray-800" htmlFor="inlineRadio10">Owner</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onClick={onresidenceToggleNo} onChange={handleResidentialChange} name="residence_owner" value="Rented" checked={residentialAddress.residence_owner === "Rented"} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" id="inlineRadio2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">Rented</label>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-4 ${resiToggle}`}>
            <div className="form-group mb-6">
              <input onChange={handleResidentialChange} type="text" name="annual_rent" value={residentialAddress.annual_rent} className="form-control w-full rounded"
                placeholder="Annual rent" />
            </div>

            <div className="form-group mb-6">
              <input onChange={handleResidentialChange} type="text" name="owner_name" value={residentialAddress.owner_name} className="form-control w-full rounded"
                placeholder="Name of owner" />
            </div>
            <div className="form-group mb-6">
              <input onChange={handleResidentialChange} type="text" name="owner_phone" value={residentialAddress.owner_phone} className="form-control w-full rounded"
                placeholder="Phone number" />
            </div>
          </div>
          <div>
            <button
              style={{ backgroundColor: "#84abeb" }}
              className="btn w-64 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="block p-6 rounded-lg bg-white w-full">

        <div className="grid grid-cols-3 gap-4">
          <div className="form-group mb-6">
            <p>Are you Married ?</p>
          </div>
          <div className="flex">
            <div className="form-check form-check-inline">
              <input onClick={MarriedYes} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
              <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
            </div>

            <div className="form-check form-check-inline ml-5">
              <input onClick={MarriedNo} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
              <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
            </div>
          </div>
        </div>

        <div className={`${marriedToggle}`}>
          {isFetching5 && (
            <div className="flex justify-center item mb-2">
              <Loader
                visible={isFetching5}
                type="BallTriangle"
                color="#00FA9A"
                height={19}
                width={19}
                timeout={0}
                className="ml-2"
              />
              <p className="font-bold">Saving...</p>
            </div>
          )}

          <form className="border p-3" onSubmit={handleSpouseSubmit}>
            {spouse.map((element, index) => (
              <div className="grid border-b-2 m-3 p-3 grid-cols-3 gap-4" key={index}>
                <div className="form-group mb-6">
                  <p>Name of spouse</p>
                  <input required name="name" value={element.name || ""} onChange={e => handleSpouseChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Name of spouse" />
                </div>

                <div className="form-group mb-6">
                  <p>Date of Birth</p>
                  <input required name="dob" value={element.dob || ""} onChange={e => handleSpouseChange(index, e)} type="date" className="form-control w-full rounded"
                    placeholder="Date of birth" />
                </div>
                <div className="form-group mb-6">
                  <p>Occupation</p>
                  <input name="occupation" value={element.occupation || ""} onChange={e => handleSpouseChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Occupation" />
                </div>
                <div className="form-group mb-6">
                  <p>Business/Employer</p>
                  <input name="employer" value={element.employer || ""} onChange={e => handleSpouseChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Employer/Business of spouse" />
                </div>
                <div className="form-group mb-6">
                  <p>Office/Business Address</p>
                  <input name="employer_addr" value={element.employer_addr || ""} onChange={e => handleSpouseChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Employer's/business address of spouse" />
                </div>
                {
                  index ?
                    <div className="form-group place-self-center">
                      <button onClick={removeSpouseFields}

                        className="btn btn-default bg-red-600 text-white btn-outlined bg-transparent rounded-md"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                    : null
                }

              </div>
            ))}
            <div className="flex justify-between p-3">
              <button onClick={addSpouseFields}
                style={{ backgroundColor: "#84abeb" }}
                className="btn w-64 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
                type="button"
              >
                Add Spouse
              </button>
              <button
                // style={{ backgroundColor: "#84abeb" }}
                className="btn w-64 bg-green-600 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
                type="submit"
              >
                Save
              </button>

            </div>

          </form>
        </div>
      </div>

      <div className="block p-6 rounded-lg bg-white w-full">

        <div className="grid grid-cols-3 gap-4">
          <div className="form-group mb-6">
            <p>Do you have children ?</p>
          </div>
          <div className="flex">
            <div className="form-check form-check-inline">
              <input onClick={childrenYes} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
              <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
            </div>

            <div className="form-check form-check-inline ml-5">
              <input onClick={childrenNo} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
              <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
            </div>
          </div>
        </div>
        {isFetching11 && (
          <div className="flex justify-center item mb-2">
            <Loader
              visible={isFetching11}
              type="BallTriangle"
              color="#00FA9A"
              height={19}
              width={19}
              timeout={0}
              className="ml-2"
            />
            <p className="font-bold">Saving...</p>
          </div>
        )}
        <div className={`${childrenToggle} border`}>

          <form onSubmit={handleChildSubmit} >
            {children.map((element, index) => (
              <div key={index} className={`grid m-3 p-3 border-b-2 grid-cols-3 gap-4`}>
                <div className="form-group mb-6">
                  <p>Name of Child</p>
                  <input name="name" value={element.name || ""} onChange={e => handleChildrenChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Name of child in full" />
                </div>
                <div className="form-group mb-6">
                  <p>Date of Birth</p>
                  <input required name="dob" value={element.dob || ""} onChange={e => handleChildrenChange(index, e)} type="date" className="form-control w-full rounded"
                    placeholder="Date of birth" />
                </div>
                <div className="form-group mb-6">
                  Child School Name
                  <input name="school_name" value={element.school_name || ""} onChange={e => handleChildrenChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Name of child's school" />
                </div>
                <div className="form-group ">
                  School Address
                  <input name="school_addr" value={element.school_addr || ""} onChange={e => handleChildrenChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Address of child's school" />
                </div>
                <div className="form-group">
                  <p>School Fees</p>
                  <input name="school_fees" value={element.school_fees || ""} onChange={e => handleChildrenChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Child's school fees per session" />
                </div>
                <div className="form-group">
                  <p>Child's Income</p>
                  <input name="child_income" value={element.child_income || ""} onChange={e => handleChildrenChange(index, e)} type="text" className="form-control w-full rounded"
                    placeholder="Child's income in own right" />
                </div>
                <div></div>
                <div className="justify-self-center">
                  {
                    index ? <button onClick={removeChildFields}
                      // style={{ backgroundColor: "#84abeb" }}
                      className="btn bg-red-600 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="button"
                    >
                      Remove
                    </button> : null
                  }

                </div>
                <div></div>
              </div>
            ))}
            <div className="flex justify-between p-3">
              <button onClick={addChildFields}
                style={{ backgroundColor: "#84abeb" }}
                className="btn w-64 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
                type="button"
              >
                Add Child
              </button>
              <button
                // style={{ backgroundColor: "#84abeb" }}
                className="btn w-64 bg-green-600 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
                type="submit"
              >
                Save
              </button>

            </div>
          </form>
        </div>
      </div>

      <div className="block p-6 rounded-lg bg-white w-full">

        <div className="grid grid-cols-3 gap-4">
          <div className="form-group mb-6">
            <p>Do you have domestic Staff ?</p>
          </div>
          <div className="flex">
            <div className="form-check form-check-inline">
              <input onClick={servantsYes} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
              <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
            </div>

            <div className="form-check form-check-inline ml-5">
              <input onClick={servantsNo} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
              <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
            </div>
          </div>

        </div>

        {isFetching12 && (
          <div className="flex justify-center item mb-2">
            <Loader
              visible={isFetching12}
              type="BallTriangle"
              color="#00FA9A"
              height={19}
              width={19}
              timeout={0}
              className="ml-2"
            />
            <p className="font-bold">Saving...</p>
          </div>
        )}
        <form onSubmit={handleStaffSubmit} className={`${servantsToggle} border`}>
          {domesticStaff.map((element, index) => (
            <div className={`grid grid-cols-3 m-3 p-3 border-b-2 gap-4`}>
              <div className="form-group mb-6">
                <p>Title</p>
                <select value={element.title || ""} onChange={e => handleDomesticStaffChange(index, e)} name="title" className="form-select w-full" >
                  <option value="Mrs">Mrs</option>
                  <option value="Mr">Mr</option>
                  <option value="Miss">Miss</option>
                </select>
              </div>

              <div className="form-group mb-6">
                <p>Name</p>
                <input name="name" onChange={e => handleDomesticStaffChange(index, e)} value={element.name || ""} type="text" className="form-control w-full rounded"
                  placeholder="Full name" />
              </div>

              <div className="form-group mb-6">
                <p>House Number</p>
                <input name="house_no" onChange={e => handleDomesticStaffChange(index, e)} value={element.house_no || ""} type="text" className="form-control w-full rounded"
                  placeholder="House/plot no" />
              </div>
              <div className="form-group mb-6">
                <p>Street</p>
                <input onChange={e => handleDomesticStaffChange(index, e)} name="street" value={element.street || ""} type="text" className="form-control w-full rounded"
                  placeholder="Street" />
              </div>
              <div className="form-group mb-6">
                <p>Town</p>
                <input onChange={e => handleDomesticStaffChange(index, e)} type="text" name="town" value={element.town || ""} className="form-control w-full rounded"
                  placeholder="Town/Area" />
              </div>
              <div className="form-group mb-6">
                <p>LGA</p>
                <input onChange={e => handleDomesticStaffChange(index, e)} type="text" name="lga" value={element.lga || ""} className="form-control w-full rounded"
                  placeholder="LGA" />
              </div>
              <div className="form-group mb-6">
                <p>State</p>
                <select onChange={e => handleDomesticStaffChange(index, e)} value={element.state || ""} className="form-select w-full" name="state">
                  <option value="ABUJA FCT">ABUJA FCT</option>
                  <option value="ABIA">ABIA</option>
                  <option value="ADAMAWA">ADAMAWA</option>
                  <option value="AKWA IBOM">AKWA IBOM</option>
                  <option value="ANAMBRA">ANAMBRA</option>
                  <option value="BAUCHI">BAUCHI</option>
                  <option value="BAYELSA">BAYELSA</option>
                  <option value="BENUE">BENUE</option>
                  <option value="BORNO">BORNO</option>
                  <option value="CROSS RIVER">CROSS RIVER</option>
                  <option value="DELTA">DELTA</option>
                  <option value="EBONYI">EBONYI</option>
                  <option value="EDO">EDO</option>
                  <option value="EKITI">EKITI</option>
                  <option value="ENUGU">ENUGU</option>
                  <option value="GOMBE">GOMBE</option>
                  <option value="IMO">IMO</option>
                  <option value="JIGAWA">JIGAWA</option>
                  <option value="KADUNA">KADUNA</option>
                  <option value="KANO">KANO</option>
                  <option value="KATSINA">KATSINA</option>
                  <option value="KEBBI">KEBBI</option>
                  <option value="KOGI">KOGI</option>
                  <option value="KWARA">KWARA</option>
                  <option value="LAGOS">LAGOS</option>
                  <option value="NASSARAWA">NASSARAWA</option>
                  <option value="NIGER">NIGER</option>
                  <option value="OGUN">OGUN</option>
                  <option value="ONDO" >ONDO</option>
                  <option value="OSUN">OSUN</option>
                  <option value="OYO">OYO</option>
                  <option value="PLATEAU">PLATEAU</option>
                  <option value="RIVERS">RIVERS</option>
                  <option value="SOKOTO">SOKOTO</option>
                  <option value="TARABA">TARABA</option>
                  <option value="YOBE">YOBE</option>
                  <option value="ZAMFARA">ZAMFARA</option>
                </select>
              </div>
              <div className="form-group mb-6">
                <p>Annual Pay</p>
                <input required onChange={e => handleDomesticStaffChange(index, e)} name="amount_paid" type="text" className="form-control w-full rounded"
                  placeholder="Amount paid (Annual)" />
              </div>

              <div className="form-group mb-6">
                <p>Payer</p>
                <select onChange={e => handleDomesticStaffChange(index, e)} value={element.payer || ""} name="payer" className="form-select w-full" >
                  <option>Paid by Employer</option>
                  <option>Paid by self</option>
                </select>
              </div>

              <div></div>
              <div className="justify-self-center">
                {
                  index ? <button onClick={removeStaffFields}
                    // style={{ backgroundColor: "#84abeb" }}
                    className="btn bg-red-600 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="button"
                  >
                    Remove
                  </button> : null
                }

              </div>
              <div></div>
            </div>
          ))}
          <div className="flex justify-between p-3">
            <button onClick={addStaffFields}
              style={{ backgroundColor: "#84abeb" }}
              className="btn w-64 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
              type="button"
            >
              Add Staff
            </button>
            <button
              // style={{ backgroundColor: "#84abeb" }}
              className="btn w-64 bg-green-600 mb-4 btn-default text-white btn-outlined bg-transparent rounded-md"
              type="submit"
            >
              Save
            </button>

          </div>
        </form>


      </div>



      <h6 className="p-2">Income details</h6>

      <Widget>
        <div className="p-10" >

          <div >
            <div className="flex justify-between mb-5 ">
              <p>Are you employed ? </p>
              <div className="flex">
                <div className="form-check form-check-inline">
                  <input onClick={onChange} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onClick={onChange2} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>
              </div>
            </div>

            <div className={`flex justify-center border mb-3 p-6 rounded-lg bg-white w-full ${toggleel}`}>
              <form onSubmit={submitDataEmployed}>
                <div>
                  {isFetching3 && (
                    <div className="flex justify-center item mb-2">
                      <Loader
                        visible={isFetching3}
                        type="BallTriangle"
                        color="#00FA9A"
                        height={19}
                        width={19}
                        timeout={0}
                        className="ml-2"
                      />
                      <p className="font-bold">Saving...</p>
                    </div>
                  )}

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Employer Name:</label>
                    <input required onChange={(e) => setEmpName(e.target.value)} type="text" name="emp_name" className="form-control w-full rounded" />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Employer Address:</label>
                    <input required onChange={(e) => setEmpAdd(e.target.value)} type="text" name="emp_addr" className="form-control w-full rounded" />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Your start date:</label>
                    <input onChange={(e) => setStartDate(e.target.value)} type="date" name="start_date" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Gross pay:</label>
                    <input required placeholder="₦" onChange={(e) => setGrossPay(e.target.value)} type="text" name="gross_pay" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Tax deducted:</label>
                    <input onChange={(e) => setTaxDeduct(e.target.value)} placeholder="₦" type="text" name="tax_deducted" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Upload Pay slip or schedule:</label>
                    <input onChange={(e) => setPaySlip(e.target.files[0])} type="file" name="pay_slip" className="w-full"
                    />
                  </div>
                  <div className='pb-5'>
                    <hr />
                  </div>
                </div>

                <div className="mb-6 flex justify-around">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                  >
                    Save
                  </button>
                  <button onClick={formTog1} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </form>


            </div>

            <div>

              <div className="flex justify-between mb-5">
                <p>Are you self employed ? </p>

                <div className="flex">

                  <div className="form-check form-check-inline">
                    <input onClick={onChange3} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions2" id="inlineRadio1" value="option1" />
                    <label required className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                  </div>

                  <div className="form-check form-check-inline ml-5">
                    <input required onClick={onChange4} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="option2" />
                    <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex justify-center border mb-3 p-6 rounded-lg bg-white w-fulll ${togglee2}`}>
              <div>
                <form onSubmit={submitDataselfEmp}>
                  {isFetching7 && (
                    <div className="flex justify-center item mb-2">
                      <Loader
                        visible={isFetching7}
                        type="BallTriangle"
                        color="#00FA9A"
                        height={19}
                        width={19}
                        timeout={0}
                        className="ml-2"
                      />
                      <p className="font-bold">saving...</p>
                    </div>
                  )}
                  <div>
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="typeofbusiness">Type of business:</label>
                      <select onChange={handleSelfEmployedChange} className="form-select" name="business_type" value={selfEmployed.business_type} >
                        <option value="">select...</option>
                        {busTypes.map((item) => <option key={item.id} value={item.business_type}>{item.business_type}</option>)}
                      </select>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="businessname">Business Name:</label>
                      <input onChange={handleSelfEmployedChange} name="business_name" value={selfEmployed.business_name} type="text" id="businessname" className="form-control w-full rounded"
                      />
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="businessaddress">Business Address:</label>
                      <input onChange={handleSelfEmployedChange} name="business_addr" value={selfEmployed.business_addr} type="text" id="businessaddress" className="form-control w-full rounded"
                      />
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="employername">Business Start date:</label>
                      <input required onChange={handleSelfEmployedChange} name="business_start_date" value={selfEmployed.business_start_date} type="date" className="form-control w-full rounded"
                      />
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="turnover">Turnover-takings, fees, sales or money earned by your business:</label>
                      <input required onChange={handleSelfEmployedChange} placeholder="₦" name="income_earned" value={selfEmployed.income_earned} type="text" className="form-control w-full rounded"
                      />
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="turnover">Any other business income not included above:</label>
                      <input placeholder="₦" onChange={handleSelfEmployedChange} name="other_income" value={selfEmployed.other_income} type="text" className="form-control w-full rounded"
                      />
                    </div>

                    {/* <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="cashbases">Do you use cash basis, money actually received and paid out, to calculate your income expense ?</label>
                      <div className="flex">
                        <div className="form-check form-check-inline">
                          <select name="cash_inc_expense" onChange={handleSelfEmployedChange} value={selfEmployed.cash_inc_expense} id="" className="w-64">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>
                    </div> */}

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label className="font-bold">Total Business Income:</label>
                      <p className="font-bold">NGN {formatNumber(totalBusInc)}</p>
                    </div>

                    <div>
                      <div className="mb-6 grid grid-cols-3 gap-4">
                        <label>How would you like to record your expenses?</label>
                        <div className="flex">
                          <div className="form-check form-check-inline">
                            <select name="expense" onChange={handleSelfEmployedChange} value={selfEmployed.expense} className="w-64">
                              <option value="break down">Break Down </option>
                              <option value="total">Total</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <label htmlFor="expenses">Are figures provided provisional or estimated?</label>

                      <div className="flex">
                        <div className="form-check form-check-inline">
                          <select name="figures_estimated" onChange={handleSelfEmployedChange} value={selfEmployed.figures_estimated} className="w-64">
                            <option value="estimated">Estimated</option>
                            <option value="provisional">Provisional</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='pb-5'>
                      <hr />
                    </div>
                  </div>

                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>

                    <button onClick={formTog2} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </form>
                {isFetching10 && (
                  <div className="flex justify-center item mb-2">
                    <Loader
                      visible={isFetching10}
                      type="BallTriangle"
                      color="#00FA9A"
                      height={19}
                      width={19}
                      timeout={0}
                      className="ml-2"
                    />
                    <p className="font-bold">Saving...</p>
                  </div>
                )}
                <form onSubmit={submitDataExpense}>
                  <p className="font-bold">Expenses</p>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <input required onChange={handleExpenseChange} name="item" value={expensesData.item} type="text" className="form-control w-full rounded"
                      placeholder="Item"
                    />
                    <input required onChange={handleExpenseChange} name="amount" value={expensesData.amount} type="text" className="form-control w-full rounded"
                      placeholder="Amount"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label className="font-bold">Net Profit/ Loss:</label>
                    <p className="font-bold"> NGN {formatNumber(netProfit)}</p>
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save Expenses
                    </button>

                  </div>
                </form>
              </div>
            </div>


            <div className="flex justify-between mb-5">

              <p>Are you in a partnership ? </p>


              <div className="flex">

                <div className="form-check form-check-inline">
                  <input onChange={onChange5} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions3" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onChange={onChange6} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions3" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>

              </div>
            </div>

            {isFetching13 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching13}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Saving...</p>
              </div>
            )}

            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee3}`}>
              <form onSubmit={submitDataPartner}>
                <div className="">
                  <p className="font-bold flex justify-center mb-4"></p>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label >Partner Name:</label>
                    <input required onChange={handlePartnershipChange} name="name" value={partnerData.name} type="text" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label htmlFor="employername">Partner Address:</label>
                    <input onChange={handlePartnershipChange} name="addr" value={partnerData.addr} type="text" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label htmlFor="employername">Partner Phone:</label>
                    <input onChange={handlePartnershipChange} name="phone" type="text" value={partnerData.phone} className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label htmlFor="employername">Partner Percentage:</label>
                    <input onChange={handlePartnershipChange} name="percentage" value={partnerData.percentage} type="text" className="form-control w-full rounded"
                    />
                  </div>
                  <div className='pb-5'>
                    <hr />
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="comments">Optional Comments:</label>
                  <textarea onChange={handlePartnershipChange} name="comments" value={partnerData.comments} cols="40" rows="2" className="rounded"></textarea>
                </div>
                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog3} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-between mb-5">

              <p>Do you receive income on rent ? </p>

              <div className="flex">

                <div className="form-check form-check-inline">
                  <input onChange={onChange7} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions4" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onChange={onChange8} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions4" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>

              </div>

            </div>


            {isFetching14 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching14}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Saving...</p>
              </div>
            )}
            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee4}`}>

              <form onSubmit={submitDataRentInc}>
                <div className="">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Property Type:</label>
                    <select onChange={handleRentIncomeChange} name="prop_type" value={rentIncome.prop_type}>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Mansion">Mansion</option>
                      <option value="Apartment or Flat">Apartment or Flat</option>
                      <option value="Terraced house">Terraced house</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Traditional house">Traditional house</option>
                    </select>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Property Address:</label>
                    <input onChange={handleRentIncomeChange} type="text" name="prop_address" value={rentIncome.prop_address} className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Rental Type:</label>
                    <select onChange={handleRentIncomeChange} className="form-select" name="rental_type" value={rentIncome.rental_type}>
                      <option value="Lease">Lease</option>
                      <option value="Rent">Rent</option>
                    </select>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Rental Amount(Annual):</label>
                    <input onChange={handleRentIncomeChange} type="text" placeholder="₦" name="rental_amount" value={rentIncome.rental_amount} className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Renter Name:</label>
                    <input onChange={handleRentIncomeChange} type="text" name="renter_name" value={rentIncome.renter_name} className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <labe>Renter Phone number:</labe>
                    <input onChange={handleRentIncomeChange} type="text" name="renter_phone" value={rentIncome.phone_number} className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Optional Comments:</label>
                    <textarea onChange={handleRentIncomeChange} name="comments" value={rentIncome.comments} cols="40" rows="2" className="rounded"></textarea>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>
                    <button onClick={formTog4} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between mb-5">

              <p>Do you receive any bank interest ? </p>


              <div className="flex">

                <div className="form-check form-check-inline">
                  <input onChange={onChange9} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions5" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onChange={onChange10} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions5" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>

              </div>

            </div>
            {isFetching16 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching16}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Submitting...</p>
              </div>
            )}
            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee5}`}>
              <form onSubmit={submitDataBankInt}>
                <div className="">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Bank Name:</label>
                    <input onChange={handleBankInterestChange} name="name" value={bankInterest.name} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Bank Account:</label>
                    <input onChange={handleBankInterestChange} name="account" value={bankInterest.account} type="text" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Bank Verification Number (BVN):</label>
                    <input onChange={handleBankInterestChange} name="bvn" value={bankInterest.bvn} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label >Gross Amount:</label>
                    <input required onChange={handleBankInterestChange} name="gross_amount" placeholder="₦" value={bankInterest.gross_amount} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Optional Comments:</label>
                    <textarea onChange={handleBankInterestChange} name="comments" value={bankInterest.comments} cols="40" rows="2" className="rounded"></textarea>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>
                    <button onClick={formTog5} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between mb-5">

              <p>Do you receive any bank dividends from a Nigerian Company ? </p>

              <div className="flex">

                <div className="form-check form-check-inline">
                  <input onChange={onChange11} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions6" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onChange={onChange12} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions6" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>

              </div>
            </div>

            {isFetching17 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching17}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Submitting...</p>
              </div>
            )}

            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee6}`}>
              <form onSubmit={submitDataDividends}>
                <div className="">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Company Name:</label>
                    <input onChange={handleDividendsChange} name="name" value={dividends.name} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Company address:</label>
                    <input onChange={handleDividendsChange} name="addr" value={dividends.addr} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Gross Amount:</label>
                    <input required onChange={handleDividendsChange} name="amount" value={dividends.amount} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Optional Comments:</label>
                    <textarea onChange={handleDividendsChange} name="comments" value={dividends.comments} id="comments" cols="40" rows="2" className="rounded"></textarea>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>
                    <button onClick={formTog6} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between mb-5">

              <p>Do you receive Pension ? </p>

              <div className="flex">
                <div className="form-check form-check-inline">
                  <input onChange={onChange13} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions7" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onChange={onChange14} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions7" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>
              </div>
            </div>
            {isFetching18 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching18}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Submitting...</p>
              </div>
            )}
            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee7}`}>
              <form onSubmit={submitDataPension}>
                <div className="">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label >PFA:</label>
                    <input onChange={handlePensionChange} name="pfa" value={pension.pfa} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>PFA address:</label>
                    <input onChange={handlePensionChange} name="pfa_addr" value={pension.pfa_addr} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label> Gross Amount:</label>
                    <input required onChange={handlePensionChange} name="gross_amount" placeholder="₦" value={pension.gross_amount} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Optional Comments:</label>
                    <textarea onChange={handlePensionChange} name="comments" value={pension.comments} cols="40" rows="2" className="rounded"></textarea>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>
                    <button onClick={formTog7} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between mb-5">

              <p>Do you make profit on sale of asset ? </p>

              <div className="flex">

                <div className="form-check form-check-inline">
                  <input onChange={onChange15} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions8" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div onChange={onChange16} className="form-check form-check-inline ml-5">
                  <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions8" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>

              </div>
            </div>
            {isFetching19 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching19}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Submitting...</p>
              </div>
            )}
            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee8}`}>

              <form onSubmit={submitDataAsset}>
                <div className="">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label >Asset Type:</label>
                    <select onChange={handleAssetChange} className="form-select" name="asset_type" value={asset.asset_type}>
                      <option value="landed property">Landed Property</option>
                      <option value="house">House</option>
                      <option value="farm land">Farm Land</option>
                    </select>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label >Asset Address:</label>
                    <input onChange={handleAssetChange} name="asset_addr" value={asset.asset_addr} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Buyer:</label>
                    <input onChange={handleAssetChange} name="buyer_name" value={asset.buyer_name} type="text" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Buyer address:</label>
                    <input onChange={handleAssetChange} name="buyer_addr" value={asset.buyer_addr} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Buyer Phone number:</label>
                    <input onChange={handleAssetChange} name="buyer_phone" value={asset.buyer_phone} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Sale amount:</label>
                    <input required onChange={handleAssetChange} name="amount" placeholder="₦" value={asset.amount} type="text" id="employername" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Optional Comments:</label>
                    <textarea onChange={handleAssetChange} name="comments" value={asset.comments} cols="40" rows="2" className="rounded"></textarea>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>
                    <button onClick={formTog8} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between mb-5">

              <p>Do you receive any income from sources outside Nigeria ? </p>

              <div className="flex">

                <div className="form-check form-check-inline flex ustify-evenly">
                  <input onChange={onChange17} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions9" id="inlineRadio1" value="option1" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
                </div>

                <div className="form-check form-check-inline ml-5">
                  <input onChange={onChange18} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions9" id="inlineRadio2" value="option2" />
                  <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
                </div>

              </div>
            </div>

            {isFetching20 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching20}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Submitting...</p>
              </div>
            )}

            <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee9}`}>
              <form onSubmit={submitDataOutsideSource}>
                <div className="">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Source:</label>
                    <input onChange={handleOutsideSourceChange} name="source" value={outsideSource.source} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Gross Amount:</label>
                    <input required onChange={handleOutsideSourceChange} placeholder="₦" name="gross_amount" value={outsideSource.gross_amount} type="text" className="form-control w-full rounded"
                    />
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <label>Optional Comments:</label>
                    <textarea onChange={handleOutsideSourceChange} name="comments" value={outsideSource.comments} cols="40" rows="2" className="rounded"></textarea>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Save
                    </button>
                    <button onClick={formTog9} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                      <a >
                        <FiTriangle
                          size={15}
                          className="stroke-current text-green-500"
                        />
                      </a>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Widget>

      <h6 className="p-2">Deductions</h6>

      <Widget>
        <div className="p-10">

          <div className="flex justify-between mb-5">
            <p>Do you contribute towards pension ? </p>
            <div className="flex">

              <div className="form-check form-check-inline flex ustify-evenly">
                <input onChange={onChange19} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions10" id="inlineRadio1" value="option1" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
              </div>

              <div className="form-check form-check-inline ml-5">
                <input onChange={onChange20} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions10" id="inlineRadio2" value="option2" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
              </div>
            </div>
          </div>

          <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee10}`}>

            <form onSubmit={submitDataPenDeduct}>
              <div className="">
                {isFetching4 && (
                  <div className="flex justify-center item mb-2">
                    <Loader
                      visible={isFetching4}
                      type="BallTriangle"
                      color="#00FA9A"
                      height={19}
                      width={19}
                      timeout={0}
                      className="ml-2"
                    />
                    <p className="font-bold">Saving...</p>
                  </div>
                )}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">PFA:</label>
                  <input onChange={handlePenDeductChange} name="pfa" value={pensionDeduct.pfa} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">PFA Address:</label>
                  <input onChange={handlePenDeductChange} name="pfa_addr" value={pensionDeduct.pfa_addr} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">RSA No:</label>
                  <input onChange={handlePenDeductChange} name="rsa_no" value={pensionDeduct.rsa_no} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Amount:</label>
                  <input required onChange={handlePenDeductChange} placeholder="₦" name="amount" value={pensionDeduct.amount} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="comments">Optional Comments:</label>
                  <textarea onChange={handlePenDeductChange} name="comments" value={pensionDeduct.comments} id="comments" cols="40" rows="2" className="rounded"></textarea>
                </div>
                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog10} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-between mb-5">
            <p>Do you contribute towards Life Asurrance ? </p>
            <div className="flex">

              <div className="form-check form-check-inline flex ustify-evenly">
                <input onChange={onChange21} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions11" id="inlineRadio1" value="option1" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
              </div>

              <div className="form-check form-check-inline ml-5">
                <input onChange={onChange22} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions11" id="inlineRadio2" value="option2" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
              </div>

            </div>
          </div>

          <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee11}`}>
            <form onSubmit={submitDataLifIns}>
              {isFetching9 && (
                <div className="flex justify-center item mb-2">
                  <Loader
                    visible={isFetching9}
                    type="BallTriangle"
                    color="#00FA9A"
                    height={19}
                    width={19}
                    timeout={0}
                    className="ml-2"
                  />
                  <p className="font-bold">Saving...</p>
                </div>
              )}
              <div className="">
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Insurance Company:</label>
                  <input onChange={handleLifeInsChange} name="company" value={lifeInsData.company} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Address:</label>
                  <input onChange={handleLifeInsChange} name="addr" value={lifeInsData.addr} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">RSA No:</label>
                  <input onChange={handleLifeInsChange} name="rsa_no" value={lifeInsData.rsa_no} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Amount:</label>
                  <input required onChange={handleLifeInsChange} placeholder="₦" name="amount" value={lifeInsData.amount} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="comments">Optional Comments:</label>
                  <textarea onChange={handleLifeInsChange} name="comments" value={lifeInsData.comments} cols="40" rows="2" className="rounded"></textarea>
                </div>
                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog11} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>

              </div>
            </form>
          </div>

          <div className="flex justify-between mb-5">
            <p>Do you contribute towards NHIS ? </p>
            <div className="flex">

              <div className="form-check form-check-inline flex ustify-evenly">
                <input onChange={onChange23} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions12" id="inlineRadio1" value="option1" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
              </div>

              <div className="form-check form-check-inline ml-5">
                <input onChange={onChange24} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions12" id="inlineRadio2" value="option2" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
              </div>
            </div>
          </div>

          <div className={`flex justify-center border mb-3 block p-6 rounded-lg bg-white w-full ${togglee12}`}>

            <form onSubmit={submitDataNhis}>
              {isFetching8 && (
                <div className="flex justify-center item mb-2">
                  <Loader
                    visible={isFetching8}
                    type="BallTriangle"
                    color="#00FA9A"
                    height={19}
                    width={19}
                    timeout={0}
                    className="ml-2"
                  />
                  <p className="font-bold">Saving...</p>
                </div>
              )}
              <div className="">
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Company:</label>
                  <input onChange={handleNHISChange} name="company" value={nhisData.company} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Address:</label>
                  <input onChange={handleNHISChange} name="addr" value={nhisData.addr} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Insurance No:</label>
                  <input onChange={handleNHISChange} required name="insurance_no" value={nhisData.insurance_no} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="employername">Amount:</label>
                  <input onChange={handleNHISChange} required name="amount" value={nhisData.amount} type="text" id="employername" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label htmlFor="comments">Optional Comments:</label>
                  <textarea onChange={handleNHISChange} name="comments" value={nhisData.comments} cols="40" rows="2" className="rounded"></textarea>
                </div>
                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog12} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Widget>
      <h6 className="p-2">Other Asset</h6>

      <Widget>
        <div className="p-10">

          <div className="flex justify-between mb-5">

            <p>Do you own a Vehicle ? </p>


            <div className="flex">
              <div className="form-check form-check-inline flex ustify-evenly">
                <input onChange={onChange25} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions13" id="inlineRadio1" value="option1" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
              </div>

              <div className="form-check form-check-inline ml-5">
                <input onChange={onChange26} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions13" id="inlineRadio2" value="option2" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
              </div>
            </div>
          </div>

          {isFetching21 && (
            <div className="flex justify-center item mb-2">
              <Loader
                visible={isFetching21}
                type="BallTriangle"
                color="#00FA9A"
                height={19}
                width={19}
                timeout={0}
                className="ml-2"
              />
              <p className="font-bold">Submitting...</p>
            </div>
          )}

          <div className={`flex justify-start border mb-3 block p-6 rounded-lg bg-white w-full ${togglee13}`}>
            <form onSubmit={submitDataVehicle}>
              <div className="">
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Date of purchase:</label>
                  <input required onChange={handleVehicleChange} name="purchase_date" value={vehicle.purchase_date} type="date" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Cost:</label>
                  <input required onChange={handleVehicleChange} name="cost" value={vehicle.cost} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Brand:</label>
                  <input onChange={handleVehicleChange} type="text" name="brand" value={vehicle.brand}></input>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <labe>Model:</labe>
                  <input onChange={handleVehicleChange} name="model" value={vehicle.model} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Year:</label>
                  <input required onChange={handleVehicleChange} name="year" value={vehicle.year} type="date" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog13} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-between mb-5">

            <p>Do you own a Landed Property ? </p>


            <div className="flex">
              <div className="form-check form-check-inline flex ustify-evenly">
                <input onChange={onChange27} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions14" id="inlineRadio1" value="option1" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio1">Yes</label>
              </div>

              <div className="form-check form-check-inline ml-5">
                <input onChange={onChange28} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions14" id="inlineRadio2" value="option2" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio2">No</label>
              </div>
            </div>
          </div>
          {isFetching22 && (
            <div className="flex justify-center item mb-2">
              <Loader
                visible={isFetching22}
                type="BallTriangle"
                color="#00FA9A"
                height={19}
                width={19}
                timeout={0}
                className="ml-2"
              />
              <p className="font-bold">Submitting...</p>
            </div>
          )}
          <div className={`flex justify-start border mb-3 block p-6 rounded-lg bg-white w-full ${togglee14}`}>
            <form onSubmit={submitDataLand}>
              <div className="">
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Address:</label>
                  <textarea onChange={handleLandChange} name="addr" value={land.addr} cols="40" rows="2" className="form-control w-full rounded"
                  />
                </div>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Type of property:</label>
                  <select onChange={handleLandChange} name="prop_type" value={land.prop_type} className="form-select w-full">
                    <option value="Bungalow">Bungalow</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Apartment or Flat">Apartment or Flat</option>
                    <option value="Terraced house">Terraced house</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Traditional house">Traditional house</option>
                  </select>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Date of completion/acquisition:</label>
                  <input required onChange={handleLandChange} name="date_completion" value={land.date_completion} type="date" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Cost of construction/acquisition:</label>
                  {/* <FormatMoneyComponent 
                    name="amount"
                    control={control}
                    defaultValue="0"
                    onValueChange={(v) => fixValues({ amount: v })}
                    className="form-control w-full rounded"
                  /> */}
                  <input required onChange={handleLandChange} name="construction_cost" value={land.construction_cost} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog14} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-between mb-5">

            <p>Do you own a Farm Land ? </p>


            <div className="flex">
              <div className="form-check form-check-inline flex ustify-evenly">
                <input onChange={onChange29} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions15" id="inlineRadio1" value="option1" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio10">Yes</label>
              </div>

              <div className="form-check form-check-inline ml-5">
                <input onChange={onChange30} className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions15" id="inlineRadio2" value="option2" />
                <label className="form-check-label inline-block text-gray-800" for="inlineRadio20">No</label>
              </div>
            </div>
          </div>

          {isFetching23 && (
            <div className="flex justify-center item mb-2">
              <Loader
                visible={isFetching23}
                type="BallTriangle"
                color="#00FA9A"
                height={19}
                width={19}
                timeout={0}
                className="ml-2"
              />
              <p className="font-bold">Submitting...</p>
            </div>
          )}
          <div className={`flex justify-start border mb-3 block p-6 rounded-lg bg-white w-full ${togglee15}`}>
            <form onSubmit={submitDataFarm}>
              <div className="">
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Address:</label>
                  <input onChange={handlefarmChange} name="addr" value={farmland.addr} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Date of acquisition:</label>
                  <input required onChange={handlefarmChange} name="acq_date" value={farmland.acq_date} type="date" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Cost of Land:</label>
                  <input required onChange={handlefarmChange} placeholder="₦" name="land_cost" value={farmland.land_cost} type="text" className="form-control w-full rounded"
                  />
                </div>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <label>Cost of Produce:</label>
                  <input required onChange={handlefarmChange} name="produce_cost" value={farmland.produce_cost} type="text" className="form-control w-full rounded"
                  />
                </div>

                <div className="mb-6 flex justify-between">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Save
                  </button>
                  <button onClick={formTog15} className="h-10 w-10 bg-green-100 text-white flex items-center justify-center rounded-full text-lg font-display font-bold">
                    <a >
                      <FiTriangle
                        size={15}
                        className="stroke-current text-green-500"
                      />
                    </a>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <form onSubmit={submitAssessmentForm}>
            {isFetching15 && (
              <div className="flex justify-center item mb-2">
                <Loader
                  visible={isFetching15}
                  type="BallTriangle"
                  color="#00FA9A"
                  height={19}
                  width={19}
                  timeout={0}
                  className="ml-2"
                />
                <p className="font-bold">Submitting...</p>
              </div>
            )}
            <div className="mb-6 flex justify-center">
              <button
                style={{ backgroundColor: "#84abeb" }}
                className="btn w-64 btn-default text-white btn-outlined bg-transparent rounded-md"
                type="submit"
              >
                Submit form
              </button>
            </div>
          </form>
        </div>
      </Widget>


    </>
  )
};