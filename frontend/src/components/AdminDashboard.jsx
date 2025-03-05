import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
    const [refillAmount, setRefillAmount] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("IT");
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [disbursedFunds, setDisbursedFunds] = useState([]);
    const [multiLevelRequests, setMultiLevelRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [balances, setBalances] = useState({});
    const [specialFunds, setSpecialFunds] = useState(10000000);
    const [activeTab, setActiveTab] = useState("approved");
    const departments = ["IT", "Finance", "Marketing", "HR"];

    useEffect(() => {
        const savedBalances = JSON.parse(localStorage.getItem("balances")) || {
            IT: 500000,
            Finance: 500000,
            Marketing: 500000,
            HR: 500000,
        };
        setBalances(savedBalances);

        setApprovedRequests(JSON.parse(localStorage.getItem("approvedRequests")) || []);
        setDisbursedFunds(JSON.parse(localStorage.getItem("disbursedFunds")) || []);
        setMultiLevelRequests(JSON.parse(localStorage.getItem("multiLevelRequests")) || []);
        setNotifications(JSON.parse(localStorage.getItem("notifications")) || []);
        setSpecialFunds(JSON.parse(localStorage.getItem("specialFunds")) || 10000000); // Load Special Funds
    }, []);

    const handleRefill = () => {
        if (!refillAmount || refillAmount <= 0) {
            alert("Please enter a valid refill amount.");
            return;
        }

        const newDisbursement = {
            department: selectedDepartment,
            amount: parseInt(refillAmount),
            date: new Date().toLocaleString(),
        };

        const updatedDisbursedFunds = [...disbursedFunds, newDisbursement];
        setDisbursedFunds(updatedDisbursedFunds);
        localStorage.setItem("disbursedFunds", JSON.stringify(updatedDisbursedFunds));

        const updatedBalances = {
            ...balances,
            [selectedDepartment]: (balances[selectedDepartment] || 0) + parseInt(refillAmount),
        };
        setBalances(updatedBalances);
        localStorage.setItem("balances", JSON.stringify(updatedBalances));

        setRefillAmount("");
        alert(`₹${refillAmount} refilled to ${selectedDepartment} successfully!`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto text-black">
            <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

            {/* Refill Funds Section */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Refill Funds</h3>
                <div className="mb-4">
                    <input
                        type="number"
                        className="w-full p-2 border rounded text-black"
                        placeholder="Enter refill amount"
                        value={refillAmount}
                        onChange={(e) => setRefillAmount(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        {departments.map((dept) => (
                            <option key={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    onClick={handleRefill}
                >
                    Refill Amount
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b mb-4">
                {["approved", "disbursed", "multi-level", "notifications"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === "approved" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Approved Requests</h3>
                        {approvedRequests.length === 0 ? (
                            <p>No approved requests.</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Department</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedRequests.map((req, index) => (
                                        <tr key={index} className="text-center border">
                                            <td className="border p-2">{req.department}</td>
                                            <td className="border p-2">₹{req.amount}</td>
                                            <td className="border p-2">{req.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === "disbursed" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Disbursed Funds</h3>
                        {disbursedFunds.length === 0 ? (
                            <p>No disbursed funds.</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Department</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disbursedFunds.map((fund, index) => (
                                        <tr key={index} className="text-center border">
                                            <td className="border p-2">{fund.department}</td>
                                            <td className="border p-2">₹{fund.amount}</td>
                                            <td className="border p-2">{fund.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === "multi-level" && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Multi-Level Requests</h3>
                        <p className="mb-4 font-bold">Special Funds Available: ₹{specialFunds}</p>

                        {multiLevelRequests.length === 0 ? (
                            <p className="mt-4">No multi-level requests raised.</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300 mt-4">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Department</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {multiLevelRequests.map((req, index) => (
                                        <tr key={index} className="text-center border">
                                            <td className="border p-2">{req.department}</td>
                                            <td className="border p-2">₹{req.amount}</td>
                                            <td className="border p-2">{req.date}</td>
                                            <td className="border p-2">
                                                <button
                                                    className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                                                    onClick={() => handleApproveRequest(index)}
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Urgent Fund Requests</h3>
                        {notifications.length === 0 ? (
                            <p>No urgent fund requests.</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Department</th>
                                        <th className="border p-2">Message</th>
                                        <th className="border p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((notification, index) => (
                                        <tr key={index} className="text-center border">
                                            <td className="border p-2">{notification.department}</td>
                                            <td className="border p-2">{notification.message}</td>
                                            <td className="border p-2">{notification.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}



            </div>
        </div>
    );
};

export default AdminDashboard;
