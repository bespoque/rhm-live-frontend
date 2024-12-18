import React, { useEffect, useState } from "react";
import Section from "../dashboard/section";
import { PieChart, Pie, Cell, LineChart, Line } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { formatNumber } from "accounting";
import Widget1 from "../dashboard/widget-1";
import {
  PendingRemittance,
  RevenueItems,
  TaxReceipt,
  TotalRemittance,
  Unassessed
} from "../Icons";
import Loader from "react-loader-spinner";


// Assessment bar count variables
let AjaokutaapprCount
let AjaokutaSubCount

let lokoja1ApprCount
let lokoja1SubCount

let adaviApprCount
let adaviSubCount

let lokoja2ApprCount
let lokoja2SubCount

let headOfficeApprCount
let headOfficeSubCount

let okeneApprCount
let okeneSubCount

let isanluApprCount
let isanluSubCount

let kabbaApprCount
let kabbaSubCount

let idahApprCount
let idahSubCount

let kotoApprCount
let kotoSubCount

let ankpaApprCount
let ankpaSubCount

let ayingbaApprCount
let ayingbaSubCount

// cummulative pie variables
let cummApprCount
let cummSubCount


// Amount Assessed variables
let AjaokutaapprAssessedAmt
let AjaokutaSubAssessedAmt

let lokoja1ApprAssessedAmt
let lokoja1SubAssessedAmt

let adaviApprAssessedAmt
let adaviSubAssessedAmt

let lokoja2ApprAssessedAmt
let lokoja2SubAssessedAmt

let headOfficeApprAssessedAmt
let headOfficeSubAssessedAmt

let okeneApprAssessedAmt
let okeneSubAssessedAmt

let isanluApprAssessedAmt
let isanluSubAssessedAmt

let kabbaApprAssessedAmt
let kabbaSubAssessedAmt

let idahApprAssessedAmt
let idahSubAssessedAmt

let kotoApprAssessedAmt
let kotoSubAssessedAmt

let ankpaApprAssessedAmt
let ankpaSubAssessedAmt

let ayingbaApprAssessedAmt
let ayingbaSubAssessedAmt


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index

}) => {
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="blue"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
    </text>
  );
};
const renderCustomizedLabel2 = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index

}) => {

  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="blue"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
    </text>
  );
};


