import { useDispatch } from "react-redux";
import { getUserData } from "../axios"; // ✅ Ensure correct import
import { useEffect, useState, useRef } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../redux/store"; // ✅ Ensure proper typing
import { AuthResponse } from "../types/apiTypes"; // ✅ Import API response type
import { AxiosError } from "axios";

const useLoadData = (): boolean => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false); // ✅ Prevent multiple calls

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUser = async () => {
      try {
        const { data }: { data: AuthResponse } = await getUserData();
        console.log("User Data:", data);

        if (data.success && data.data) {
          const { id, name, email, phone, role } = data.data; // ✅ Extract relevant fields
          dispatch(setUser({ _id:id, name, email, phone, role })); // ✅ Store in Redux
        } else {
          throw new Error("Invalid user data format");
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        console.error("Error fetching user:", err.response?.data?.message || err.message);

        dispatch(removeUser());
        navigate("/auth"); // ✅ Redirect to login if error occurs
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;
