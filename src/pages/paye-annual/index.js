import React, { useState } from 'react'

import dateformat from "dateformat";
import AnnualUploadsList from './annualUploadsList';
import url from '../../config/url';
import axios from "axios";
import setAuthToken from '../../functions/setAuthToken';
import Loader from 'react-loader-spinner';
import Widget1 from '../../components/dashboard/widget-1';
import { DatePicker } from 'antd';


function Index() {
    const [startDate, setStartDate] = useState(new Date());
    const [FilteredData, setFilteredData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [tableState, setTableState] = useState("hidden");
    const [yearReport, setYearReport] = useState([]);


    const selectedYear = dateformat(startDate, "yyyy")

    const SearchYear = () => {
        setAuthToken()
        setIsFetching(true)
        axios.get(`${url.BASE_URL}annual/view-annual-year?year=${selectedYear}`)
            .then(function (response) {
                axios.post(`${url.BASE_URL}annual/report`, { "year": selectedYear })
                    .then(function (responsedata) {
                        let report = responsedata.data.body.report[0]
                        setYearReport(report)
                        console.log("responsedata", report);
                    })
                let search = response.data.body;
                setFilteredData(search)
                console.log("FilteredData", FilteredData);
                setIsFetching(false)
                setTableState('')

            })
    }
    return (
        <>
            <div className="overflow-x-auto flex justify-around my-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
                <div>
                    <p className="font-bold mb-5">Select Year</p>
                    <div className="">
                        <DatePicker
                           onChange={(date) => setStartDate(date)}
                            picker="year"
                            size='large'
                            className="mb-6"
                        />
                    </div>
                    <div>
                        <button className="btn w-32 bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                            type="submit"
                            onClick={() => SearchYear()}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">

                    <Widget1
                        color="blue"
                        title="Year"
                        description={selectedYear || ""}
                    />
                    <Widget1
                        color="blue"
                        title="Draft"
                        description={yearReport?.Draft || 0}
                    />
                    <Widget1
                        color="blue"
                        title="Submitted"
                        description={yearReport?.Submitted || 0}
                    />
                    <Widget1
                        color="blue"
                        title="Verified"
                        description={yearReport?.Verified || 0}
                    />
                    <Widget1
                        color="blue"
                        title="Approved"
                        description={yearReport?.Approved || 0}
                    />
                    <Widget1
                        color="blue"
                        title="Declined"
                        description={yearReport?.Declined || 0}
                    />

                </div>
            </div>
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
                    <AnnualUploadsList FilteredData={FilteredData} />
                </div>
            }
        </>
    )
}

export default Index