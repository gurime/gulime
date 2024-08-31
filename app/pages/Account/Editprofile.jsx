import React, { useState } from 'react';

const EditProfileModal = ({ userData, onSave, onClose }) => {
  const [editedData, setEditedData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={{padding:'1rem'}} className="form-group">
            <label  style={{color:'#000',padding:'2px'}} htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              value={editedData.firstName}
              onChange={handleChange}
            />
          </div>
          <div style={{padding:'1rem'}} className="form-group">
            <label  style={{color:'#000',padding:'2px'}} htmlFor="firstName">Last Name</label>
            <input
              id="firstName"
              name="firstName"
              value={editedData.lastName}
              onChange={handleChange}
            />
          </div>
          <div style={{padding:'1rem'}} className="form-group">
            <label style={{color:'#000',padding:'2px'}} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={editedData.email}
              onChange={handleChange}
            />
          </div>
          <div style={{padding:'1rem'}} className="form-group">
            <label  style={{color:'#000',padding:'2px'}} htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              value={editedData.phone}
              onChange={handleChange}
            />
          </div>
          <div style={{padding:'1rem'}} className="form-group">
            <label  style={{color:'#000',padding:'2px'}} htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={editedData.address}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">Save Changes</button>
            <button type="button" onClick={onClose} className="close-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;