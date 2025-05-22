import React, { useEffect } from "react";
import PageLayout from "../../components/layout/PagesLayout/PageLayout";
import { useFormContext } from "../../context/DisplayForm/FormContext";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { fetchConsumer } from "../../redux/slices/customerSlice";
import CardSkeleton from "../../components/Ui/Skeleton/Skeleton";
import CustomerCard from "../../components/Ui/cards/CustomerCard";
import CustomerInfoCard from "../../components/Ui/InforCard/CustomerInfor";


const Customer = () => {
    const { isInfoOpen, viewData, setViewData, setIsInfoOpen } = useFormContext()
    const dispatch = useDispatch();
    const { consumer, loading, error } = useSelector(state => state.consumer)
    useEffect(() => {
        dispatch(fetchConsumer())
    }, [dispatch])
    useEffect(() => {
        setViewData(consumer)
        setIsInfoOpen(false)
    }, [consumer])

    const [customerInfo, setCustomerInfo] = useState({});



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(viewData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = viewData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className="flex flex-col relative min-h-screen ">
            <PageLayout data={consumer}>
                {loading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 ">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>}
                {error && <p>Error: {error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 ">
                    {
                        currentItems.map((supplier, index) => (
                            <CustomerCard key={index} customer={supplier} setCustomerInfo={setCustomerInfo} />
                        ))
                    }
                </div>
                <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                </div>
            </PageLayout>
            {isInfoOpen &&
                <div className="absolute form-container w-full  flex  items-center justify-center h-screen z-30">
                    <CustomerInfoCard data={customerInfo} />
                </div>
            }
        </div>
    );
};

export default Customer;