import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        role: 'Employee',
        department: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.role === 'Manager' && !formData.department) {
            setError('Please select a department');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/imprest/login', formData);

            // Store token and user info in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Handle successful login (redirect based on role)
            switch (formData.role) {
                case 'Admin':
                    window.location.href = '/admin-dashboard';
                    break;
                case 'Manager':
                    window.location.href = '/manager-dashboard';
                    break;
                case 'Employee':
                    window.location.href = '/employee-dashboard';
                    break;
                default:
                    break;
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>SELECT ROLE</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                {formData.role === 'Manager' && (
                    <div className="form-group">
                        <label>CHOOSE DEPARTMENT</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">-- Select Department --</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="HR">HR</option>
                        </select>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;

















// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//     const [role, setRole] = useState("");
//     const [department, setDepartment] = useState("");
//     const navigate = useNavigate();

//     const roles = ["Employee", "Manager", "Admin"];
//     const departments = ["IT", "Finance", "Marketing", "HR"];

//     const handleRoleChange = (e) => {
//         console.log("user", e.target.value)
//         setRole(e.target.value);
//         setDepartment("");
//     };

//     const handleLogin = () => {
//         localStorage.setItem("user", JSON.stringify({ role, department }));

//         if (role === "Employee") {
//             navigate("/raise-request");
//         } else if (role === "Manager") {
//             navigate("/manager-dashboard");
//         } else if (role === "Admin") {
//             navigate("/admin-dashboard");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Login Page</h2>

//                 <label className="block mb-2 font-medium">SELECT ROLE</label>
//                 <select
//                     className="w-full p-2 border rounded mb-4"
//                     value={role}
//                     onChange={handleRoleChange}
//                 >
//                     <option value="">-- Select Role --</option>
//                     {roles.map((roleOption) => (
//                         <option key={roleOption} value={roleOption}>{roleOption}</option>
//                     ))}
//                 </select>

//                 {(role == "Manager") && (
//                     <>
//                         <label className="block mb-2 font-medium">CHOOSE DEPARTMENT</label>
//                         <select
//                             className="w-full p-2 border rounded mb-4"
//                             value={department}
//                             onChange={(e) => setDepartment(e.target.value)}
//                         >
//                             <option value="">-- Select Department --</option>
//                             {departments.map((dept) => (
//                                 <option key={dept} value={dept}>{dept}</option>
//                             ))}
//                         </select>
//                     </>
//                 )}

//                 <button
//                     className={`w-full p-2 text-white rounded ${(role === "Admin" || (role)) ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
//                     disabled={!(role === "Admin" || (role))}
//                     onClick={handleLogin}
//                 >
//                     Login
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
