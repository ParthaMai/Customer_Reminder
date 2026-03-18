import { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {

    const [selectedNumber, setSelectedNumber] = useState("");

    const supportNumbers = {
        mobile1: "9735359121",
        mobile2: "9883737708"
    };

    const [formData, setFormData] = useState({
        type: "",
        name: "",
        email: "",
        message: "",
        phone: "",
        shopName: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);
        alert("Request Sent Successfully!");

        setFormData({
            type: "",
            name: "",
            email: "",
            message: "",
            phone: "",
            shopName: ""
        });
    };

    // ✅ FIXED: Now outside
    const handleCall = () => {
        if (!selectedNumber) {
            alert("Please select a number first");
            return;
        }

        window.location.href = `tel:${selectedNumber}`;
    };


    return (
        <div className="contact-container">
            <h2>📩 Contact Support</h2>
            <p className="subtitle">
                Facing issues or need help? Select a reason and reach out to us.
            </p>
            {/* 🔥 Direct Call Section */}
            <div className="call-box">
                <p className="call-title">📞 Contact Directly</p>

                <div className="field">
                    <select
                        onChange={(e) => setSelectedNumber(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select number
                        </option>

                        {supportNumbers.mobile1 && (
                            <option value={supportNumbers.mobile1}>
                                Mobile 1 - {supportNumbers.mobile1}
                            </option>
                        )}

                        {supportNumbers.mobile2 && (
                            <option value={supportNumbers.mobile2}>
                                Mobile 2 - {supportNumbers.mobile2}
                            </option>
                        )}
                    </select>

                    <button className="call-btn" onClick={handleCall}>
                        📞 Call
                    </button>
                </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>

                <div className="divider">
                    <hr />
                    <span>OR</span>
                    <hr />
                </div>

                {/* Issue Type */}
                <label>Choose your request</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select an option --</option>
                    <option value="server">🚨 Server Error</option>
                    <option value="problem">⚠️ Report a Problem</option>
                    <option value="feature">✨ Request New Feature</option>
                    <option value="newUser">👤 Create New User</option>
                    <option value="forgot">🔑 Forgot Password</option>
                </select>

                {/* Name */}
                <label>Your Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                {/* Email */}
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {/* Dynamic Fields */}
                {formData.type === "newUser" && (
                    <>
                        <label>Customer Phone</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter customer phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <label>Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            placeholder="Enter shop name"
                            value={formData.shopName}
                            onChange={handleChange}
                        />
                    </>
                )}

                {formData.type === "forgot" && (
                    <>
                        <label>Registered Phone</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter registered phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </>
                )}

                {/* Message */}
                <label>Describe your issue</label>
                <textarea
                    rows="4"
                    name="message"
                    placeholder="Explain your problem clearly..."
                    value={formData.message}
                    onChange={handleChange}
                ></textarea>

                <button type="submit">Send Request 🚀</button>
            </form>
        </div>
    );
};

export default ContactUs;