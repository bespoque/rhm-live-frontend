import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner';
import Search from '@material-ui/icons/Search'
import * as Icons from '../../../components/Icons/index'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Check from '@material-ui/icons/Check'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Clear from "@material-ui/icons/Clear";
import MaterialTable from 'material-table';
import { Edit } from "@material-ui/icons";
import url from '../../../config/url';


const Index = () => {
    const [isFetching, setIsFetching] = useState(() => false);
    const [clusterData, setClusterData] = useState(() => []);
    const router = useRouter()
    const fields = [
        {
            title: "Tax Id",
            field: "job_kgtin",
        },
        {
            title: "Job initiator",
            field: "job_initiator",
        },
        // {
        //     title: "Auditor",
        //     field: "job_user",
        // },
        {
            title: "Job type",
            field: "job_job_type",
        },
        {
            title: "Start status",
            field: "job_start_status",
        },
        {
            title: "Progress status",
            field: "job_progress_status",
        },
        {
            title: "Job start date",
            field: "job_startdate",
        },
        {
            title: "Audit start date",
            field: "job_auditdate_start",
        },
        {
            title: "Audit end date",
            field: "job_auditdate_end",
        },
        {
            title: "Created time",
            field: "createtime",
        },

    ];


    useEffect(() => {
        async function fetchPost() {
            setIsFetching(true)
            try {
                const response = await fetch(`https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-jobs-batch.php`, {
                    method: 'POST',
                    body: JSON.stringify({
                        "post": "action"
                    })
                })

                const dataFetch = await response.json()
                setClusterData(dataFetch.body)
            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [router]);



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
                    <p>Fetching data...</p>
                </div>
            )}

            <MaterialTable title="All jobs"
                data={clusterData}
                columns={fields}

                actions={
                    [

                        {
                            icon: Edit,
                            tooltip: 'Edit',
                        },
                    ]
                }

                options={{
                    search: true,
                    paging: true,
                    filtering: true,
                    actionsColumnIndex: -1
                }}
                icons={{
                    Check: Check,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: () => <Icons.Filter />,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    Clear: Clear,
                    SortArrow: ArrowDownward
                }}

            />
        </>
    )
}
export default Index