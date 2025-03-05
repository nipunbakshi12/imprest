import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFunds = 500000; // Initial funds for each manager

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [department, setDepartment] = useState("");
    const [funds, setFunds] = useState(initialFunds);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "Manager") {
            navigate("/");
            return;
        }

        setDepartment(user.department);
        console.log("Manager Department:", user.department);

        // Get manager's funds from localStorage
        const allBalances = JSON.parse(localStorage.getItem("balances")) || {};
        if (allBalances[user.department]) {
            setFunds(allBalances[user.department]); // Load the current balance for the department
        }

        // Get all requests and filter based on department
        const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
        console.log("All Requests:", storedRequests);

        const departmentRequests = storedRequests.filter(req =>
            req.department.trim().toLowerCase() === user.department.trim().toLowerCase()
        );

        console.log("Filtered Requests:", departmentRequests);
        setRequests(departmentRequests);
    }, [navigate]);

    const handleUrgentFunds = () => {
        alert("Request Sent");

        const newNotification = {
            department,
            message: `${department} department needs urgent funds!`,
            date: new Date().toLocaleString(),
        };

        const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        notifications.push(newNotification);
        localStorage.setItem("notifications", JSON.stringify(notifications));
    };

    const handleAction = (index, action) => {
        let updatedRequests = [...requests];
        const requestAmount = parseInt(updatedRequests[index].amount);

        if (action === "approve") {
            if (funds >= requestAmount) {
                updatedRequests[index].status = "Approved";
                setFunds((prevFunds) => prevFunds - requestAmount);
            } else {
                alert("Insufficient funds to approve this request.");
                return;
            }
        } else {
            updatedRequests[index].status = "Rejected";
        }

        setRequests(updatedRequests);

        // Update the global requests in localStorage
        const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
        const updatedAllRequests = allRequests.map(req =>
            req.description === updatedRequests[index].description &&
                req.department === updatedRequests[index].department
                ? updatedRequests[index]
                : req
        );

        localStorage.setItem("requests", JSON.stringify(updatedAllRequests));

        // Update balances in localStorage
        const allBalances = JSON.parse(localStorage.getItem("balances")) || {};
        allBalances[department] = funds - (action === "approve" ? requestAmount : 0);
        localStorage.setItem("balances", JSON.stringify(allBalances));

        // Update approved requests in Admin Dashboard
        if (action === "approve") {
            const approvedRequests = JSON.parse(localStorage.getItem("approvedRequests")) || [];
            approvedRequests.push(updatedRequests[index]);
            localStorage.setItem("approvedRequests", JSON.stringify(approvedRequests));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto text-black">
            <h2 className="text-2xl font-bold mb-4 text-center">MANAGER'S DASHBOARD - ({department})</h2>
            <div className="flex justify-between items-center p-4 bg-gray-200 rounded">
                <span className="text-lg font-bold">Current Balance: ₹{funds}</span>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleUrgentFunds}>
                    Urgent Funds Needed
                </button>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-bold">Pending Requests</h3>
                <table className="w-full border-collapse border border-gray-300 mt-2">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Urgency</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-red-500 font-bold">
                                    No Requests Found
                                </td>
                            </tr>
                        ) : (
                            requests.filter(req => req.status === "Pending").map((req, index) => (
                                <tr key={index} className="border text-center">
                                    <td className="border p-2">{req.description}</td>
                                    <td className="border p-2">₹{req.amount}</td>
                                    <td className="border p-2">{req.urgency}</td>
                                    <td className="border p-2">
                                        <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={() => handleAction(index, "approve")}>
                                            ✔
                                        </button>
                                        <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleAction(index, "reject")}>
                                            ✖
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerDashboard;
