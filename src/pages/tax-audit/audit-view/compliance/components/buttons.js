import React, { useState } from 'react';
import AllComplianceModals from './complianceModals';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";

const ComplianceButtons = ({ JobID }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenSpecial, setIsModalOpenSpecial] = useState(false);
    const [isModalOpenNon, setIsModalOpenNon] = useState(false);

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName

    const openModalNon = () => {
        setIsModalOpenNon(true);
    };
    const openModalSpecialNon = () => {
        setIsModalOpenSpecial(true);
    };
    const openModalComp = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const closeModalSpecial = () => {
        setIsModalOpenSpecial(false);
    };
    const closeModalNon = () => {
        setIsModalOpenNon(false);
    };

    return (
        <>
            <button
                className="btn text-dark btn-default btn-outlined bg-transparent rounded-md"
                type="submit"
                onClick={openModalNon}
            >
                CREATE NON-COMPLIANCE
            </button>
            <button
                className="btn btn-default text-dark btn-outlined bg-transparent rounded-md"
                type="submit"
                onClick={openModalSpecialNon}
            >
                CREATE SPECIAL NON-COMPLIANCE
            </button>
            <button
                className="btn bg-green-600 btn-default text-white btn-outlined bg-transparent rounded-md"
                type="submit"
                onClick={openModalComp}
            >
                 COMPLIANCE
            </button>

            <AllComplianceModals
                isOpenNon={isModalOpenNon}
                closeNoneCompModal={closeModalNon}
                doneby={staffName}
                JobID={JobID}
                isOpenSpecial={isModalOpenSpecial}
                closeSpecialModal={closeModalSpecial}
                isOpenCompliance={isModalOpen}
                closeModalCompliance={()=>closeModal()}

            />
        </>
    );
};

export default ComplianceButtons;
