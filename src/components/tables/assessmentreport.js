
import dateformat from "dateformat";
import setAuthToken from "../../functions/setAuthToken";
import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import url from '../../config/url';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { Controller, useForm } from "react-hook-form";
import { FormatMoneyComponentReport } from "../FormInput/formInputs";
import AssessmentReportstable from "../../pages/assessment-report/assessmentreport";


export const StartAssessmentReportView = () => {
  const [fixedValues, SetFixValuesStart] = useState({ amount: "" });
  const [fixedValuesend, SetFixValuesEnd] = useState({ amount: "" });
  const [station, setStation] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [tableState, setTableState] = useState("hidden");
  const [state, setState] = useState([
    {
      startDate: null,
      endDate: new Date(""),
      key: 'selection'
    }
  ]);

  const {
    register,
    handleSubmit,
    watch,
    control,
  } = useForm()

  let startDate
  let endDate

  if (state[0].startDate === null) {

    startDate = ""

  } else {
    startDate = dateformat(state[0].startDate, "yyyy-mm-dd")
  }


  if (state[0].endDate === null || state[0].endDate === "" || state[0].endDate === undefined || state[0].endDate == "Invalid Date") {

    endDate = ""

  } else {
    endDate = dateformat(state[0].endDate, "yyyy-mm-dd")
  }


  let watchYear = watch("year", "");

  useEffect(() => {

    setAuthToken();
    const fetchPost = async () => {
      try {
        let res = await axios.get(`${url.BASE_URL}user/items`);
        let itemsBody = res.data.body
        let office = itemsBody.taxOffice
        setStation(office)

      } catch (e) {
        console.log(e);
      }
    };
    fetchPost();

  }, []);


  const AdvancedSearch = async (data) => {
    setIsFetching(true)
    data.createdStart = startDate
    data.createdEnd = endDate
    data.taxPaidStart = fixedValues.amount
    data.taxPaidEnd = fixedValuesend.amount
    if (watchYear === "") {
      data.year = ""
    } else {
      data.year = watchYear.getFullYear()
    }

    axios.post(`${url.BASE_URL}forma/list-assessment-report`, data)
    .then(function (response) {
      let search = response.data.body.assessmentApproved;
      setFilteredData(search)
      setIsFetching(false)
      setTableState('')
    })
    .catch(function (error) {
      setTableState('')
      setIsFetching(false)

    })
}

  console.log("filtered", FilteredData);



  return (
    <>
      <div>
        <form onSubmit={handleSubmit(AdvancedSearch)} className="mb-3">

          <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
            <div className="w-full lg:w-1/3 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
              <p className="font-bold text-center my-2">Search by IDs</p>
              <div className="mb-2">
                <label> Taxpayer ID</label>
                <input type="text" ref={register()} name="kgtin" className="form-control w-full rounded font-light text-gray-500" />
              </div>

              <div className="">
                <label> Assessment ID</label>
                <input type="text" ref={register()} name="assessment_id" className="form-control w-full rounded font-light text-gray-500"
                />
              </div>

              <div className="">
                <hr />
              </div>

              <p className="font-bold text-center my-4">Search by others</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="">

                  <Controller
                    name="year"
                    control={control}

                    render={({ onChange, value }) => {
                      return (
                        <DatePicker
                          className="form-control w-full rounded"
                          onChange={onChange}
                          selected={value}
                          showYearPicker
                          dateFormat="yyyy"
                          yearItemNumber={8}
                          placeholderText="Year"

                        />
                      );
                    }}
                  />
                </div>
                <div className="">
                  <select ref={register()} name="tax_office" className="form-control w-full rounded font-light text-gray-500">
                    <option value="">Station</option>
                    {station.map((office) => <option key={office.idstation} value={office.station_code}>{office.name}</option>)}
                  </select>
                </div>
                <div className="">

                  <select ref={register()} name="assessment_type" className="form-control w-full rounded font-light text-gray-500">
                    <option value="">Type</option>
                    <option value="BOJ">BOJ</option>
                    <option value="Assessment">Assessment</option>
                  </select>

                </div>

                <div className="">
                  <select ref={register()} name="printed" className="form-control w-full rounded font-light text-gray-500">
                    <option value="">print status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              <p className="text-center my-2">Amount</p>
              <div className="flex gap-3">
                <div className="">
                  <FormatMoneyComponentReport
                    ref={register()}
                    name="taxPaidStart"
                    control={control}
                    defaultValue={""}
                    onValueChange={(v) => SetFixValuesStart({ amount: v })}
                    placeholder="₦ start amount"
                  />
                </div>
                <div className="">
                  <FormatMoneyComponentReport
                    ref={register()}
                    name="taxPaidEnd"
                    control={control}
                    defaultValue={""}
                    onValueChange={(v) => SetFixValuesEnd({ amount: v })}
                    placeholder="₦ end amount"
                  />
                </div>

              </div>
              <div className="mt-2">
                <select ref={register()} name="tax" className="form-control w-full rounded font-light text-gray-500">
                  <option value="">Payment Status</option>
                  <option value="Not Paid">Not Paid</option>
                  <option value="Part Paid">Part Paid</option>
                  <option value="Fully Paid">Fully Paid</option>
                </select>
              </div>
            
            </div>

            <div className="w-full lg:w-2/3">
              <div className="overflow-x-auto max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
                <p className="font-bold text-center mb-5">Created Date Range (start - end)</p>
                <DateRangePicker
                  onChange={item => setState([item.selection])}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  ranges={state}
                  direction="horizontal"
                />
                <div className="my-4">
                  <button className="btn w-32 bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Search
                  </button>
                </div>

              </div>

            </div>

          </div>

        </form>

        {isFetching ? (
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
        ) :
          <div className={`${tableState}`}>
            <AssessmentReportstable FilteredData={FilteredData} />
          </div>
        }

      </div>

    </>
  );
};