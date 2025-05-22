import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { RiPencilLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import { handleSuccess } from "../../../utils/utils";
import { fetchSuppliers } from "../../../redux/slices/SupplierSlice";
import { useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";
import profile from './profile.jpeg'
const AddSupplier = () => {

    const { toggleForm } = useFormContext()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        gstno: "",
        address: "",
        profilePic: null,
    });

    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
        else {
            setImagePreview(null);
        }
        setFormData((prev) => ({ ...prev, profilePic: file }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "profilePic") {
                if (value) data.append("profilePic", value);
            } else {
                data.append(key, value);
            }
        });
        try {
            const res = await axios.post("http://localhost:8080/supplier/add", data);
            handleSuccess("User added!");
            dispatch(fetchSuppliers())
            toggleForm()
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    console.log(formData)
    return (
        <div className="p-6 lg:p-4 w-86  sm:w-[20rem] md:w-[22rem] lg:w-[22rem] xl:w-[20rem] 2xl:w-[28rem] bg-white lg:mt-9  rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-7">
                <h2 style={{ color: '#00006B' }} className="text-xl sm:text-2xl lg:text-xl font-bold">Add Supplier</h2>
                <button
                    style={{ color: '#00006B' }} className="font-bold text-xl sm:text-2xl"
                    onClick={toggleForm}
                >
                    <IoCloseSharp />
                </button>
            </div>

            <form className="space-y-9 lg:space-y-6 text-zinc-400" onSubmit={handleSubmit}>
                <div className="flex  justify-center" style={styles.fileUploadWrapper}>
                    <label htmlFor="photo" className="relative cursor-pointer" style={styles.fileUploadLabel}>
                        {
                            imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="min-w-10 min-h-15 rounded-full object-cover" />
                            ) : (
                                <div className="">
                                    <img src={profile} alt="" className="w-15 h-15 rounded-full object-cover" />
                                </div>
                            )
                        }
                        <span className="absolute  bg-[#D4E7FF] bottom-0 right-0 p-1 rounded-full" style={styles.addBtn}>
                            <RiPencilLine />
                        </span>
                    </label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handleFileChange}
                        style={styles.hiddenFileInput}
                        accept="image/*"
                    />
                </div>
                {[
                    { label: "Supplier Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Phone No", name: "contact", type: "text" },
                    { label: "GST No", name: "gstno", type: "text" },
                    { label: "Address", name: "address", type: "text" },
                ].map(({ label, name, type }) => (
                    <div key={name} className="relative">
                        <label className="absolute -top-4 pb-1 bg-white left-6 block text-sm">{label}:</label>
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 lg:p-3 border focus:border-2 border-gray-300 rounded-md focus:ring-[#00006B] focus:border-[#00006B] text-sm sm:text-base"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full p-2 lg:p-4 bg-[#00006B] hover:bg-blue-900 text-white font-semibold rounded-md transition duration-300 ease-in-out"
                    style={styles.submitBtn}
                >
                    Add Supplier
                </button>
            </form>
        </div>
    );
};


const styles = {
    fileUploadWrapper: {
        display: 'flex',
        flexDirection: "column",
        alignItems: 'flex-start',
    },
    fileUploadLabel: {
        height: "60px",
        width: "60px",
        backgroundColor: '#EADDFF',
        color: "#4F378A",
        borderRadius: '50%',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease'
    },
    addBtn: {
        padding: '3px',
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        fontSize: '25px', display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#00006B",
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px - 12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px - 18px inset'
    },
    hiddenFileInput: {
        display: 'none'
    },
    submitBtn: {
        color: 'white',
        borderRadius: '8px',
        width: '100%',

    }
}

export default AddSupplier;