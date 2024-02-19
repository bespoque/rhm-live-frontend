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
import { PlayCircleOutline, WarningRounded, MoreHoriz } from "@material-ui/icons";
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';


const Index = () => {
    const [isFetching, setIsFetching] = useState(() => false);
    const [jobs, setJobs] = useState(() => []);
    const [startModal, setStartModal] = useState(false);
    const [startJobFields, setStartJobFields] = useState(() => { });
    const [selectedRow, setSelectedRow] = useState(null);
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

    ];

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const emailAdd = decoded?.user
    const toggleStart = () => {
        setStartModal(!startModal);
    };

    const handleRowClick = (event, rowData) => {
        setSelectedRow(rowData);
    };

    const handleClosePopup = () => {
        setSelectedRow(null);
    };

    const formatDateToEnglishReadable = dateStr =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });


    const filteredJobs = jobs?.filter(obj => obj.job_user.includes(emailAdd));

    useEffect(() => {
        async function fetchPost() {
            setIsFetching(true)
            try {
                const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-jobs-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "post": "action"
                    })
                })

                const dataFetch = await response.json()
                setJobs(dataFetch.body)
            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [router]);


    async function StartJob() {
        toggleStart()
        setIsFetching(true)
        try {
            const response = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-acceptjob.php', {
                method: 'POST',
                body: JSON.stringify(startJobFields)
            })

            const dataFetch = await response.json()
            toast.success(dataFetch.message)
            router.push(`/tax-audit/audit-view?id=${startJobFields.id}`)
        } catch (error) {
            console.error('Server Error:', error)
        } finally {
            setIsFetching(false)
        }
    }


    return (
        <>
            <ToastContainer />
            {startModal && (
                <div className="modal">
                    <div className="modal-content" width="300">
                        <form onSubmit={StartJob}>
                            <div className="flex justify-center">
                                <WarningRounded
                                    size={15}
                                    className="text-yellow-400"
                                />
                            </div>
                            <p>Are you sure you want to Start Job?</p>
                            <div className="mt-2 flex justify-between">
                                <button onClick={toggleStart}
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

            <MaterialTable title="My jobs"
                data={filteredJobs}
                columns={fields}
                actions={
                    [
                        {
                            icon: MoreHoriz,
                            tooltip: 'Details',
                            onClick: handleRowClick
                        },
                        {
                            icon: PlayCircleOutline,
                            tooltip: 'Start Job',
                            onClick: (event, rowData) => {
                                if (rowData.job_start_status === 'Pending') {
                                    setStartJobFields(
                                        {
                                            "id": rowData.id,
                                            "job_user": rowData.job_user,
                                            "job_startdate": rowData.job_startdate,
                                            "job_start_status": "Started"
                                        }
                                    )
                                    setStartModal(true)
                                } else {

                                    router.push(`/tax-audit/audit-view?id=${rowData.id}`)
                                }
                            }


                        }
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
            <Dialog open={selectedRow !== null} onClose={handleClosePopup}>
                <DialogTitle>Job Details</DialogTitle>
                <DialogContent>
                    <Typography> <p>Start date: <span className="font-bold">{formatDateToEnglishReadable(selectedRow?.job_startdate)}</span></p></Typography>
                    <Typography> <p>Audit start date: <span className="font-bold">{formatDateToEnglishReadable(selectedRow?.job_auditdate_start)}</span></p></Typography>
                    <Typography> <p>Audit end date: <span className="font-bold">{formatDateToEnglishReadable(selectedRow?.job_auditdate_end)}</span></p></Typography>
                    <Typography> <p>Progress status: <span className="font-bold">{selectedRow?.job_progress_status}</span></p></Typography>
                </DialogContent>
            </Dialog>

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
    )
}
export default Index