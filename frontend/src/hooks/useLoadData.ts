import { useDispatch } from "react-redux";
import { getUserData } from "../axios";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../redux/store"; // ✅ Correct type for dispatch
import { AuthResponse } from "../types/apiTypes"; // ✅ Ensure correct API response type
import { AxiosError } from "axios";

const useLoadData = (): boolean => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Properly typed dispatch
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserData();
        const { data }: { data: AuthResponse } = response; // ✅ Correctly infer response type

        if (data.success && data.data) {
          const { _id, name, email, phone, role } = data.data;
          dispatch(setUser({  _id, name, email, phone, role })); // ✅ Convert `_id` to `id`
        } else {
          throw new Error("Invalid user data format");
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        console.error("Error fetching user:", err.response?.data?.message || err.message);
        dispatch(removeUser());
        navigate("/auth"); // ✅ Correct function name
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;
