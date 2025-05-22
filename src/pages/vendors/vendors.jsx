import React, { useEffect, useState } from "react";
import VendorCard from "../../components/Ui/cards/VendorCard";
import PageLayout from "../../components/layout/PagesLayout/PageLayout";
import AddVendor from "../../components/Ui/form/AddVendor.jsx";
import { useFormContext } from "../../context/DisplayForm/FormContext";
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from "../../redux/slices/VendorSlice.js";
import CardSkeleton from "../../components/Ui/Skeleton/Skeleton";

const Vendor = () => {
  const { isFormOpen, viewData, setViewData } = useFormContext();
  const [data, setData] = useState([])
  const dispatch = useDispatch();
  const { vendors, loading, error } = useSelector(state => state.vendor);
  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);
  useEffect(() => {
    if (vendors) {
      setViewData(vendors);
    }
  }, [vendors, setViewData]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    <div className="flex flex-col relative min-h-screen">
      <PageLayout data={vendors}>
        {loading && (
          <div className="grid grid-cols-4 grid-rows-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-rows-3 2xl:grid-cols-4 gap-6 sm:gap-5 md:gap-12">
          {currentItems.map((vendor, index) => (
            <VendorCard key={index} vendor={vendor} />
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
      </PageLayout>

      {/* VENDOR FORM CONTAINER */}
      {isFormOpen && (
        <div className="absolute form-container w-full flex lg:items-start items-center justify-center h-screen z-30">
          <AddVendor />
        </div>
      )}
    </div>
  );
};

export default Vendor;
