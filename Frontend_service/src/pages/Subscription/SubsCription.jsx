import React from "react";
import "./SubsCription.css";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        title: "Free Trial",
        price: "₹0",
        duration: "30 Days",
        features: ["All basic features", "No payment required", "Limited access"],
        badge: "Start Here",
    },
    {
        title: "Starter",
        price: "₹999",
        duration: "per year",
        features: ["500 Customers", "Full CRM", "Email Support"],
    },
    {
        title: "Growth",
        price: "₹1999",
        duration: "per year",
        features: ["1000 Customers", "Priority Support", "Advanced Tools"],
        badge: "Most Popular",
        highlight: true,
    },
    {
        title: "Pro",
        price: "₹2499",
        duration: "per year",
        features: ["1500 Customers", "All Features", "Premium Support"],
    },
];

const SubsCription = () => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate("/contact-us");
    };

    return (
        <div className="subscription-page">
            <div className="light-container">
                <h1 className="title">Upgrade Your Business</h1>

                <div className="card-wrapper">
                    {plans.map((plan, i) => (
                        <div
                            className={`card ${plan.highlight ? "highlight" : ""}`}
                            key={i}
                            onClick={handleCardClick}
                            style={{ cursor: "pointer" }} // 👈 important UX
                        >
                            {plan.badge && <span className="badge">{plan.badge}</span>}

                            <h2>{plan.title}</h2>

                            <div className="price-box">
                                <span className="price">{plan.price}</span>
                                <span className="duration">{plan.duration}</span>
                            </div>

                            <ul>
                                {plan.features.map((f, index) => (
                                    <li key={index}>✓ {f}</li>
                                ))}
                            </ul>

                            <button
                                className="btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // 🚫 prevent double trigger
                                    navigate("/contact-us");
                                }}
                            >
                                {plan.title === "Free Trial" ? "Start Free" : "Upgrade Now"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubsCription;