import React, { useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../axios/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { AuthRequest, AuthResponse } from "../../types/apiTypes"; // ✅ Import from apiTypes.ts

// Define API error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // State for form data
  const [formData, setFormData] = useState<AuthRequest>({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  // Mutation for login API call
  const loginMutation = useMutation<AuthResponse, ApiError, AuthRequest>({
    mutationFn: async (reqData) => {
      const response = await login(reqData); 
      return response.data; // ✅ Extracts `data` from `AxiosResponse<AuthResponse>`
    },
    onSuccess: (user) => {
      dispatch(setUser(user)); // ✅ `user` is now `AuthResponse`, not `AxiosResponse`
      navigate("/");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Login failed!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Employee Email
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
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
            Password
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Enter password"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
