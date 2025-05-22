import React, { useEffect } from "react";
import SupplierCard from "../../components/Ui/cards/SupplierCard";
import PageLayout from "../../components/layout/PagesLayout/PageLayout";
import AddSupplier from "../../components/Ui/form/AddSupplier";
import { useFormContext } from "../../context/DisplayForm/FormContext";
import { useState } from "react";
import InforCard from "../../components/Ui/InforCard/Inforcard";
import { useDispatch, useSelector } from 'react-redux'
import { fetchSuppliers } from "../../redux/slices/SupplierSlice";
import CardSkeleton from "../../components/Ui/Skeleton/Skeleton";
const Supplier = () => {
    const { isFormOpen, isInfoOpen, viewData, setViewData } = useFormContext()
    const dispatch = useDispatch();
    const { supplier, loading, error } = useSelector(state => state.supplier)
    useEffect(() => {
        dispatch(fetchSuppliers())
    }, [dispatch])
    useEffect(() => {
        setViewData(supplier)
    }, [supplier])
    const [supplierInfo, setSupplierInfo] = useState({});

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
        <div className="flex flex-col  min-h-screen ">
            <PageLayout data={supplier}>
                {loading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">

                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>}
                {error && <p>Error: {error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-5 md:gap-8">
                    {
                        currentItems.map((supplier, index) => (
                            <SupplierCard key={index} supplier={supplier} setSupplierInfo={setSupplierInfo} />
                        ))
                    }
                </div>
                <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                </div>
            </PageLayout>
            {/* SUPPLIER FORM CONTAINER */}
            {isFormOpen &&
                <div className="absolute form-container w-full  flex lg:items-start items-center justify-center h-screen z-30">
                    <AddSupplier />
                </div>
            }
            {isInfoOpen &&
                <div className="absolute form-container w-full  flex  items-center justify-center h-screen z-30">
                    <InforCard data={supplierInfo} />
                </div>
            }


        </div>
    );
};

export default Supplier;