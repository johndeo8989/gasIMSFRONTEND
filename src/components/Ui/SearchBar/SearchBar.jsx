import React from 'react';
import styles from './SearchBar.module.css';
import { IoMdArrowBack } from "react-icons/io";
import { useFormContext } from '../../../context/DisplayForm/FormContext';
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data }) => {
    const { setViewData } = useFormContext()
    const handleSearchChange = (e) => {
        if (e.target.value)
            setViewData(data.filter((data) => (data.name).toLowerCase().includes(e.target.value.toLowerCase())))
        else {
            setViewData(data)
        }
    }
    const navigate = useNavigate()

    return (
        <div className={styles.searchBar}>
            <button className={styles.backButton} onClick={() => navigate('/home')}
            >
                <IoMdArrowBack className='text-xl font-bold min-w-[100px]' />
            </button>
            <div className={`w-100 ${styles.searchcont}  flex items-center`}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search..."
                    onChange={handleSearchChange}
                />
                <IoMdSearch className='text-md sm:text-2xl mr-2 font-bold ' />
            </div>

        </div >
    );
};

export default SearchBar;