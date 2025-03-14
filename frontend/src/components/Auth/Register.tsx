import React, { useState } from "react";
import { register } from "../../axios";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { RegisterRequest, RegisterResponse } from "../../types/apiTypes";
import { AxiosError, AxiosResponse } from "axios";

interface RegisterProps {
  setIsRegister: (value: boolean) => void;
}

const Register: React.FC<RegisterProps> = ({ setIsRegister }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (selectedRole: string) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };
  // ✅ Ensure the `register` function returns only `RegisterResponse`
const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response: AxiosResponse<RegisterResponse> = await register(data);
  return response.data; // ✅ Extract only the `data` field
};

const registerMutation = useMutation<RegisterResponse, AxiosError<{ message: string }>, RegisterRequest>({
  mutationFn: registerUser, // ✅ Uses the new function
  onSuccess: (res) => {
    enqueueSnackbar(res.message, { variant: "success" });
    setFormData({ name: "", email: "", phone: "", password: "", role: "" });

    setTimeout(() => {
      setIsRegister(false);
    }, 1500);
  },
  onError: (error) => {
    const message = error.response?.data?.message || "Registration failed!";
    enqueueSnackbar(message, { variant: "error" });
  },
});

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">
            Employee Name
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Employee Email
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter employee email"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Employee Phone
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter employee phone"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Password
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Choose your role
          </label>

          <div className="flex item-center gap-3 mt-4">
            {["Waiter", "Cashier", "Admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelection(role)}
                className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] ${
                  formData.role === role ? "bg-indigo-700" : ""
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Register;
