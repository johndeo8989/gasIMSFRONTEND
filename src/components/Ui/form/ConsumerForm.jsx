import React, { useRef, useState } from "react";
import { CiUser } from "react-icons/ci";
import { RiPencilLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import { handleSuccess } from "../../../utils/utils";
import { fetchConsumer } from "../../../redux/slices/customerSlice";
import { useDispatch } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import SearchBar from "../SearchBar/SearchBar";
import { IoMdArrowBack, IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const AddConsumer = () => {
    const { toggleForm } = useFormContext();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        cardNo: "",
        address: "",
        consumerNo: "",
        profilePic: null,
        aadharno: '',
        agency: '',
        customerType: "",
        rationCard: null,
        aadharCard: null,
        panCard: null,
        license: null,
    });
    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState({
        profilePic: null,
        bankPassbook: null,
        gasPassbook: null,
        rationCard: null,
        aadharCard: null,
        panCard: null,
        license: null,
        passport: null
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e, fieldName) => {
        const files = Array.from(e.target.files);
        switch (fieldName) {
            case "profilePic":
                {
                    const profileFile = files[0];
                    if (profileFile && profileFile.type.startsWith('image/')) {
                        const profilePreviewUrl = URL.createObjectURL(profileFile);
                        setImagePreview(prev => ({ ...prev, [fieldName]: profilePreviewUrl }));
                        setFormData(prev => ({ ...prev, profilePic: profileFile }));
                    }
                    break;
                }

            case "bankPassbook":
                {
                    const bankPassbookFile = files[0];
                    if (bankPassbookFile) {
                        setFormData(prev => ({ ...prev, bankPassbook: bankPassbookFile }));
                        const previewUrl = URL.createObjectURL(bankPassbookFile);
                        setImagePreview(prev => ({ ...prev, bankPassbook: previewUrl }));
                    }
                    break;
                }

            case "gasPassbook":
                {
                    const gasPassbookFile = files[0];
                    if (gasPassbookFile) {
                        setFormData(prev => ({ ...prev, gasPassbook: gasPassbookFile }));
                        const previewUrl = URL.createObjectURL(gasPassbookFile);
                        setImagePreview(prev => ({ ...prev, gasPassbook: previewUrl }));
                    }
                    break;
                }


            case "panCard":
                {
                    const panCardFile = files[0];
                    if (panCardFile) {
                        setFormData(prev => ({ ...prev, panCard: panCardFile }));
                        const profilePreviewUrl = URL.createObjectURL(panCardFile);
                        setImagePreview(prev => ({
                            ...prev, [fieldName]: profilePreviewUrl
                        }))
                    }
                    break;
                }
            case "license":
                {
                    const licenseFile = files[0];
                    if (licenseFile) {
                        setFormData(prev => ({ ...prev, license: licenseFile }));

                        const profilePreviewUrl = URL.createObjectURL(licenseFile);
                        setImagePreview(prev => ({
                            ...prev, [fieldName]: profilePreviewUrl
                        }))
                    }
                    break;
                }
            case "aadharCard":
                {
                    const aadharFile = files[0];
                    if (aadharFile) {
                        setFormData(prev => ({ ...prev, aadharCard: aadharFile }));

                        const profilePreviewUrl = URL.createObjectURL(aadharFile);
                        setImagePreview(prev => ({
                            ...prev, [fieldName]: profilePreviewUrl
                        }))
                    }
                    break;
                }

            case "rationCard":
                {
                    const rationFile = files[0];
                    if (rationFile) {
                        setFormData(prev => ({ ...prev, rationCard: rationFile }));
                        const profilePreviewUrl = URL.createObjectURL(rationFile);
                        setImagePreview(prev => ({
                            ...prev, [fieldName]: profilePreviewUrl
                        }))
                    }
                    break;
                }
            case "passport":
                {
                    const passportFile = files[0];
                    if (passportFile) {
                        setFormData(prev => ({ ...prev, rationCard: passportFile }));
                        const profilePreviewUrl = URL.createObjectURL(passportFile);
                        setImagePreview(prev => ({
                            ...prev, [fieldName]: profilePreviewUrl
                        }))
                    }
                    break;
                }
            default:
                setFormData(prev => ({ ...prev, [fieldName]: files[0] }));
                break;
        }
    }

    console.log(formData)
    const [docFieldName, setDocFieldName] = useState('aadharCard');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append regular fields
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("contact", formData.contact);
        data.append("cardNo", formData.cardNo);
        data.append("address", formData.address);
        data.append("aadharno", formData.aadharno);
        data.append('consumerNo', formData.consumerNo);
        data.append('customerType', formData.customerType)
        data.append('agency', formData.agency)
        // Append file fields if they exist
        if (formData.profilePic) data.append("profilePic", formData.profilePic);
        if (formData.passbook) data.append("passbook", formData.passbook);
        if (formData.bankPassbook) data.append("bankPassbook", formData.bankPassbook);
        if (formData.rationCard) data.append("rationCard", formData.rationCard);
        if (formData.aadharCard) data.append("aadharCard", formData.aadharCard);
        if (formData.panCard) data.append("panCard", formData.panCard);
        if (formData.license) data.append("license", formData.license);

        try {
            const res = await axios.post("http://localhost:8080/consumer/add", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("✅ Success:", res.data);
            handleSuccess("Consumer added!");
            dispatch(fetchConsumer());
            toggleForm();
            navigate('/customer')
        } catch (err) {
            console.error("❌ Error submitting form:", err.response?.data || err.message);
        }
    };


    const fileInputRef = useRef();

    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const navigate = useNavigate();

    return (
        <div className="mt-5 sm:mt-10 sm:px-5">
            <div className="flex items-center  gap-1.5 sm:gap-2.5 mb-3 py-1 sm:px-4 sm:py-1.5 rounded justify-between">
                <div className="flex gap-3 items-center text-xs sm:text-shadow-md ">
                    <button
                        onClick={() => navigate('/customer')}
                        className="bg-[#eaeaea] border-1 border-[#bdbdbd] text-[#575757] rounded-lg w-[30px] h-[30px] sm:w-[50px] sm:h-[40px] flex items-center justify-center hover:bg-[#d6d6d6] transition-colors duration-300"
                    >
                        <IoMdArrowBack className="text-xl font-bold min-w-[100px]" />
                    </button>
                    <div className="flex justify-between items-center ">
                        <h2 style={{ color: '#00006B' }} className="text-md sm:text-2xl lg:text-xl font-bold">Add Consumer</h2>
                    </div>
                </div>
                <div className="sm:w-[400px] items-center p-1 flex justify-between bg-white  border-[#ccc] rounded-[5px]  sm:h-[40px] ">
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={'handleSearchChange'}
                        className=" bg-white w-full h-full text-sm rounded-sm outline-none z-10 px-2"
                    />
                    <IoMdSearch className="bg-white h-full rounded-lg   text-2xl font-bold  right-2 z-20" />
                </div>
            </div>
            <div className="mb-5 mt-1 sm:p-4 lg:p-6 rounded-lg ">
                <form className="space-y-4 lg:space-y-6 bg-white p-2 text-zinc-400" onSubmit={handleSubmit}>
                    <h1 className="text-zinc-700 text-lg font-bold">Please select your document</h1>
                    <div className="flex flex-wrap justify-start space-x-3 text-zinc-600">
                        {[
                            { name: 'Aadhar Card', valueOf: 'aadharCard' },
                            { name: 'Bank Passbook', valueOf: 'bankPassbook' },
                            { name: 'Gas Passbook', valueOf: 'gasPassbook' },
                            { name: 'Ration Card', valueOf: 'rationCard' },
                            { name: 'Pan Card', valueOf: 'panCard' },
                            { name: 'License', valueOf: 'license' },
                            { name: 'Passport', valueOf: 'passport' }
                        ].map((field, index) => (
                            <label
                                key={index}
                                className={`flex font-semibold items-center space-x-1 p-1 rounded-md text-[10px] md:text-base cursor-pointer 
                                ${docFieldName === field.valueOf ? ' text-[#00006B]' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="docField"
                                    value={field.valueOf}
                                    checked={docFieldName === field.valueOf}
                                    onChange={(e) => setDocFieldName(e.target.value)}
                                    className="accent-[#00006B]"
                                />
                                <span>{field.name}</span>
                                {

                                    field.valueOf === 'aadharCard' && <span className="text-red-600">*</span>

                                }
                                {
                                    field.valueOf === 'bankPassbook' && <span className="text-red-600">*</span>
                                }

                            </label>
                        ))}
                    </div>


                    <div
                        onClick={handleDivClick}
                        className={`cursor-pointer border-2 border-dashed rounded-md ${imagePreview.aadharCard ? 'h-65 bg-white' : 'bg-white h-25 sm:h-40'} flex flex-col items-center justify-center`}
                    >
                        <div className="text-center text-zinc-800 text-xs sm:text-2xl font-bold">
                            <IoCloudUploadOutline className=" text-lg sm:text-4xl w-full" />
                            Drop files to begin upload, or <span className="underline text-violet-500">browse</span>
                        </div>

                        <input
                            type="file"
                            id="documents"
                            multiple
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e, `${docFieldName}`)}
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />

                        {Object.values(imagePreview).some(Boolean) && (
                            <div className="flex w-full flex-wrap items-center gap-6 mt-8 p-2 justify-center">
                                {imagePreview.bankPassbook && (
                                    <div className="text-center">
                                        <img src={imagePreview.bankPassbook} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>Bank Passbook</p>
                                    </div>
                                )}
                                {imagePreview.gasPassbook && (
                                    <div className="text-center">
                                        <img src={imagePreview.gasPassbook} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>Gas Passbook</p>
                                    </div>
                                )}
                                {imagePreview.rationCard && (
                                    <div className="text-center">
                                        <img src={imagePreview.rationCard} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>Ration Card</p>
                                    </div>
                                )}
                                {imagePreview.aadharCard && (
                                    <div className="text-center">
                                        <img src={imagePreview.aadharCard} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>Aadhar Card</p>
                                    </div>
                                )}
                                {imagePreview.panCard && (
                                    <div className="text-center">
                                        <img src={imagePreview.panCard} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>Pan Card</p>
                                    </div>
                                )}
                                {imagePreview.license && (
                                    <div className="text-center">
                                        <img src={imagePreview.license} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>License</p>
                                    </div>
                                )}
                                {imagePreview.passport && (
                                    <div className="text-center">
                                        <img src={imagePreview.passport} alt="Preview" className="w-6 h-6 md:w-10 md:h-10 object-cover" />
                                        <p>Passport</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <p className="text-zinc-700 text-sm sm:text-lg font-bold">Add customer Details</p>
                        <div className=" p-1  grid grid-cols-1 sm:grid-cols-2 mt-2 lg:grid-cols-3 xxl:grid-cols-4 gap-5 sm:gap-y-8">
                            <div className="flex items-center gap-4" style={styles.fileUploadWrapper}>
                                <label htmlFor="photo" className="relative cursor-pointer" style={styles.fileUploadLabel}>
                                    {
                                        imagePreview.profilePic ? (
                                            <img src={imagePreview.profilePic} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                                        ) : (
                                            <div className="">
                                                <img src={'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain'} alt="" className=" rounded-full object-cover" />
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
                                    onChange={(e) => handleFileChange(e, "profilePic")}
                                    style={styles.hiddenFileInput}
                                    accept="image/*"
                                />
                                <p className="font-bold text-xs sm:text-md">Upload profile picture</p>
                            </div>
                            {[
                                { label: "Consumer Name", name: "name", type: "text" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Address", name: "address", type: "text" },
                                { label: "Phone No", name: "contact", type: "text" },
                                { label: "Aadhar No", name: "aadharno", type: "text" },
                                { label: "Card No", name: "cardNo", type: "text" },
                                { label: "Consumer No", name: "consumerNo", type: "text" },
                                { label: "Register Agency", name: 'agency', type: 'select', options: ['Domestic Agency', 'Commercial Agency'] },
                                { label: "Consumer Type", name: 'customerType', type: 'select', options: ['Ujawala', 'Regular', 'Commercial', 'Distributor'] },
                                { label: "Safety & KYC", name: 'kyc', type: 'select', options: ['Yes', 'No'] },
                            ].map(({ label, name, type, options }) => (
                                <div key={name} className="relative ">
                                    <label className="absolute -top-1 sm:-top-4 pb-1 bg-white px-2 left-6 block text-xs sm:text-sm">{label}:</label>
                                    {
                                        type === 'select' ?
                                            <select name={name} className="mt-1 block w-full p-2 sm:p-3 lg:p-2  border border-gray-300 rounded-md focus:ring-[#00006B] focus:border-[#00006B] text-sm sm:text-base" onChange={handleChange} value={formData[name]}>
                                                {
                                                    options &&
                                                    options.map((opt, idx) => (
                                                        <option key={idx} value={opt}>{opt}</option>

                                                    ))
                                                }
                                            </select>
                                            : <input
                                                type={type}
                                                name={name}
                                                value={formData[name]}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 block w-full p-2 sm:p-3 lg:p-2 border border-gray-300 rounded-md focus:ring-[#00006B] focus:border-2 focus:border-[#00006B] text-sm sm:text-base"
                                            />
                                    }
                                </div>
                            ))}
                            <div className="">
                                <button
                                    type="submit"
                                    className="w-full p-2 lg:p-3 bg-[#00006b] hover:bg-blue-800 text-white font-semibold rounded-md transition duration-300 ease-in-out"
                                    style={styles.submitBtn}
                                >
                                    Add Consumer
                                </button>
                            </div>
                        </div>
                    </div>
                </form >
            </div ></div >
    );
};
const styles = {
    fileUploadWrapper: {
        display: 'flex',
        alignItems: 'center',
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

export default AddConsumer;
