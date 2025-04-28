import { useState } from 'react';

function EmailForm({ onNameChange, onEmailChange, name, email }) {
  return (
    <div>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="form-control"
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
    </div>
  );
}

export default function EmailModal({ isOpen, onClose, onSubmit, milestoneCount }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email) {
      alert("Please enter both name and email");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    onSubmit(name, email);
    setName('');
    setEmail('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Milestone Reached!</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p>Congratulations! You've reached the milestone of {milestoneCount} photos!</p>
          <p>Enter your details to receive a congratulatory email:</p>
          <EmailForm
            name={name}
            email={email}
            onNameChange={setName}
            onEmailChange={setEmail}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}