import axios from "axios";
import React, { useState, useEffect } from "react";

const RaiseRequest = () => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [urgency, setUrgency] = useState("Routine");
    const [department, setDepartment] = useState("");
    const [requests, setRequests] = useState([]);
    const [departments, setDepartments] = useState(["HR", "Finance", "IT", "Operations"]); // Add your department names

    const [isMultiLevel, setIsMultiLevel] = useState(false);
    const [multiLevelData, setMultiLevelData] = useState({
        name: "",
        managerName: "",
        phone: "",
        employeeID: ""
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role !== "Employee") {
            return;
        }
        setDepartment(user.department || ""); // Default to the user's department

        const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
        setRequests(storedRequests.filter(req => req.department === user.department));
    }, []);

    const validateForm = () => {
        const { name, managerName, phone, employeeID } = multiLevelData;

        if (!name || !managerName || !phone || !employeeID) {
            alert("Please fill in all the fields.");
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            alert("Phone number must be exactly 10 digits.");
            return false;
        }
        if (!/^\d{7}$/.test(employeeID)) {
            alert("Employee ID must be exactly 7 digits.");
            return false;
        }
        return true;
    };

    // Handle Multi-Level Request Submission
    const handleMultiLevelSubmit = () => {
        if (!validateForm()) return;

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const multiLevelRequest = {
            description,
            amount,
            department: user.department,
            urgency,
            status: "Pending",
            ...multiLevelData // Store additional form data
        };

        const multiRequests = JSON.parse(localStorage.getItem("multiLevelRequests")) || [];
        multiRequests.push(multiLevelRequest);
        localStorage.setItem("multiLevelRequests", JSON.stringify(multiRequests));

        setIsMultiLevel(false);
        setDescription("");
        setAmount("");
        setMultiLevelData({ name: "", managerName: "", phone: "", employeeID: "" });

        alert("Multi-Level Request Submitted Successfully!");
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const user = JSON.parse(localStorage.getItem("user"));
    //     if (!user || !user.department) {
    //         alert("User department is missing. Please log in again.");
    //         return;
    //     }

    //     const numericAmount = parseFloat(amount); // Convert amount to a number
    //     if (isNaN(numericAmount) || numericAmount <= 0) {
    //         alert("Please enter a valid positive amount.");
    //         return;
    //     }

    //     const newRequest = {
    //         description,
    //         amount: numericAmount,  // Store as a number
    //         department: user.department,
    //         urgency,
    //         status: "Pending"
    //     };

    //     const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
    //     allRequests.push(newRequest);
    //     localStorage.setItem("requests", JSON.stringify(allRequests));

    //     console.log("Updated Requests:", allRequests);

    //     setRequests(allRequests.filter(req => req.department === user.department));
    //     setDescription("");
    //     setAmount(""); // Reset amount field

    //     alert("Request Submitted Successfully!");
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.get("http://localhost:5000/api/imprest/getAllImprest")
        console.log("Request Submitted", res);
    }
    return (
        <div className="p-6 max-w-2xl mx-auto text-black">
            <h2 className="text-2xl font-bold mb-4 text-center">Raise Request</h2>
            <form className="mb-6" onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-2 border rounded mb-4 text-black"
                    placeholder="Enter request description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <input
                    type="number"
                    className="w-full p-2 border rounded mb-4 text-black"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <select
                    className="w-full p-2 border rounded mb-4 text-black"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
                <select className="w-full p-2 border rounded mb-4 text-black" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                    <option>Routine</option>
                    <option>Priority</option>
                    <option>Urgency</option>
                </select>
                <button className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Submit Request</button>
            </form>
            <h3 className="text-lg font-bold mb-2">Previous Requests</h3>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Department</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Urgency</th>
                        <th className="border p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req, index) => (
                        <tr key={index} className="text-center border">
                            <td className="border p-2">{req.department}</td>
                            <td className="border p-2">{req.description}</td>
                            <td className="border p-2">{req.amount}</td>
                            <td className="border p-2">{req.urgency}</td>
                            <td className={`border p-2 font-bold ${req.status === "Approved" ? "text-green-600" : req.status === "Rejected" ? "text-red-600" : ""}`}>
                                {req.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Multi-Level Request Pop-Up */}
            {isMultiLevel && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Multi-Level Request Details</h3>
                        <input className="w-full p-2 border mb-2" placeholder="Enter Your Name" onChange={(e) => setMultiLevelData({ ...multiLevelData, name: e.target.value })} required />
                        <input className="w-full p-2 border mb-2" placeholder="Manager's Name" onChange={(e) => setMultiLevelData({ ...multiLevelData, managerName: e.target.value })} required />
                        <input className="w-full p-2 border mb-2" placeholder="Phone Number" onChange={(e) => setMultiLevelData({ ...multiLevelData, phone: e.target.value })} required />
                        <input className="w-full p-2 border mb-4" placeholder="Employee ID (7 digits)" onChange={(e) => setMultiLevelData({ ...multiLevelData, employeeID: e.target.value })} required />
                        <button className="w-full bg-green-500 text-white p-2 rounded" onClick={handleMultiLevelSubmit}>Submit Multi-Level Request</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RaiseRequest;