export const CountPie = ({ cummulativeAssess }) => {

  const cummApproved = cummulativeAssess.filter(data => data.status === "Approved");
  const cummSubmitted = cummulativeAssess.filter(data => data.status === "Submitted");

  cummApproved.forEach((ind, i) => {
    cummApprCount = ind.count
  })

  cummSubmitted.forEach((ind, i) => {
    cummSubCount = ind.count
  })

  const dataCummCount = [
    { name: "Submitted", value: cummSubCount },
    { name: "Approved", value: cummApprCount },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart width={400} height={300}>
          <Legend verticalAlign="top" align="center" />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
          <Pie
            data={dataCummCount}
            // cx={150}
            // cy={150}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataCummCount.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const Lines = ({ perfTrend }) => {

  let janApprAss
  let janAmtPaid
  let janUnassessedPay

  let febApprAss
  let febAmtPaid
  let febUnassessedPay

  let marchApprAss
  let marchAmtPaid
  let marchUnassessedPay

  let aprilApprAss
  let aprilAmtPaid
  let aprilUnassessedPay

  let mayApprAss
  let mayAmtPaid
  let mayUnassessedPay

  let juneApprAss
  let juneAmtPaid
  let juneUnassessedPay

  let julyApprAss
  let julyAmtPaid
  let julyUnassessedPay

  let augApprAss
  let augAmtPaid
  let augUnassessedPay

  let septApprAss
  let septAmtPaid
  let septUnassessedPay

  let octApprAss
  let octAmtPaid
  let octUnassessedPay

  let novApprAss
  let novAmtPaid
  let novUnassessedPay

  let decApprAss
  let decAmtPaid
  let decUnassessedPay

  const janPerfTrend = perfTrend.filter(data => data.month === "January");
  const febPerfTrend = perfTrend.filter(data => data.month === "February");
  const marchPerfTrend = perfTrend.filter(data => data.month === "March");
  const aprilPerfTrend = perfTrend.filter(data => data.month === "April");
  const mayPerfTrend = perfTrend.filter(data => data.month === "May");
  const junePerfTrend = perfTrend.filter(data => data.month === "June");
  const julyPerfTrend = perfTrend.filter(data => data.month === "July");
  const augPerfTrend = perfTrend.filter(data => data.month === "August");
  const septPerfTrend = perfTrend.filter(data => data.month === "September");
  const octPerfTrend = perfTrend.filter(data => data.month === "October");
  const novPerfTrend = perfTrend.filter(data => data.month === "November");
  const decPerfTrend = perfTrend.filter(data => data.month === "December");


  janPerfTrend.forEach((ind, i) => {
    janApprAss = Number(ind.assessedAmount)
    janAmtPaid = Number(ind.amountCollected)
    janUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  febPerfTrend.forEach((ind, i) => {
    febApprAss = Number(ind.assessedAmount)
    febAmtPaid = Number(ind.amountCollected)
    febUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  marchPerfTrend.forEach((ind, i) => {
    marchApprAss = Number(ind.assessedAmount)
    marchAmtPaid = Number(ind.amountCollected)
    marchUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  aprilPerfTrend.forEach((ind, i) => {
    aprilApprAss = Number(ind.assessedAmount)
    aprilAmtPaid = Number(ind.amountCollected)
    aprilUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  mayPerfTrend.forEach((ind, i) => {
    mayApprAss = Number(ind.assessedAmount)
    mayAmtPaid = Number(ind.amountCollected)
    mayUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  junePerfTrend.forEach((ind, i) => {
    juneApprAss = Number(ind.assessedAmount)
    juneAmtPaid = Number(ind.amountCollected)
    juneUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  julyPerfTrend.forEach((ind, i) => {
    julyApprAss = Number(ind.assessedAmount)
    julyAmtPaid = Number(ind.amountCollected)
    julyUnassessedPay = Number(ind.unassessedAmountCollected)
  })
  augPerfTrend.forEach((ind, i) => {
    augApprAss = Number(ind.assessedAmount)
    augAmtPaid = Number(ind.amountCollected)
    augUnassessedPay = Number(ind.unassessedAmountCollected)
  })
  septPerfTrend.forEach((ind, i) => {
    septApprAss = Number(ind.assessedAmount)
    septAmtPaid = Number(ind.amountCollected)
    septUnassessedPay = Number(ind.unassessedAmountCollected)
  })
  octPerfTrend.forEach((ind, i) => {
    octApprAss = Number(ind.assessedAmount)
    octAmtPaid = Number(ind.amountCollected)
    octUnassessedPay = Number(ind.unassessedAmountCollected)
  })
  novPerfTrend.forEach((ind, i) => {
    novApprAss = Number(ind.assessedAmount)
    novAmtPaid = Number(ind.amountCollected)
    novUnassessedPay = Number(ind.unassessedAmountCollected)
  })
  decPerfTrend.forEach((ind, i) => {
    decApprAss = Number(ind.assessedAmount)
    decAmtPaid = Number(ind.amountCollected)
    decUnassessedPay = Number(ind.unassessedAmountCollected)
  })

  const Trend = [
    {
      name: "Jan",
      approvedassessment: janApprAss,
      amountpaid: janAmtPaid,
      unassessedpayment: janUnassessedPay,
    },
    {
      name: "Feb",
      approvedassessment: febApprAss,
      amountpaid: febAmtPaid,
      unassessedpayment: febUnassessedPay,
    },
    {
      name: "March",
      approvedassessment: marchApprAss,
      amountpaid: marchAmtPaid,
      unassessedpayment: marchUnassessedPay,
    },
    {
      name: "April",
      approvedassessment: aprilApprAss,
      amountpaid: aprilAmtPaid,
      unassessedpayment: aprilUnassessedPay,
    },
    {
      name: "May",
      approvedassessment: mayApprAss,
      amountpaid: mayAmtPaid,
      unassessedpayment: mayUnassessedPay,
    },
    {
      name: "June",
      approvedassessment: juneApprAss,
      amountpaid: juneAmtPaid,
      unassessedpayment: juneUnassessedPay,
    },
    {
      name: "July",
      approvedassessment: julyApprAss,
      amountpaid: julyAmtPaid,
      unassessedpayment: julyUnassessedPay,
    },
    {
      name: "August",
      approvedassessment: augApprAss,
      amountpaid: augAmtPaid,
      unassessedpayment: augUnassessedPay,
    },
    {
      name: "Sep",
      approvedassessment: septApprAss,
      amountpaid: septAmtPaid,
      unassessedpayment: septUnassessedPay,
    },
    {
      name: "Oct",
      approvedassessment: octApprAss,
      amountpaid: octAmtPaid,
      unassessedpayment: octUnassessedPay,
    },
    {
      name: "Nov",
      approvedassessment: novApprAss,
      amountpaid: novAmtPaid,
      unassessedpayment: novUnassessedPay,
    },
    {
      name: "Dec",
      approvedassessment: decApprAss,
      amountpaid: decAmtPaid,
      unassessedpayment: decUnassessedPay,
    }
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={Trend}
          margin={{
            top: 5,
            right: 30,
            left: 30,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
          <Legend />
          <Line type="monotone" name="Unassessed Payment" dataKey="unassessedpayment" stroke="#fe0037" />
          <Line type="monotone" name="Approved Assessment" dataKey="approvedassessment" stroke="#82ca9d" />
          <Line type="monotone" name="Amount Paid" dataKey="amountpaid" stroke="#fcc287" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


export const PerfPie = ({ cumPerformance }) => {

  let amountCol
  let assessedAmt
  let outstandingAss
  let unassessedCol

  cumPerformance.forEach((ind, i) => {
    amountCol = Number(ind.amountCollected)
    assessedAmt = Number(ind.assessedAmount)
    unassessedCol = Number(ind.unassessedAmountCollected)
  })

  outstandingAss = (assessedAmt - amountCol)

  const dataCummPerf = [
    { name: "Amount Collected", value: amountCol },
    { name: "Outstanding Assessment", value: outstandingAss },
    { name: "Unassessed Collection", value: unassessedCol }
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart width={400} height={300}>
          <Legend verticalAlign="top" align="center" />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
          <Pie
            data={dataCummPerf}
            label={renderCustomizedLabel2}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
          >
            {dataCummPerf.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const AssesmentCount = ({
  assessCountData,
  assessOverviewData,
  cummulativeAssess,
  cumPerformance,
  perfTrend,
  colPerformance,
  summaryItems,
  exceptions,
  isLoading
}) => {

  const ajaokutaApproved = assessCountData.filter(data => data.tax_office === "Ajaokuta" && data.status === "Approved");
  const ajaokutaSubmitted = assessCountData.filter(data => data.tax_office === "Ajaokuta" && data.status === "Submitted");

  const lokoja2Approved = assessCountData.filter(data => data.tax_office === "Lokoja 2" && data.status === "Approved");
  const lokoja2Submitted = assessCountData.filter(data => data.tax_office === "Lokoja 2" && data.status === "Submitted");

  const headOfficeApproved = assessCountData.filter(data => data.tax_office === "Head Office" && data.status === "Approved");
  const headOfficeSubmitted = assessCountData.filter(data => data.tax_office === "Head Office" && data.status === "Submitted");

  const okeneApproved = assessCountData.filter(data => data.tax_office === "Okene" && data.status === "Approved");
  const okeneSubmitted = assessCountData.filter(data => data.tax_office === "Okene" && data.status === "Submitted");

  const isanluApproved = assessCountData.filter(data => data.tax_office === "Isanlu" && data.status === "Approved");
  const isanluSubmitted = assessCountData.filter(data => data.tax_office === "Isanlu" && data.status === "Submitted");

  const kabbaApproved = assessCountData.filter(data => data.tax_office === "Kabba" && data.status === "Approved");
  const kabbaSubmitted = assessCountData.filter(data => data.tax_office === "Kabba" && data.status === "Submitted");

  const idahApproved = assessCountData.filter(data => data.tax_office === "Idah" && data.status === "Approved");
  const idahSubmitted = assessCountData.filter(data => data.tax_office === "Idah" && data.status === "Submitted");

  const kotoApproved = assessCountData.filter(data => data.tax_office === "Kotonkarfe" && data.status === "Approved");
  const kotoSubmitted = assessCountData.filter(data => data.tax_office === "Kotonkarfe" && data.status === "Submitted");

  const ankpaApproved = assessCountData.filter(data => data.tax_office === "Ankpa" && data.status === "Approved");
  const ankpaSubmitted = assessCountData.filter(data => data.tax_office === "Ankpa" && data.status === "Submitted");

  const ayingbaApproved = assessCountData.filter(data => data.tax_office === "Anyigba" && data.status === "Approved");
  const ayingbaSubmitted = assessCountData.filter(data => data.tax_office === "Anyigba" && data.status === "Submitted");

  const lokoja1Approved = assessCountData.filter(data => data.tax_office === "Lokoja 1" && data.status === "Approved");
  const lokoja1Submitted = assessCountData.filter(data => data.tax_office === "Lokoja 1" && data.status === "Submitted");

  const adaviApproved = assessCountData.filter(data => data.tax_office === "Okehi/Adavi" && data.status === "Approved");
  const adaviSubmitted = assessCountData.filter(data => data.tax_office === "Okehi/Adavi" && data.status === "Submitted");


  ajaokutaApproved.forEach((ind, i) => {
    AjaokutaapprCount = ind.count
  })

  ajaokutaSubmitted.forEach((ind, i) => {
    AjaokutaSubCount = ind.count
  })

  lokoja2Approved.forEach((ind, i) => {
    lokoja2ApprCount = ind.count
  })

  lokoja2Submitted.forEach((ind, i) => {
    lokoja2SubCount = ind.count
  })

  lokoja1Approved.forEach((ind, i) => {
    lokoja1ApprCount = ind.count
  })

  lokoja1Submitted.forEach((ind, i) => {
    lokoja1SubCount = ind.count
  })

  headOfficeApproved.forEach((ind, i) => {
    headOfficeApprCount = ind.count
  })

  headOfficeSubmitted.forEach((ind, i) => {
    headOfficeSubCount = ind.count
  })


  okeneApproved.forEach((ind, i) => {
    okeneApprCount = ind.count
  })

  okeneSubmitted.forEach((ind, i) => {
    okeneSubCount = ind.count
  })

  isanluApproved.forEach((ind, i) => {
    isanluApprCount = ind.count
  })

  isanluSubmitted.forEach((ind, i) => {
    isanluSubCount = ind.count
  })

  kabbaApproved.forEach((ind, i) => {
    kabbaApprCount = ind.count
  })

  kabbaSubmitted.forEach((ind, i) => {
    kabbaSubCount = ind.count
  })

  idahApproved.forEach((ind, i) => {
    idahApprCount = ind.count
  })

  idahSubmitted.forEach((ind, i) => {
    idahSubCount = ind.count
  })

  kotoApproved.forEach((ind, i) => {
    kotoApprCount = ind.count
  })
  kotoSubmitted.forEach((ind, i) => {
    kotoSubCount = ind.count
  })

  ankpaApproved.forEach((ind, i) => {
    ankpaApprCount = ind.count
  })
  ankpaSubmitted.forEach((ind, i) => {
    ankpaSubCount = ind.count
  })


  ayingbaApproved.forEach((ind, i) => {
    ayingbaApprCount = ind.count
  })

  ayingbaSubmitted.forEach((ind, i) => {
    ayingbaSubCount = ind.count
  })

  adaviApproved.forEach((ind, i) => {
    adaviApprCount = ind.count
  })

  adaviSubmitted.forEach((ind, i) => {
    adaviSubCount = ind.count
  })


  const dataCount = [
    {
      name: "Lk2",
      submitted: lokoja2SubCount,
      approved: lokoja2ApprCount,
    },
    {
      name: "Lk1",
      submitted: lokoja1SubCount,
      approved: lokoja1ApprCount,
    },
    {
      name: "Adv",
      submitted: adaviSubCount,
      approved: adaviApprCount,
    },
    {
      name: "HQ",
      submitted: headOfficeSubCount,
      approved: headOfficeApprCount,
    },
    {
      name: "Okn",
      submitted: okeneSubCount,
      approved: okeneApprCount,
    },
    {
      name: "Isn",
      submitted: isanluSubCount,
      approved: isanluApprCount,
    },
    {
      name: "Kbb",
      submitted: kabbaSubCount,
      approved: kabbaApprCount,
    },
    {
      name: "Idh",
      submitted: idahSubCount,
      approved: idahApprCount,
    },
    {
      name: "Kot",
      submitted: kotoSubCount,
      approved: kotoApprCount,
    },
    {
      name: "Ank",
      submitted: ankpaSubCount,
      approved: ankpaApprCount,
    },
    {
      name: "Ajk",
      submitted: AjaokutaSubCount,
      approved: AjaokutaapprCount,
    },
    {
      name: "Any",
      submitted: ayingbaSubCount,
      approved: ayingbaApprCount,
    }
  ];

  //   // Assessed Amount 
  const ajaokutaApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Ajaokuta" && data.status === "Approved");
  const ajaokutaSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Ajaokuta" && data.status === "Submitted");

  const lokoja2ApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Lokoja 2" && data.status === "Approved");
  const lokoja2SubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Lokoja 2" && data.status === "Submitted");

  const headOfficeApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Head Office" && data.status === "Approved");
  const headOfficeSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Head Office" && data.status === "Submitted");

  const okeneApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Okene" && data.status === "Approved");
  const okeneSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Okene" && data.status === "Submitted");

  const isanluApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Isanlu" && data.status === "Approved");
  const isanluSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Isanlu" && data.status === "Submitted");

  const kabbaApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Kabba" && data.status === "Approved");
  const kabbaSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Kabba" && data.status === "Submitted");

  const idahApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Idah" && data.status === "Approved");
  const idahSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Idah" && data.status === "Submitted");

  const kotoApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Kotonkarfe" && data.status === "Approved");
  const kotoSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Kotonkarfe" && data.status === "Submitted");

  const ankpaApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Ankpa" && data.status === "Approved");
  const ankpaSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Ankpa" && data.status === "Submitted");

  const ayingbaApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Anyigba" && data.status === "Approved");
  const ayingbaSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Anyigba" && data.status === "Submitted");

  const lokoja1ApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Lokoja 1" && data.status === "Approved");
  const lokoja1SubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Lokoja 1" && data.status === "Submitted");

  const adaviApprovedAssAmount = assessCountData.filter(data => data.tax_office === "Okehi/Adavi" && data.status === "Approved");
  const adaviSubmittedAssAmount = assessCountData.filter(data => data.tax_office === "Okehi/Adavi" && data.status === "Submitted");

  ajaokutaApprovedAssAmount.forEach((ind, i) => {
    AjaokutaapprAssessedAmt = ind.amount
  })

  ajaokutaSubmittedAssAmount.forEach((ind, i) => {
    AjaokutaSubAssessedAmt = ind.amount
  })

  lokoja2ApprovedAssAmount.forEach((ind, i) => {
    lokoja2ApprAssessedAmt = ind.amount
  })

  lokoja2SubmittedAssAmount.forEach((ind, i) => {
    lokoja2SubAssessedAmt = ind.amount
  })

  lokoja1ApprovedAssAmount.forEach((ind, i) => {
    lokoja1ApprAssessedAmt = ind.amount
  })

  lokoja1SubmittedAssAmount.forEach((ind, i) => {
    lokoja1SubAssessedAmt = ind.amount
  })

  headOfficeApprovedAssAmount.forEach((ind, i) => {
    headOfficeApprAssessedAmt = ind.amount
  })

  headOfficeSubmittedAssAmount.forEach((ind, i) => {
    headOfficeSubAssessedAmt = ind.amount
  })


  okeneApprovedAssAmount.forEach((ind, i) => {
    okeneApprAssessedAmt = ind.amount
  })

  okeneSubmittedAssAmount.forEach((ind, i) => {
    okeneSubAssessedAmt = ind.amount
  })

  isanluApprovedAssAmount.forEach((ind, i) => {
    isanluApprAssessedAmt = ind.amount
  })

  isanluSubmittedAssAmount.forEach((ind, i) => {
    isanluSubAssessedAmt = ind.amount
  })

  kabbaApprovedAssAmount.forEach((ind, i) => {
    kabbaApprAssessedAmt = ind.amount
  })

  kabbaSubmittedAssAmount.forEach((ind, i) => {
    kabbaSubAssessedAmt = ind.amount
  })

  idahApprovedAssAmount.forEach((ind, i) => {
    idahApprAssessedAmt = ind.amount
  })

  idahSubmittedAssAmount.forEach((ind, i) => {
    idahSubAssessedAmt = ind.amount
  })

  kotoApprovedAssAmount.forEach((ind, i) => {
    kotoApprAssessedAmt = ind.amount
  })
  kotoSubmittedAssAmount.forEach((ind, i) => {
    kotoSubAssessedAmt = ind.amount
  })

  ankpaApprovedAssAmount.forEach((ind, i) => {
    ankpaApprAssessedAmt = ind.amount
  })
  ankpaSubmittedAssAmount.forEach((ind, i) => {
    ankpaSubAssessedAmt = ind.amount
  })


  ayingbaApprovedAssAmount.forEach((ind, i) => {
    ayingbaApprAssessedAmt = ind.amount
  })
  ayingbaSubmittedAssAmount.forEach((ind, i) => {
    ayingbaSubAssessedAmt = ind.amount
  })

  adaviApprovedAssAmount.forEach((ind, i) => {
    adaviApprAssessedAmt = ind.amount
  })
  adaviSubmittedAssAmount.forEach((ind, i) => {
    adaviSubAssessedAmt = ind.amount
  })


  const amountAssessed = [
    {
      name: "Lk2",
      submitted: lokoja2SubAssessedAmt,
      approved: lokoja2ApprAssessedAmt,
    },
    {
      name: "Lk1",
      submitted: lokoja1SubAssessedAmt,
      approved: lokoja1ApprAssessedAmt,
    },
    {
      name: "Adv",
      submitted: adaviSubAssessedAmt,
      approved: adaviApprAssessedAmt,
    },
    {
      name: "HQ",
      submitted: headOfficeSubAssessedAmt,
      approved: headOfficeApprAssessedAmt,
    },
    {
      name: "Okn",
      submitted: okeneSubAssessedAmt,
      approved: okeneApprAssessedAmt,
    },
    {
      name: "Isn",
      submitted: isanluSubAssessedAmt,
      approved: isanluApprAssessedAmt,
    },
    {
      name: "Kbb",
      submitted: kabbaSubAssessedAmt,
      approved: kabbaApprAssessedAmt,
    },
    {
      name: "Idh",
      submitted: idahSubAssessedAmt,
      approved: idahApprAssessedAmt,
    },
    {
      name: "Kot",
      submitted: kotoSubAssessedAmt,
      approved: kotoApprAssessedAmt,
    },
    {
      name: "Ankp",
      submitted: ankpaSubAssessedAmt,
      approved: ankpaApprAssessedAmt,
    },
    {
      name: "Ajk",
      submitted: AjaokutaSubAssessedAmt,
      approved: AjaokutaapprAssessedAmt,
    },
    {
      name: "Any",
      submitted: ayingbaSubAssessedAmt,
      approved: ayingbaApprAssessedAmt,
    }
  ];

  //   // collection performance

  // Ajaokuta variables
  let AjkamountCollected
  let AjkassessedAmount
  let AjkunassessedAmountCollected
  let AjkOutstanding

  // lokoja 1 variables
  let lk1mountCollected
  let lk1assessedAmount
  let lk1unassessedAmountCollected
  let lk1Outstanding

  // lokoja 2 variables
  let lk2mountCollected
  let lk2assessedAmount
  let lk2unassessedAmountCollected
  let lk2Outstanding

  // HQ variables
  let hqmountCollected
  let hqassessedAmount
  let hqunassessedAmountCollected
  let hqOutstanding

  // Okene variables
  let okenemountCollected
  let okeneassessedAmount
  let okeneunassessedAmountCollected
  let okeneOutstanding

  // Isanlu variables
  let isanlumountCollected
  let isanluassessedAmount
  let isanluunassessedAmountCollected
  let isanluOutstanding

  // Kabba variables
  let kabbamountCollected
  let kabbaassessedAmount
  let kabbaunassessedAmountCollected
  let kabbaOutstanding

  // Idah variables
  let idahmountCollected
  let idahassessedAmount
  let idahunassessedAmountCollected
  let idahOutstanding

  // Adavi variables
  let adavimountCollected
  let adaviassessedAmount
  let adaviunassessedAmountCollected
  let adaviOutstanding

  // Anyigba variables
  let anyigbamountCollected
  let anyigbaassessedAmount
  let anyigbaunassessedAmountCollected
  let anyigbaOutstanding

  // Koto variables
  let kotomountCollected
  let kotoassessedAmount
  let kotounassessedAmountCollected
  let kotoOutstanding

  // Ankpa variables
  let ankpamountCollected
  let ankpaassessedAmount
  let ankpaunassessedAmountCollected
  let ankpaOutstanding

  const ajaokutaColPerf = colPerformance.filter(data => data.tax_office === "Ajaokuta");
  const lk1ColPerf = colPerformance.filter(data => data.tax_office === "Lokoja 1");
  const lk2ColPerf = colPerformance.filter(data => data.tax_office === "Lokoja 2");
  const headOffColPerf = colPerformance.filter(data => data.tax_office === "Head Office");
  const okeneColPerf = colPerformance.filter(data => data.tax_office === "Okene");
  const isanluColPerf = colPerformance.filter(data => data.tax_office === "Isanlu");
  const kabbaColPerf = colPerformance.filter(data => data.tax_office === "Kabba");
  const idahColPerf = colPerformance.filter(data => data.tax_office === "Idah");
  const adaviColPerf = colPerformance.filter(data => data.tax_office === "Okehi/Adavi");
  const anyigbaColPerf = colPerformance.filter(data => data.tax_office === "Anyigba");
  const kotoColPerf = colPerformance.filter(data => data.tax_office === "Kotonkarfe");
  const ankpaColPerf = colPerformance.filter(data => data.tax_office === "Ankpa");


  ajaokutaColPerf.forEach((ind, i) => {
    AjkamountCollected = ind.amountCollected
    AjkassessedAmount = ind.assessedAmount
    AjkunassessedAmountCollected = ind.unassessedAmountCollected
  })
  AjkOutstanding = Number(AjkassessedAmount) - Number(AjkamountCollected)

  lk1ColPerf.forEach((ind, i) => {
    lk1mountCollected = ind.amountCollected
    lk1assessedAmount = ind.assessedAmount
    lk1unassessedAmountCollected = ind.unassessedAmountCollected
  })
  lk1Outstanding = Number(lk1assessedAmount) - Number(lk1mountCollected)

  lk2ColPerf.forEach((ind, i) => {
    lk2mountCollected = ind.amountCollected
    lk2assessedAmount = ind.assessedAmount
    lk2unassessedAmountCollected = ind.unassessedAmountCollected
  })
  lk2Outstanding = Number(lk2assessedAmount) - Number(lk2mountCollected)

  headOffColPerf.forEach((ind, i) => {
    hqmountCollected = ind.amountCollected
    hqassessedAmount = ind.assessedAmount
    hqunassessedAmountCollected = ind.unassessedAmountCollected
  })
  hqOutstanding = Number(hqassessedAmount) - Number(hqmountCollected)

  okeneColPerf.forEach((ind, i) => {
    okenemountCollected = ind.amountCollected
    okeneassessedAmount = ind.assessedAmount
    okeneunassessedAmountCollected = ind.unassessedAmountCollected
  })
  okeneOutstanding = Number(okeneassessedAmount) - Number(okenemountCollected)

  isanluColPerf.forEach((ind, i) => {
    isanlumountCollected = ind.amountCollected
    isanluassessedAmount = ind.assessedAmount
    isanluunassessedAmountCollected = ind.unassessedAmountCollected
  })
  isanluOutstanding = Number(isanluassessedAmount) - Number(isanlumountCollected)

  kabbaColPerf.forEach((ind, i) => {
    kabbamountCollected = ind.amountCollected
    kabbaassessedAmount = ind.assessedAmount
    kabbaunassessedAmountCollected = ind.unassessedAmountCollected
  })
  kabbaOutstanding = Number(kabbaassessedAmount) - Number(kabbamountCollected)

  idahColPerf.forEach((ind, i) => {
    idahmountCollected = ind.amountCollected
    idahassessedAmount = ind.assessedAmount
    idahunassessedAmountCollected = ind.unassessedAmountCollected
  })
  idahOutstanding = Number(idahassessedAmount) - Number(idahmountCollected)

  adaviColPerf.forEach((ind, i) => {
    adavimountCollected = ind.amountCollected
    adaviassessedAmount = ind.assessedAmount
    adaviunassessedAmountCollected = ind.unassessedAmountCollected
  })
  adaviOutstanding = Number(adaviassessedAmount) - Number(adavimountCollected)

  anyigbaColPerf.forEach((ind, i) => {
    anyigbamountCollected = ind.amountCollected
    anyigbaassessedAmount = ind.assessedAmount
    anyigbaunassessedAmountCollected = ind.unassessedAmountCollected
  })
  anyigbaOutstanding = Number(anyigbaassessedAmount) - Number(anyigbamountCollected)

  kotoColPerf.forEach((ind, i) => {
    kotomountCollected = ind.amountCollected
    kotoassessedAmount = ind.assessedAmount
    kotounassessedAmountCollected = ind.unassessedAmountCollected
  })
  kotoOutstanding = Number(kotoassessedAmount) - Number(kotomountCollected)

  ankpaColPerf.forEach((ind, i) => {
    ankpamountCollected = ind.amountCollected
    ankpaassessedAmount = ind.assessedAmount
    ankpaunassessedAmountCollected = ind.unassessedAmountCollected
  })
  ankpaOutstanding = Number(ankpaassessedAmount) - Number(ankpamountCollected)


  const colPerform = [
    {
      name: "Lokoja 2",
      assessed: lk2assessedAmount,
      collected: lk2mountCollected,
      outstanding: lk2Outstanding,
      unassessed: lk2unassessedAmountCollected
    },
    {
      name: "Lokoja 1",
      assessed: lk1assessedAmount,
      collected: lk1mountCollected,
      outstanding: lk1Outstanding,
      unassessed: lk1unassessedAmountCollected
    },
    {
      name: "Adavi",
      assessed: adaviassessedAmount,
      collected: adavimountCollected,
      outstanding: adaviOutstanding,
      unassessed: adaviunassessedAmountCollected
    },
    {
      name: "Head Office",
      assessed: hqassessedAmount,
      collected: hqmountCollected,
      outstanding: hqOutstanding,
      unassessed: hqunassessedAmountCollected
    },
    {
      name: "Okene",
      assessed: okeneassessedAmount,
      collected: okenemountCollected,
      outstanding: okeneOutstanding,
      unassessed: okeneunassessedAmountCollected
    },
    {
      name: "Isanlu",
      assessed: isanluassessedAmount,
      collected: isanlumountCollected,
      outstanding: isanluOutstanding,
      unassessed: isanluunassessedAmountCollected
    },
    {
      name: "Kabba",
      assessed: kabbaassessedAmount,
      collected: kabbamountCollected,
      outstanding: kabbaOutstanding,
      unassessed: kabbaunassessedAmountCollected
    },
    {
      name: "Idah",
      assessed: idahassessedAmount,
      collected: idahmountCollected,
      outstanding: idahOutstanding,
      unassessed: idahunassessedAmountCollected
    },
    {
      name: "Koto",
      assessed: kotoassessedAmount,
      collected: kotomountCollected,
      outstanding: kotoOutstanding,
      unassessed: kotounassessedAmountCollected
    },
    {
      name: "Ankpa",
      assessed: ankpaassessedAmount,
      collected: ankpamountCollected,
      outstanding: ankpaOutstanding,
      unassessed: ankpaunassessedAmountCollected
    },
    {
      name: "Ajaokuta",
      assessed: AjkassessedAmount,
      collected: AjkamountCollected,
      outstanding: AjkOutstanding,
      unassessed: AjkunassessedAmountCollected
    },
    {
      name: "Anyingba",
      assessed: anyigbaassessedAmount,
      collected: anyigbamountCollected,
      outstanding: anyigbaOutstanding,
      unassessed: anyigbaunassessedAmountCollected
    }
  ];

  const fields = [
    {
      name: "sn",
      key: "serialNo",
    },
    {
      name: "Tax Office",
      key: "station",
    },
    {
      name: "Pending Count",
      key: "submittedCount",
    },
    {
      name: "Approved Count",
      key: "approvedCount",
    },
    {
      name: "Pending Amount",
      key: "submittedAmountf",
    },
    {
      name: "Approved Amount",
      key: "approvedAmountFormatted",
    },
    {
      name: "Paid Amount",
      key: "paidAmountFormatted",
    },
    {
      name: "Unpaid Amount",
      key: "unpaidAmountCal",
    },
    {
      name: "Unassessed Collections",
      key: "unassessedAmountCollectedf",
    },
  ];

  const fields2 = [
    {
      name: "Month",
      key: "month",
    },
    {
      name: "Count",
      key: "collectionCount",
    },
    {
      name: "Amount",
      key: "collectionAmountFormated",
    },
    {
      name: "Revenue Item",
      key: "revenueItem",
    },
  ];

  const [total, setTotal] = useState([])
  const [items, setPost] = useState(() => []);
  const [except, setExcept] = useState(() => []);
  const [exceptTotal, setExceptTotal] = useState([])




  useEffect(() => {
    let num = 1
    if (summaryItems) {
      let records = [];
      let sum = {};
      let approvedCountSum = [];
      let subCountSum = []
      let submittedAmountSum = [];
      let apprAmtSum = [];
      let paidAmtSum = [];
      let unassessedColSum = [];
      let unpaidAmountCalSum = []

      for (let i = 0; i < summaryItems.length; i++) {
        let rec = summaryItems[i];
        rec.serialNo = num + i

        rec.submittedAmountf = Number(rec.submittedAmount)
        rec.unassessedAmountCollectedf = Number(rec.unassessedAmountCollected)
        rec.submittedCount = Number(rec.submittedCount)
        rec.approvedCount = Number(rec.approvedCount)
        rec.approvedAmount = Number(rec.approvedAmount)
        rec.assessedAmountCollected = Number(rec.assessedAmountCollected)
        rec.unpaidAmountCal = (Number(rec.approvedAmount) - Number(rec.assessedAmountCollected))

        paidAmtSum.push(rec.assessedAmountCollected);
        apprAmtSum.push(rec.approvedAmount)
        submittedAmountSum.push(rec.submittedAmountf)
        approvedCountSum.push(rec.approvedCount);
        subCountSum.push(rec.submittedCount);
        unassessedColSum.push(rec.unassessedAmountCollectedf);
        unpaidAmountCalSum.push(rec.unpaidAmountCal)



        rec.approvedCount = formatNumber(rec.approvedCount)
        rec.submittedAmountf = formatNumber(rec.submittedAmount)
        rec.approvedAmountFormatted = formatNumber(rec.approvedAmount)
        rec.paidAmountFormatted = formatNumber(rec.assessedAmountCollected)
        rec.unpaidAmountCal = formatNumber(Number(rec.approvedAmount) - Number(rec.assessedAmountCollected))
        rec.unassessedAmountCollectedf = formatNumber(rec.unassessedAmountCollected);
        records.push(rec);
      }
      const totalapprCount = approvedCountSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );
      const totalsubCountSum = subCountSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );
      const totalApprAmtSum = apprAmtSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );
      const totalPaidAmtSum = paidAmtSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );
      const totalSubmittedAmt = submittedAmountSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );
      const totalUnassessedAmt = unassessedColSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );
      const totalUnpaidAmt = unpaidAmountCalSum.reduce(
        (preVal, curVal) => preVal + curVal,
        0
      );


      sum.totalSubmittedAmt = totalSubmittedAmt;
      sum.totalPaidAmtSum = totalPaidAmtSum;
      sum.totalApprAmtSum = totalApprAmtSum;
      sum.totalapprCount = totalapprCount;
      sum.totalsubCountSum = totalsubCountSum;
      sum.totalUnassessedAmt = totalUnassessedAmt;
      sum.totalUnpaidAmt = totalUnpaidAmt;

      if (records.find(v => v.station === "Okehi/Adavi")) {
        records.find(v => v.station === "Okehi/Adavi").station = "Adavi/Okehi";
      }
      if (records.find(v => v.station === "Anyigba")) {
        records.find(v => v.station === "Anyigba").paidAmountFormatted = "2,421,160";
      }
      if (records.find(v => v.station === "Anyigba")) {
        records.find(v => v.station === "Anyigba").unassessedAmountCollectedf = "357,600";
      }

      setPost(() => records);
      setTotal(() => sum);

    }


    let exceptionRecords = [];
    let excepsum = {};
    let ColCountSum = []
    let ColAmountSum = []

    for (let i = 0; i < exceptions.length; i++) {

      let rec = exceptions[i];
      rec.serialNo = num + i

      rec.collectionCount = Number(rec.collectionCount)
      rec.collectionAmountf = Number(rec.collectionAmount)

      ColCountSum.push(rec.collectionCount)
      ColAmountSum.push(rec.collectionAmountf)


      rec.collectionCount = formatNumber(rec.collectionCount);
      rec.collectionAmountFormated = formatNumber(rec.collectionAmount);
      exceptionRecords.push(rec);
    }
    const totalexcepCountSum = ColCountSum.reduce(
      (preVal, curVal) => preVal + curVal,
      0
    );
    const totalexcepAmountSum = ColAmountSum.reduce(
      (preVal, curVal) => preVal + curVal,
      0
    );

    excepsum.totalexcepCountSum = totalexcepCountSum;
    excepsum.totalexcepAmountSum = totalexcepAmountSum;

    setExcept(() => exceptionRecords);
    setExceptTotal(() => excepsum);

  }, []);

  console.log("assessOverviewData", assessOverviewData);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center item mb-2">
          <Loader
            visible={isLoading}
            type="BallTriangle"
            color="#00FA9A"
            height={19}
            width={19}
            timeout={0}
            className="ml-2"
          />
          <p className="font-bold"> Fetching...</p>
        </div>
      )}
      {assessOverviewData.map((ind, i) => (
        <div className="flex my-10 flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">

          <div className="w-full lg:w-1/5">
            <Widget1
              color="blue"
              title="No. Approved Assessments"
              description={formatNumber(ind.approvedCount)}
              right={<TotalRemittance />}
            />
          </div>

          <div className="w-full lg:w-1/5">
            <Widget1
              color="purple"
              title="Total Approved Amount"
              description={formatNumber(ind.amountAssessed)}
              right={<PendingRemittance />}
            />
          </div>

          <div className="w-full lg:w-1/5">
            <Widget1
              color="green"
              title="Assessed Amount Collected"
              description={formatNumber(ind.amountCollected)}
              right={<RevenueItems />}
            />
          </div>

          <div className="w-full lg:w-1/5">
            <Widget1
              color="red"
              title="Outstanding Assessed Amount"
              description={formatNumber(Number(ind.amountAssessed) - Number(ind.amountCollected))}
              right={<TaxReceipt />}
            />
          </div>

          <div className="w-full lg:w-1/5">
            <Widget1
              color="red"
              title="Unassessed Amount Collected"
              description={formatNumber(ind.unassessedAmountCollected)}
              right={<Unassessed />}
            />
          </div>

        </div>

      ))}

      <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
        <div className="w-full lg:w-2/3">
          <Section
            description={<span>ASSESSMENT COUNT</span>}
          >
            <div className="flex flex-row">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dataCount}
                  stackOffset="sign"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Legend />
                  <Bar name="Submitted" dataKey="submitted" fill="#02321C" stackId="stack" />
                  <Bar name="Approved" dataKey="approved" fill="#82ca9d" stackId="stack" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
        <div className="w-full lg:w-1/3">
          <Section
            description={<span>CUMMULATIVE ASSESSMENT</span>}
          >
            <div className="flex flex-row">
              <CountPie cummulativeAssess={cummulativeAssess} />
            </div>
          </Section>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
        <div className="w-full lg:w-2/3">
          <Section
            description={<span>AMOUNT ASSESSED</span>}
          >
            <div className="flex flex-row w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={amountAssessed}
                  stackOffset="sign"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 30,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Bar name="Submitted" dataKey="submitted" fill="#002147" stackId="stack" />
                  <Bar name="Approved" dataKey="approved" fill="#a2add0" stackId="stack" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
        <div className="w-full lg:w-1/3">
          <Section
            description={<span>CUMMULATIVE PERFORMANCE</span>}
          >
            <div className="flex flex-row w-full">
              <PerfPie cumPerformance={cumPerformance} />
            </div>
          </Section>
        </div>
      </div>


      <div className="flex mt-10 flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
        <div className="w-full">
          <Section
            description={<span>PERFORMANCE TREND</span>}
          >
            {/* <div className="flex flex-row w-full">
              <Lines perfTrend={perfTrend} />
            </div> */}
          </Section>
        </div>

      </div>


      <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
        <div className="w-full lg:w-3/3">
          <Section
            description={<span>COLLECTION PERFORMANCE</span>}
          >
            <div className="flex flex-row w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={colPerform}
                  stackOffset="sign"
                  margin={{
                    top: 5,
                    right: 15,
                    left: 33,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Bar name="Amount Assessed" dataKey="assessed" fill="#247ba0" stackId="stack" />
                  <Bar name="Amount Collected" dataKey="collected" fill="#0D41E1" stackId="stack" />
                  <Bar name="Amount Outstanding" dataKey="outstanding" fill="#cddafd" stackId="stack" />
                  <Bar name="Unassessed Amount Collected" dataKey="unassessed" fill="#fe938c" stackId="stack" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
        <div className="w-full lg:w-2/2">
          <Section >
            <p className="text-sm my-3 font-bold text-center">SUMMARY</p>
            <div className="flex justify-center">
              <div className="overflow-x-auto">
                <table className="table table-auto divide-y striped">
                  <thead>
                    <tr className="">
                      {fields.map((field, i) => (
                        <th key={i} className="">
                          {field.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((ind, i) => (
                      <tr key={i} className="">
                        {fields.map((field, j) => (
                          <td key={j} className="">
                            {ind[field.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {items.length > 0 && (
                      <tr className="font-semibold">
                        <td>Total</td>
                        <td></td>
                        <td>{formatNumber(total.totalsubCountSum)}</td>
                        <td>{formatNumber(total.totalapprCount)}</td>
                        <td>{formatNumber(total.totalSubmittedAmt)}</td>
                        <td>{formatNumber(total.totalApprAmtSum)}</td>
                        <td>{formatNumber(total.totalPaidAmtSum)}</td>
                        <td>{formatNumber(total.totalUnpaidAmt)}</td>
                        <td>{formatNumber(total.totalUnassessedAmt)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
        <div className="w-full lg:w-2/2">
          <Section >
            <p className="text-sm my-3 font-bold text-center">COLLECTIONS WITHOUT TAX STATIONS</p>
            <div className="flex justify-center">
              <div className="overflow-x-auto">
                <table className="table table-auto divide-y striped">
                  <thead>
                    <tr className="">
                      {fields2.map((field, i) => (
                        <th key={i} className="">
                          {field.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {exceptions.map((ind, i) => (
                      <tr key={i} className="">
                        {fields2.map((field, j) => (
                          <td key={j}>
                            {ind[field.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {exceptions.length > 0 && (
                      <tr className="font-semibold">
                        <td>Total</td>
                        <td>{formatNumber(exceptTotal.totalexcepCountSum)}</td>
                        <td>{formatNumber(exceptTotal.totalexcepAmountSum)}</td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </div>
      </div>


    </>
  );
}


