import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    const navigate = useNavigate();

    const roles = ["Employee", "Manager", "Admin"];
    const departments = ["IT", "Finance", "Marketing", "HR"];

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setDepartment("");
    };

    const handleLogin = () => {
        localStorage.setItem("user", JSON.stringify({ role, department }));

        if (role === "Employee") {
            navigate("/raise-request");
        } else if (role === "Manager") {
            navigate("/manager-dashboard");
        } else if (role === "Admin") {
            navigate("/admin-dashboard");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
                <h2 className="text-2xl font-bold mb-4 text-center">Login Page</h2>

                <label className="block mb-2 font-medium">SELECT ROLE</label>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={role}
                    onChange={handleRoleChange}
                >
                    <option value="">-- Select Role --</option>
                    {roles.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>{roleOption}</option>
                    ))}
                </select>

                {(role === "Employee" || role === "Manager") && (
                    <>
                        <label className="block mb-2 font-medium">CHOOSE DEPARTMENT</label>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">-- Select Department --</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </>
                )}

                <button
                    className={`w-full p-2 text-white rounded ${(role === "Admin" || (role && department)) ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                    disabled={!(role === "Admin" || (role && department))}
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
