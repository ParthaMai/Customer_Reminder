import React, { useState } from 'react';
import './LandingPage.css';
import { assets } from '../../assets/assets';
import bill_icon from "../../assets/bill_icon.png"
import inventory_icon from "../../assets/inventory_icon.png"
import customer_icon from "../../assets/customer_icon.png"
import calls_icon from "../../assets/calls_icon.png"
import booking_icon from "../../assets/booking_icon.png"
import sale_icon from "../../assets/sale_icon.png"
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";



const features = [
    {
        title: "Billing & Invoicing",
        color: "blue",
        icon: bill_icon,
        items: [
            "Create Quotations & Proforma Invoices",
            "Manage Sales Invoices & Returns",
            "Handle Credit & Debit Notes",
            "Track Purchase & Sales Orders"
        ]
    },
    {
        title: "Inventory Management",
        color: "green",
        icon: inventory_icon,
        items: [
            "Auto Stock Update on Billing",
            "Real-time Stock Alerts & Reports",
            "Product Category Management",
            "Low Stock Notifications"
        ]
    },
    {
        title: "Customer Management",
        color: "orange",
        icon: customer_icon,
        items: [
            "Service History Tracking",
            "Last Service Date & Reminder",
            "Customer Contact & Address Management",
            "Call & Visit Logging"
        ]
    },
    {
        title: "Call & Reminders",
        color: "purple",
        icon: calls_icon,
        items: [
            "Manage Pending & Completed Calls",
            "Schedule Follow-up Reminders",
            "Convert Calls into Appointments",
            "Call History & Notes Tracking"
        ]
    },
    {
        title: "Smart Booking",
        color: "teal",
        icon: booking_icon,
        items: [
            "Instant Appointment Scheduling",
            "Flexible Date & Time Selection",
            "Send Booking Confirmation via SMS",
            "Track Upcoming & Completed Appointments"
        ]
    },
    {
        title: "Sales & Reports",
        color: "pink",
        icon: sale_icon,
        items: [
            "Track Today's Sales",
            "View Total Sales Records",
            "Customer Service History",
            "Daily Sales Overview"
        ]
    }
];

const LandingPage = () => {

    const [toggle, setToggle] = useState(false);
    const handleCall = () => {
        const number = toggle ? "9883737708" : "9735359121";

        window.location.href = `tel:${number}`;

        setToggle(!toggle);
    };

    useEffect(() => {
        const elements = document.querySelectorAll(".reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            {
                threshold: 0.15,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
    return (
        <div className="landing">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-text">
                        <h1>GROW Your Business <span>Smarter</span></h1>
                        <div className="hero-image-wrapper">
                            <div className="glass-card main-video">
                                <video
                                    src="https://res.cloudinary.com/dmos7gusc/video/upload/v1775905561/Promo_video_nb6v4j.mp4"
                                    autoPlay
                                    controls
                                    playsInline
                                />
                            </div>
                            <div className="floating-badge badge-1">📈 +24% Sales</div>
                            <div className="floating-badge badge-2">👥 1.2k New Users</div>
                        </div>
                        <p>
                            The all-in-one CRM solution for service businesses to manage customers, calls,
                            appointments, and sales in one place. Built to simplify daily operations and
                            improve service efficiency.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={handleCall}>Start Free Trial</button>
                            <button className="btn-secondary" onClick={handleCall}>View Live Demo</button>
                        </div>
                    </div>

                </div>
            </section>
            <div className="section-feature-header">
                <h2>All Features</h2>
                <p>From customer management to billing and scheduling—everything simplified.</p>
            </div>

            <div className="feature-container">
                {features.map((card, index) => (
                    <div className={`feature-card reveal ${card.color}`} key={index}>
                        <div className="card-header">
                            <div className="icon-box"><img src={card.icon} alt='' /></div>
                            <span className="badge">4 features</span>
                        </div>

                        <h3>{card.title}</h3>

                        <ul>
                            {card.items.map((item, i) => (
                                <li key={i}>
                                    <span className="check">✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="pricing-highlight-light">
                <div className="top-accent"></div>
                <span className="premium-label">Special Launch Pricing</span>
                <h2 className="main-price">
                    <span className="curr">₹</span>2
                    <span className="per">/ user / year</span>
                </h2>
                <p className="desc-text">
                    Simple, transparent pricing designed for <span className="bold-blue">growing service businesses</span>.
                </p>
                <div className="feature-badges">
                    <span>✓ Unlimited Leads</span>
                    <span>✓ Full Analytics</span>
                    <span>✓ 24/7 Support</span>
                </div>
            </div>
            {/* PRICING */}
            <section className="pricing reveal">
                <div className="container">
                    <div className="section-header">
                        <h2>Simple, Transparent Pricing</h2>
                    </div>

                    <div className="pricing-grid">

                        {/* Free Trial */}
                        <div className="price-card">
                            <div className="popular-tag">Start Here</div>
                            <h3>Free Trial</h3>
                            <div className="price">₹0<span>/15 Days</span></div>
                            <ul>
                                <li>All basic features</li>
                                <li>No payment required</li>
                                <li>Limited access</li>
                            </ul>
                            <button className="btn-outline" onClick={handleCall}>Start Free</button>
                        </div>

                        {/* Starter */}
                        <div className="price-card">
                            <h3>Starter</h3>
                            <div className="price">₹99<span>/per month</span></div>
                            <ul>
                                <li>500 Customers</li>
                                <li>Full CRM Access</li>
                                <li>Email Support</li>
                            </ul>
                            <button className="btn-outline" onClick={handleCall}>Choose Plan</button>
                        </div>

                        {/* Growth (Most Popular) */}
                        <div className="price-card highlight">
                            <div className="popular-tag">Most Popular</div>
                            <h3>Growth</h3>
                            <div className="price">₹149<span>/per month</span></div>
                            <ul>
                                <li>1500 Customers</li>
                                <li>Priority Support</li>
                                <li>Advanced Tools</li>
                            </ul>
                            <button className="btn-primary" onClick={handleCall}>Choose Plan</button>
                        </div>

                        {/* Pro */}
                        <div className="price-card">
                            <h3>Pro</h3>
                            <div className="price">₹299<span>/per month</span></div>
                            <ul>
                                <li>Unlimited Customers</li>
                                <li>All Features Included</li>
                                <li>Premium Support</li>
                            </ul>
                            <button className="btn-outline" onClick={handleCall}>Choose Plan</button>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <div className="cta-content">
                    <h2>Ready to transform your workflow?</h2>
                    <p>Join 1,000+ businesses growing with our Gromybusiness.com.</p>
                    <button className="btn-white" onClick={handleCall}>Get Started for Free</button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;