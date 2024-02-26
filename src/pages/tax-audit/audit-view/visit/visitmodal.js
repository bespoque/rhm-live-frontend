import React, { useState } from 'react';
import Modal from 'react-modal';
import { shallowEqual, useSelector } from 'react-redux';
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProcessorSpinner } from '../../../../components/spiner';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';




const VisitModal = ({ isOpen, closeModal, id }) => {

    const [isFetching, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const router = useRouter()

    const { auth } = useSelector(
        (state) => ({
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const decoded = jwt.decode(auth);
    const staffName = decoded?.staffName


    const onSubmit = async (data) => {
        data.job_id = id
        data.doneby = staffName
        setIsLoading(true)
        try {
            const res = await fetch('https://test.rhm.backend.bespoque.ng/taxaudit/taxaudit-newauditlog.php', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            const dataFetch = await res.json()
            setIsLoading(false)
            if (dataFetch.status === "400") {
                toast.error(dataFetch.message);
            } else {
                toast.success(dataFetch.message);
                router.reload()
            }

        } catch (error) {
            setIsLoading(false)
            console.error('Server Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <ToastContainer />
            {isFetching && <ProcessorSpinner />}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 bg-white border max-w-sm p-4 mx-auto overflow-y-scroll"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75"
            >
                <div >
                    <h6 className="my-3">New Audit Visit</h6>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="mb-2">
                            <label className="block mb-1  ">
                                Visit Date:
                            </label>
                            <input
                                type="date"
                                name='visitdate'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Personel met:
                            </label>
                            <input type="text"
                                name="personnelmet"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Purpose of visit:
                            </label>
                            <input type="text"
                                name="purpose"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Designation:
                            </label>
                            <input type="text"
                                name='designation'
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                placeholder='eg, internal auditor'
                                ref={register()}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Department:
                            </label>
                            <input type="text"
                                name="department"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Was the purpose of visit achieved ?:
                            </label>
                            <input type="radio" name="purposeachieved" value="Yes" ref={register()} /> Yes <span className='mr-4'></span>
                            <input type="radio" name="purposeachieved" value="No" ref={register()} /> NO <span className='mr-4'></span>
                            <input type="radio" name="purposeachieved" value="partially" ref={register()} /> Partially 
                        </div>
                        <div className="mb-2">
                            <label className="block  mb-1 ">
                                Rate your visit:
                            </label>

                            <div >
                                <label htmlFor="" className='p-1'>1</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="1" ref={register()} />

                                <label htmlFor="" className='p-1'>2</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="2" ref={register()} />

                                <label htmlFor="" className='p-1'>3</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="3" ref={register()} />

                                <label htmlFor="" className='p-1'>4</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="4" ref={register()} />

                                <label htmlFor="" className='p-1'>5</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="5" ref={register()} />

                                <label htmlFor="" className='p-1' >6</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="6" ref={register()} />

                                <label htmlFor="" className='p-1'>7</label>
                                <input type="radio" className='mr-2' name="compliancelevel" value="7" ref={register()} />
                            </div>


                        </div>

                        <div className="mb-2">
                            <label className="block mb-1">
                                Note:
                            </label>
                            <textarea

                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                                ref={register()}
                                name='note'
                            ></textarea>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-600  py-2 px-4 rounded mt-4"
                            type="submit"
                        >
                            Submit
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mt-4 ml-2"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default VisitModal;
