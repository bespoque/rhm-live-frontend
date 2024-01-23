
import React, { useEffect, useState } from 'react'
import Search from '@material-ui/icons/Search'
import * as Icons from '../../../../../components/Icons/index'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Check from '@material-ui/icons/Check'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Clear from "@material-ui/icons/Clear";
import { useRouter } from 'next/router';
import { ProcessorSpinner } from '../../../../../components/spiner';
import MaterialTable from '@material-table/core'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Email, MoreHoriz } from '@material-ui/icons'
import Modal from '@material-ui/core/Modal';





export default function RescheduleList() {
    const [isFetching, setIsFetching] = useState(() => true);
    const [notifAck, setNotifAck] = useState([]);
    const router = useRouter()
    const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
    const [isModalOpenPDF, setIsModalOpenPDF] = useState(false);
    const { JobID, Notifid } = router?.query



    const fields = [
        {
            title: "Addressee",
            field: "reschedule_adressee",
        },
        {
            title: "Reschedule date",
            field: "reschedule_date",
        },
        {
            title: "Status",
            field: "status",
        },
        {
            title: "Letter Source",
            field: "reschedule_lettersource",
        },
    ];




    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-notification-reschedule-batch.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        "job_id": JobID,
                        "notification_id": Notifid,
                    })
                })
                const dataFetch = await res.json()
                if (dataFetch && dataFetch.body) {
                    const updatedData = {
                        ...dataFetch,
                        body: dataFetch.body.map(record => {
                            const { reviewstatus, approvestatus } = record;

                            if (
                                (reviewstatus === null || reviewstatus === '') &&
                                (approvestatus === null || approvestatus === '')
                            ) {
                                return { ...record, status: null };
                            } else if (
                                reviewstatus !== null &&
                                reviewstatus !== '' &&
                                (approvestatus === null || approvestatus === '')
                            ) {
                                return { ...record, status: reviewstatus };
                            } else {
                                return { ...record, status: approvestatus };
                            }
                        }),
                    };

                    setNotifAck(updatedData.body);
                }

                // setNotifAck(dataFetch.body)
                setIsFetching(false)
            } catch (error) {
                console.error('Server Error:', error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchPost();
    }, [JobID, Notifid]);

    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <div className="flex justify-end my-2">
                <button
                    className="btn bg-gray-400 btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                    onClick={() => router.back()}
                >
                    Back
                </button>
            </div>

            <MaterialTable title="Notification Reschedules"
                data={notifAck}
                columns={fields}

                actions={
                    [

                        {
                            icon: MoreHoriz,
                            tooltip: 'Details',
                            onClick: (event, rowData) => router.push(`/tax-audit/audit-view/acknowledge/list/singlereschedule?Notifid=${rowData.notification_id}&JobID=${rowData.job_id}&ReschId=${rowData.id}`),
                        },
                        {
                            icon: Email,
                            tooltip: 'Letter',
                            onClick: (event, rowData) => {
                                // {`https://test.rhm.backend.bespoque.ng/letters-reschedule-pdf.php?fileno=${notice?.reschedule_lettersource}&reschID=${ReschId}&action=DOWNLOAD`}
                                setSelectedPdfUrl(`https://test.rhm.backend.bespoque.ng/letters-reschedule-pdf.php?fileno=${rowData.reschedule_lettersource}&reschID=${rowData.id}&action=DOWNLOAD`);
                                setIsModalOpenPDF(true);
                            }

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

            <Modal
                open={isModalOpenPDF}
                onClose={() => setIsModalOpenPDF(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <iframe
                    title="PDF Viewer"
                    src={selectedPdfUrl}
                    width="50%"
                    height="600"
                />
            </Modal>
        </>
    )
}
