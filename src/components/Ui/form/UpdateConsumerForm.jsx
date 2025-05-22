import React, { useEffect, useRef, useState } from "react";
import { CiUser } from "react-icons/ci";
import { RiPencilLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useFormContext } from "../../../context/DisplayForm/FormContext";
import { handleSuccess } from "../../../utils/utils";
import { fetchConsumer } from "../../../redux/slices/customerSlice";
import { useDispatch } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdArrowBack, IoMdSearch } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

const UpdateConsumerForm = () => {
    const { toggleForm } = useFormContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        cardNo: "",
        address: "",
        consumerNo: "",
        profilePic: null,
        aadharno: '',
        rationCard: null,
        aadharCard: null,
        panCard: null,
        license: null,
    });

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

    const { id } = useParams()


    function makeGetRequest(path) {
        axios.get(path).then(
            (response) => {
                var result = response.data.consumer;
                setFormData({
                    ...result
                })
                setImagePreview({
                    profilePic: `http://localhost:8080/uploads/${result.profilePic}`,
                    bankPassbook: `http://localhost:8080/uploads/${result.bankPassbook}`,
                    gasPassbook: `http://localhost:8080/uploads/${result.gasPassbook}`,
                    rationCard: `http://localhost:8080/uploads/${result.rationCard}`,
                    aadharCard: `http://localhost:8080/uploads/${result.aadharCard}`,
                    panCard: `http://localhost:8080/uploads/${result.panCard}`,
                    license: `http://localhost:8080/uploads/${result.license}`,
                    passport: `http://localhost:8080/uploads/${result.passbook}`
                })
                console.log(result);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    useEffect(() => {
        makeGetRequest(`http://localhost:8080/get/consumer/${id}`)
        window.scrollTo(0, 0)
    }, [])


    console.log(formData, 'fatahho')



    const dispatch = useDispatch();

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
    console.log(imagePreview)
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

        data.append("profilePic", formData.profilePic);
        data.append("passbook", formData.passbook);
        data.append("bankPassbook", formData.bankPassbook);
        data.append("rationCard", formData.rationCard);
        data.append("aadharCard", formData.aadharCard);
        data.append("panCard", formData.panCard);
        data.append("license", formData.license);

        try {
            const res = await axios.put(`http://localhost:8080/update/consumerinfo/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("✅ Success:", res.data);
            handleSuccess("Consumer Details Updated!");
            dispatch(fetchConsumer());
            toggleForm();
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

    return (
        <div className="mt-10 px-2 sm:px-5">
            <div className="flex items-center  gap-1.5 sm:gap-2.5 mb-3 py-1 sm:px-4 sm:py-1.5 rounded justify-between">
                <div className="flex gap-3 items-center text-xs sm:text-shadow-md ">
                    <button
                        onClick={() => navigate('/customer')}
                        className="bg-[#eaeaea] border-1 border-[#bdbdbd] text-[#575757] rounded-lg w-[30px] h-[30px] sm:w-[50px] sm:h-[40px] flex items-center justify-center hover:bg-[#d6d6d6] transition-colors duration-300"
                    >
                        <IoMdArrowBack className="text-xl font-bold min-w-[100px]" />
                    </button>
                    <div className="flex justify-between items-center ">
                        <h2 style={{ color: '#00006B' }} className="text-md sm:text-2xl lg:text-xl font-bold">Update Consumer</h2>
                    </div>
                </div>
                <div className="w-[180px] sm:w-[400px] items-center p-1 flex justify-between bg-white  border-[#ccc] rounded-[5px]  sm:h-[40px] ">
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
                        className={`cursor-pointer border-2 border-dashed rounded-md ${imagePreview.aadharCard ? 'h-95 bg-gray-50' : ' h-25 sm:h-40'} flex flex-col items-center justify-center`}
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
                                {[
                                    { key: "bankPassbook", label: "Bank Passbook" },
                                    { key: "gasPassbook", label: "Gas Passbook" },
                                    { key: "rationCard", label: "Ration Card" },
                                    { key: "aadharCard", label: "Aadhar Card" },
                                    { key: "panCard", label: "Pan Card" },
                                    { key: "license", label: "License" },
                                    { key: "passport", label: "Passport" },
                                ].map(({ key, label, }) => (
                                    imagePreview[key] && (
                                        <div key={key} className="text-center flex flex-col items-center">
                                            <img
                                                src={imagePreview[key] === `http://localhost:8080/uploads/null` || imagePreview[key] === `http://localhost:8080/uploads/undefined` ? 'https://www.freeiconspng.com/thumbs/document-icon/document-icon-26.png' : imagePreview[key]}
                                                className={`object-cover  w-20 h-10`}
                                            />
                                            <p>{label}</p>
                                        </div>
                                    )
                                ))}
                            </div>

                        )}
                    </div>
                    <div className="mt-3">
                        <p className="text-zinc-700 text-sm sm:text-lg font-bold">Add customer Details</p>
                        <div className=" p-1  grid grid-cols-1 sm:grid-cols-2 mt-2 lg:grid-cols-3 xxl:grid-cols-4 gap-5 sm:gap-y-8">
                            <div className="flex items-center gap-4" style={styles.fileUploadWrapper}>
                                <label htmlFor="photo" className="relative cursor-pointer" style={styles.fileUploadLabel}>
                                    {
                                        imagePreview.profilePic !== 'http://localhost:8080/uploads/default-profile-pic.jpg' ? (
                                            <img src={imagePreview.profilePic} alt="Preview" className="h-full rounded-full object-cover" />
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
                                { label: "Consumer Type", name: 'consumer', type: 'select', options: ['Ujawala', 'Regular', 'Commercial', 'Distributor'] },
                                { label: "Safety & KYC", name: 'kyc', type: 'select', options: ['Yes', 'No'] },
                            ].map(({ label, name, type, options }) => (
                                <div key={name} className="relative ">
                                    <label className="absolute -top-2 sm:-top-4 pb-1 bg-white left-6 block text-xs sm:text-sm">{label}:</label>
                                    {
                                        type === 'select' ?
                                            <select className="mt-1 block w-full p-2 sm:p-3 lg:p-2  border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
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
                                                className="mt-1 block w-full p-2 sm:p-3 lg:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                            />
                                    }
                                </div>
                            ))}
                            <div className="">
                                <button
                                    type="submit"
                                    className="w-full text-sm sm:text-base p-2 lg:p-3 bg-[#00006B] hover:bg-[#17006b] text-white font-semibold rounded-md transition duration-300 ease-in-out"
                                    style={styles.submitBtn}
                                >
                                    Update Consumer
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

export default UpdateConsumerForm;
