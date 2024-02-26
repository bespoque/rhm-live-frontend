import SectionTitle from "../section-title";
import url from "../../config/url";
import setAuthToken from "../../functions/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatNumber } from "../../functions/numbers";
import dateformat from "dateformat";
import Loader from "react-loader-spinner";
import { ViewApprovedTable } from "../tables/viewApprovedAss";

const ViewApprovedAss = () => {
  const [post, setPost] = useState(() => []);
  const [isFetching, setIsFetching] = useState(() => true);
  useEffect(() => {
    let num = 1
    setAuthToken();
    const fetchPost = async () => {
      try {
        let res = await axios.get(`${url.BASE_URL}forma/list-assessment?assmt=Approved`);
        res = res.data.body.assessmentApproved;
        console.log("Res", res);
        let records = [];
        for (let i = 0; i < res.length; i++) {
          let rec = res[i];
          rec.serialNo = num + i
          rec.gross_income = formatNumber(rec.gross_income)
          rec.taxPaidFormatted = formatNumber(rec.taxPaid)
          // rec.tax = formatNumber(rec.tax)
          rec.totalTaxFormated = formatNumber((Number(rec.add_assmt) + Number(rec.tax)))
          rec.totalTaxDue = (Number(rec.add_assmt) + Number(rec.tax))

          rec.overallGross = formatNumber(Number(rec.employed) + Number(rec.self_employed) + Number(rec.other_income))
          rec.createtime = dateformat(rec.createtime, "dd mmm yyyy")
          records.push(rec);
        }
        setIsFetching(false);
        setPost(() => records);
      } catch (e) {
        setIsFetching(false);
        console.log(e.response);
      }
    };
    fetchPost();
  }, []);

  

  return (
    <>
      <SectionTitle title="View direct assessments" subtitle="View Approved Assessments" />

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
          <p>Fetching data...</p>
        </div>
      )}

      <ViewApprovedTable ApprovedData={post} />
    </>
  );
};

export default ViewApprovedAss;
