import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import UserPng from "../../assets/user.png";
import { FaRegEdit } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/getuser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.user);
      console.log(res.data.user);
      setFormData(res.data.user);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }
    console.log("submit data", formData)
    try {
      await axios.put("http://localhost:8080/auth/updateuser", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsEditOpen(false);
      fetchUser();
    } catch (err) {
      console.error("Error updating user", err);
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      handleSuccess('User Logged Out');
      setTimeout(() => {
          navigate('/login')
      }, 1000);
  }

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-pic flex items-center justify-center">
          <img
            src={user.photo || UserPng}
            alt="Profile"
            className="profile-photo"
            style={{ background: "#eee" }}
          />
        </div>
        <div className="profile-info">
          <ProfileRow label="Name" value={user.name} />
          <ProfileRow label="Email" value={user.email} />
          {user.phone && <ProfileRow label="Contact No." value={user.phone} />}
          {user.gender && <ProfileRow label="Gender" value={user.gender} />}
          {user.address && <ProfileRow label="Address" value={user.address} />}
          {user.dob && <ProfileRow label="Date of Birth" value={user.dob.split('T')[0]} />}
          <ProfileRow label="Position" value={user.role} />
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">
            Log out
          </button>
          <button onClick={() => setIsEditOpen(true)} className="edit-btn">
            <span>
              <FaRegEdit />
            </span>
            Edit
          </button>
        </div>
      </div>

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit} className="edit-form">
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                Update Profile
              </h2>
              <Input
                label="Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              </div>
              <Input
                label="Address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
              <Input
                label="Date of Birth"
                name="dob"
                value={formData.dob ? formData.dob.split("T")[0] : ""}
                onChange={handleChange}
                type="date"
              />
              
              <div className="file-upload-container">
                <label htmlFor="photo" className="upload-label flex">
                  <span className="upload-icon" style={{ fontSize: "24px" }}>
                    <MdFileUpload />
                  </span>{" "}
                  Upload Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleChange}
                  className="file-input"
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

      )}
    </div>
  );
};


const ProfileRow = ({ label, value }) => (
  <p className="profile-row">
    <span className="label">{label}:</span> <span className="val">{value}</span>
  </p>
);

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={type !== "file" ? value : undefined}
      onChange={onChange}
    />
  </div>
);


export default Profile;
