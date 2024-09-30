import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../../config/url";
import setAuthToken from "../../../functions/setAuthToken";
import { formatNumber } from "../../../functions/numbers";
import Loader from "react-loader-spinner";
import { shallowEqual, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { toWords } from 'number-to-words';


export default function MultipleCollection() {
    const [multipleSearchData, setmultipleSearchData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredRecords = multipleSearchData.filter(
        (record) =>
            record.pmt_meth !== 'Remita' &&
            record.channel_id !== 'Remita' &&
            record.channel_id !== 'PAYTAX'
    );

    console.log("filteredRecords", filteredRecords);


    const recordsPerPage = 100;
    const totalRecords = filteredRecords.length;
    const recordsStart = (currentPage - 1) * recordsPerPage + 1;
    const recordsEnd = Math.min(currentPage * recordsPerPage, totalRecords);
    const recordsRemaining = totalRecords - recordsEnd;
    const router = useRouter();

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );


    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const formattedDateTime = new Date().toLocaleDateString(undefined, options);


    const decoded = jwt.decode(auth);
    const staff = decoded.staffName



    const getStyles = () => {
        const stylesheets = Array.from(document.styleSheets);
        const cssText = stylesheets
            .map((sheet) =>
                Array.from(sheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("")
            )
            .join("");

        return cssText;
    };

    useEffect(() => {
        if (router && router.query) {
            let searchDate = router.query.ref;
            let tranDate = {
                tranDate: searchDate,
            };
            setAuthToken();
            const fetchPost = async () => {
                setIsFetching(true);
                try {
                    const response = await axios.post(
                        `${url.BASE_URL}collection/view-collections`,
                        tranDate
                    );
                    let search = response.data.body;
                    setmultipleSearchData(search);
                    setIsFetching(false);
                } catch (error) {
                    setIsFetching(false);
                    console.log('Error', error);
                }
            };
            fetchPost();
        }
    }, [router]);

    const handleDownload = async () => {
        const currentRecords = filteredRecords.slice(
            (currentPage - 1) * recordsPerPage,
            currentPage * recordsPerPage
        );


        const qrCodeBase64Array = await Promise.all(
            currentRecords.map((record) => getQRCodeBase64(record.ref))
        );

        const pdfContent = generatePDFContent(currentRecords, qrCodeBase64Array);

        const styles = `<style>${getStyles()}</style>`;
        const htmlWithStyles = `
        <html>
          <head>
            ${styles}
          </head>
          <body>
            ${pdfContent}
          </body>
        </html>
      `;


        const printWindow = window.open("", "_blank");
        printWindow.document.open();

        const preloadImages = async () => {
            const imagesToPreload = [
                '/images/icons/coat of arms.png',
                '/images/kog_govt.png',
                '/images/logo2.png',
                '/images/signature.png',
            ];

            for (const element of qrCodeBase64Array) {
                imagesToPreload.push(element);
            }

            const promises = imagesToPreload.map((image) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = image;
                });
            });

            try {
                await Promise.all(promises);
                generateAndPrintPDF();
            } catch (error) {
                console.error('Error preloading images:', error);
            }
        };

        preloadImages();

        const generateAndPrintPDF = () => {

            printWindow.document.write(htmlWithStyles);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
                printWindow.close();
            };

            if (currentPage < Math.ceil(filteredRecords.length / recordsPerPage)) {
                setCurrentPage(currentPage + 1);
            }
        }
    }

    const generatePDFContent = (records, qrCodeBase64Array) => {
        return `
  <div>
     ${records
                .map(
                    (record, index) =>
                        `
     <div class=" p-4 mb-2" style="page-break-after: always;" key=${record.idpymt}>
         <p>KOGI STATE GOVERNMENT</p>
         <section class="flex justify-between">
             <p class="font-bold">REVENUE RECEIPT</p>
             <p class="font-bold">${record.ref || "-"}</p>
         </section>
         <section class="flex justify-end mt-3">
             <img src="/images/icons/coat of arms.png" width='60' height='25' />
             <img src="/images/kog_govt.png" width='73' height='30' />
             <img src="/images/logo2.png" width='50' height='50' />
         </section>
         <div class="flex justify-between">
             <div>
                 <div class="grid grid-cols-6 gap-2">
                     <p>PAID BY:</p>
                     <p class=" col-span-4">${record.taxpayerName || "-"
                        }</p>
                 </div>
                 <div class="grid grid-cols-6 gap-2">
                     <p >PAYER ID:</p>
                     <p class=" col-span-2">${record.t_payer || "-"}</p>
                 </div>
                 <div class="grid grid-cols-6 gap-2">
                     <p>ADDRESS:</p>
                     <p class=" col-span-4">${record.taxpayerAddress || "-"
                        }</p>
                 </div>
                 <div class="flex my-4">
                     <div class='w-16 border-b-2'>
                     </div>
                     <p class='align-self-center'>Details</p>
                     <div class="border-b-2 w-3/4 ">
                     </div>
                 </div>
             </div>
             <div class="mt-3 mr-3">
                 <div>
                     <img src="${qrCodeBase64Array[index]}" alt="Random Image" />
                 </div>
             </div>
         </div>
         <div class="">
             <div class="grid grid-cols-6 gap-2">
                 <p>PAYMENT DATE:</p>
                 <p class=" col-span-2">${record.tran_date || "-"}</p>
             </div>
             <div class="grid grid-cols-6 gap-2">
                 <p>AMOUNT:</p>
                 <div class="col-span-4">
                     <p class="">NGN ${formatNumber(record.amount) || "-"
                        }</p>
                        <p>(${toWords(record.amount)} Naira only)</p>
                 </div>
             </div>
             <div class="grid grid-cols-7 gap-2">
                 <p>Details:</p>
                 <p class=" col-span-5 pl-4"> ${record.details || "-"
                        } </p>
             </div>
             <div class="grid grid-cols-6 gap-2">
                 <p>PAID AT:</p>
                 <p class="col-span-3">  ${record?.bank || ""}(${record?.channel_id})  </p>
             </div>
             <div class="grid grid-cols-6 gap-2">
                 <p>AGENCY:</p>
                 <div class="col-span-3">
                     <p class="">${record?.mda || record?.revenueItem || "-"} </p>
                 </div>
             </div>
             <div class="grid grid-cols-6 gap-2">
                 <p>TAX STATION:</p>
                 <p class=""> ${record.station || "-"} </p>
             </div>
             <div class="border-b-2 mt-3 w-4/4 ">
             </div>
         </div>

         <div class="flex justify-between">
             <div class="self-end"><small><< Printed by ${staff} on ${formattedDateTime} >></small></div>
             <div class="mt-2">
                 <img src="/images/signature.png" width='100' height='30' />
                 <hr />
                 Authorized Signatory
             </div>
         </div>
     </div>
     `
                )
                .join("")}
</div>
        `;
    };

    const getQRCodeBase64 = async (idpymt) => {
        const baseReceiptVer = `https://irs.kg.gov.ng/verify/verify_receipt.php?ref=${idpymt}`;
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${baseReceiptVer}`;
        const response = await fetch(qrCodeURL);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    };

    return (
        <>
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
            ) : (
                <div>
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={handleDownload}
                            className="btn w-32 bg-green-600 btn-default text-white
                    btn-outlined bg-transparent rounded-md"
                        >
                            Download PDF
                        </button>
                    </div>

                    <div id="pdf-content">
                        <p class="text-gray-800">
                            Records to download: {recordsStart} - {recordsEnd}
                        </p>
                        <p class="text-gray-800">Records Remaining: {recordsRemaining}</p>
                    </div>
                </div>
            )}
        </>
    );
}
