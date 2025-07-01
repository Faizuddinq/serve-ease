import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { login } from "../../https/index"
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
      mutationFn: (reqData) => login(reqData),
      onSuccess: (res) => {
          const { data } = res;
          console.log(data);
          const { _id, name, email, phone, role } = data.data;
          dispatch(setUser({ _id, name, email, phone, role }));
          navigate("/");
      },
      onError: (error) => {
        const { response } = error;
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    })

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
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

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
        >
          Sign in
        </button>
      </form>

      <div className="flex gap-4 m-4 flex flex-col justify-center items-center">
        <p className="text-sm text-[#ababab]">For demo/test purposes, you can use below credentials to login:</p>
        <div className="flex gap-4">

        <button
          type="button"
          className="bg-blue-400 text-black px-4 py-2 rounded font-bold"
          onClick={() =>
            setFormData({ email: "se-admin@gmail.com", password: "se-admin@gmail.com" })
          }
        >
          Use Admin Credentials to Login 
        </button>
        <button
          type="button"
          className="bg-green-400 text-black px-4 py-2 rounded font-bold"
          onClick={() =>
            setFormData({ email: "cashier-1@gmail.com", password: "cashier-1@gmail.com" })
          }
        >
          Use Cashier Credentials to Login
        </button>
        </div>
      </div>
    </div>

  );
};

export default Login;
