
import { formatNumber } from "../../functions/numbers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import url from '../../config/url';
import axios from "axios";
import setAuthToken from "../../functions/setAuthToken";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FormatMoneyComponentBOJ } from "../FormInput/formInputs";
import SectionTitle from "../section-title";


export const StartBOJ = () => {

  const [payerDetails, setpayerDetails] = useState([]);
  const [isFetching, setIsFetching] = useState(() => false);
  const [assmentYear, setAssessmentYear] = useState('');
  const [payerKgtin, setPayerKgtin] = useState('');
  const [bojData, setBojData] = useState(() => []);
  const [routerAssId, setAssessId] = useState('');
  const [fixedValues, fixValues] = useState({ amount: 0 });
  const [fixedValues2, fixValues2] = useState({ amount: 0 });
  const [fixedValues3, fixValues3] = useState({ amount: 0 });
  const [fixedValues4, fixValues4] = useState({ amount: 0 });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm()



  let APIEmployed
  let APISelfEmployed
  let APIOtherIncome
  let APIPreviousTax
  // let APITax 

  console.log(bojData);

  bojData.forEach(ind => {
    APIEmployed = ind.employed
    return APIEmployed
  })

  bojData.forEach(ind => {
    APISelfEmployed = ind.self_employed
    return APISelfEmployed
  })

  bojData.forEach(ind => {
    APIOtherIncome = ind.other_income
    return APIOtherIncome
  })

  bojData.forEach(ind => {
    APIPreviousTax = ind.previous_yr_tax
    return APIPreviousTax
  })



  if (APIEmployed === null || APIEmployed === '') {
    APIEmployed = '0'
  } else {
    APIEmployed = APIEmployed
  }

  if (APISelfEmployed === null || APISelfEmployed === '') {
    APISelfEmployed = '0'
  } else {
    APISelfEmployed = APISelfEmployed
  }

  if (APIOtherIncome === null || APIOtherIncome === '') {
    APIOtherIncome = '0'
  } else {
    APIOtherIncome = APIOtherIncome
  }

  if (APIPreviousTax === null || APIPreviousTax === '') {
    APIPreviousTax = '0'
  } else {
    APIPreviousTax = APIPreviousTax
  }



  let selfemplFigureInit = watch("self_employment", `${APISelfEmployed}`)
  let emplFigureInit = watch("employment", `${APIEmployed}`);
  let otherIncomeFigureInit = watch("other_income", `${APIOtherIncome}`)
  let previousTaxFigureInit = watch("previous_tax", `${APIPreviousTax}`)

  let selfemplFigure = selfemplFigureInit.replace(/,/g, '')
  let emplFigure = emplFigureInit.replace(/,/g, '')
  let otherIncomeFigure = otherIncomeFigureInit.replace(/,/g, '')
  let previousTaxFigure = previousTaxFigureInit.replace(/,/g, '')



  //taxcal
  let tax;
  let tax_paid;

  ///TAX CAL
  let employedF = emplFigure;
  let selfEmployedF = selfemplFigure;
  let otherIncomeF = otherIncomeFigure


  let consolidatedRelief;
  let chargeableIncome;
  let totalRelief;
  let totalDeduction;
  let consolidatedIncome
  let dev_levy

  useEffect(() => {
    if (router && router.query) {
      let routerData = String(router.query.ref);
      let kgtin = routerData.split('_').pop()
      let assessId = routerData.split('_').shift()
      let assessmentYear = routerData.split('_').slice(1, 2).toString()
      setAssessmentYear(assessmentYear)
      setPayerKgtin(kgtin)
      setAssessId(assessId)
      let kgtinPost = {
        "KGTIN": kgtin
      }

      setAuthToken();
      const fetchPost = async () => {
        setIsFetching(true)
        try {
          let res = await axios.post(`${url.BASE_URL}taxpayer/view-taxpayers`, kgtinPost);
          let IndData = res.data.body
          setpayerDetails(IndData)
          console.log("IndData", IndData);
          setIsFetching(false);
        } catch (err) {
          console.log(err);
          setIsFetching(false);
        }
      };
      fetchPost();
    }
  }, [router]);

  useEffect(() => {
    if (router && router.query) {
      let routerData = String(router.query.ref);
      let kgtin = routerData.split('_').pop()
      let assessId = routerData.split('_').shift()
      setAssessId(assessId)
      let fetchboj = {
        KGTIN: kgtin,
        assessment_id: assessId
      }

      setAuthToken();
      const bojPost = async () => {
        setIsFetching(true)
        try {
          let res = await axios.post(`${url.BASE_URL}forma/view-assessment`, fetchboj);
          let IndData = res.data.body.assessment
          setBojData(IndData)
          console.log(IndData);
          setIsFetching(false);
        } catch (err) {
          console.log(err);
          setIsFetching(false);
        }
      };
      bojPost();
    }
  }, [router]);


  const TotalIncome = Number(emplFigure) + Number(selfemplFigure) + Number(otherIncomeFigure)

  setAuthToken();
  let UpdateBOJ = async (data) => {
    setIsFetching(true)
    if (!data.self_employment && !data.employment) {
      alert("Please fill out either employment or self employment amount")
    }
    else {
      let BOJObject = {
        assessment_id: routerAssId,
        employed: emplFigure,
        self_employed: selfemplFigure,
        tax: JsonTax,
        previous_yr_tax: previousTaxFigure,
        boj_comment: data.comment,
        dev_levy: dev_levy,
        other_income: otherIncomeFigure,
        year: assmentYear,
        kgtin: payerKgtin
      }
      try {
        let res = await axios.put(`${url.BASE_URL}forma/boj-assessment`, BOJObject);
        setIsFetching(false)
        toast.success("Success!");
        router.push('/view/completeddirect')
      } catch (error) {
        setIsFetching(false)
        if (error.response.status == 400) {
          toast.error("Nothing was updated")
        } else {
          toast.error("Failed to update BOJ!");
        }
      }

    }

  }



  consolidatedIncome = (Number(selfEmployedF) + Number(employedF) + Number(otherIncomeF));
  // console.log("Consl", consolidatedIncome);

  totalRelief = 0;
  let gross_inc = consolidatedIncome - totalRelief;

  // console.log(gross_inc, ' gross')


  if (consolidatedIncome < 300000.0) {
    consolidatedRelief = 0;
    //console.log(gross_inc);
  } else {
    consolidatedRelief = 200000 + 0.2 * gross_inc;
    // console.log("Gross INC", gross_inc);
  }

  totalDeduction = consolidatedRelief + totalRelief;
  chargeableIncome = consolidatedIncome - totalDeduction;

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

  tax = tax;

  tax_paid = tax;

  let JsonTax = String(tax_paid)
  dev_levy = "1000"






  return (
    <>
      <ToastContainer />
      <div>
        {bojData.map((ind, i) => (
          <div>
            {ind.boj_comment === null && ind.employed === null && ind.self_employed === null ?
              <SectionTitle subtitle="Create Assessment" />
              :
              <SectionTitle subtitle="Update Assessment" />
            }
          </div>
        ))}

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
            <p>Updating data...</p>
          </div>
        )}


        <div className="border mb-3 block p-8 rounded-lg bg-white w-full">
          <div className="flex">
            <h6 className="p-2">Taxpayer Information</h6>
          </div>
          <p className="mb-3 font-bold"></p>
          <form>
            <div className="grid grid-cols-3 gap-4">
              <div className="">
                <p>Name</p>
                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.tp_name} disabled />
              </div>

              <div className="form-group mb-6">
                <p>KGTIN</p>

                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.KGTIN} disabled />
              </div>

              <div className="form-group mb-6">
                <p>Email</p>
                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.email} disabled />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group mb-6">
                <p>Phone</p>
                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.phone_number} disabled />
              </div>

              <div className="form-group mb-6">
                <p>Tax Office</p>
                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.tax_office} disabled />
              </div>
              <div className="form-group mb-6">
                <p>Taxpayer Type</p>
                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.tp_type} disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-6">
                <p>Address</p>
                <input type="text" className="form-control w-full rounded font-light text-gray-500"
                  value={payerDetails.address} disabled />
              </div>
            </div>
          </form>
        </div>

        {bojData.map((ind, i) => (
          <form onSubmit={handleSubmit(UpdateBOJ)}>

            <div className="flex justify border mb-3 block p-8 rounded-lg bg-white w-full">

              <div className="">

                <div className="mb-2 grid grid-cols-3 gap-2">
                  <label className="self-center">Self Employment Income:</label>
                  <FormatMoneyComponentBOJ
                    ref={register()}
                    name="self_employment"
                    control={control}
                    defaultValue={ind.self_employed === "" || ind.self_employed === null ? '0.00' : ind.self_employed}
                    onValueChange={(v) => fixValues({ amount: v })}
                  />
                </div>


                <div className="mb-2 grid grid-cols-3 gap-2">
                  <label className="self-center">Employment Income:</label>
                  <FormatMoneyComponentBOJ
                    ref={register()}
                    name="employment"
                    control={control}
                    defaultValue={ind.employed === "" || ind.employed === null ? '0.00' : ind.employed}
                    onValueChange={(v) => fixValues2({ amount: v })}
                  />
                </div>

                <div className="mb-2 grid grid-cols-3 gap-2">
                  <label className="self-center">Other Income:</label>
                  <FormatMoneyComponentBOJ
                    ref={register()}
                    name="other_income"
                    control={control}
                    defaultValue={ind.other_income === "" || ind.other_income === null ? '0.00' : ind.other_income}
                    onValueChange={(v) => fixValues3({ amount: v })}
                  />
                </div>

                <div className="mb-2 grid grid-cols-3 gap-2">
                  <p className="font-bold">Total Income:  </p>
                  <p><span className="font-bold">{formatNumber(TotalIncome)}</span></p>
                </div>



                <div className="mb-2 grid grid-cols-3 gap-2">
                  <label className="self-center">Tax Paid for previous year: <span className="text-red-600 text-center">*</span> </label>
                  <FormatMoneyComponentBOJ
                    ref={register()}
                    name="previous_tax"
                    control={control}
                    defaultValue={ind.previous_yr_tax == null || ind.previous_yr_tax == "" ? '0.00' : ind.previous_yr_tax}
                    onValueChange={(v) => fixValues4({ amount: v })}
                    required
                  />
                  {errors.previous_tax && <small className="text-red-600">{errors.previous_tax.message}</small>}
                </div>

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label className="self-center font-bold">Tax:</label>
                  <div>
                    <div className="flex justify-evenly">
                      <p className="font-bold">{formatNumber(JsonTax)}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label className="self-center font-bold">Development levy:</label>
                  <div>
                    <div className="flex justify-evenly">
                      <p className="font-bold">{formatNumber(dev_levy)}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label className="self-center font-bold">Total tax due for payment:</label>
                  <div>
                    <div className="flex justify-evenly">
                      <p className="font-bold">{formatNumber(Number(JsonTax) + Number(dev_levy))}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label>Reason for BOJ: <span className="text-red-600">*</span></label>
                  <div>
                    <textarea defaultValue={ind.boj_comment} ref={register({ required: "Reason for BOJ is required" })} name="comment" cols="34" rows="2" className="rounded"></textarea>
                    <p className="pt-2">(Note that the reason for BOJ will be reflected in the assessment notice)</p>
                  </div>
                  {errors.comment && <small className="text-red-600">{errors.comment.message}</small>}
                </div>
                <div className="flex justify-end mt-5">
                  {ind.boj_comment === null && ind.employed == null && ind.self_employed === null ?
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Create Assessmnent
                    </button>
                    :
                    <div>
                      <button
                        style={{ backgroundColor: "#84abeb" }}
                        className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                        type="submit"
                      >
                        Update Assessmnent
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </form>
        ))}
      </div>
    </>
  );
};









