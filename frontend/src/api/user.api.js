import axios from"axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
 baseURL: API_URL,
 withCredentials: true,
 headers: {
"Content-Type":"application/json",
 },
});

// No need for a request interceptor to attach the JWT token as we are using cookies
// with withCredentials: true

// ==============================
// 🔐 AUTH APIs
// ==============================

/**
 * 1️⃣ Register (Send verification code)
 */
export const registerUser = async (data) => {
 const response = await api.post("/users/register", data);
 return response.data;
};

/**
 * 2️⃣ Verify email and complete registration
 */
export const verifyEmail = async (email, code) => {
 const response = await api.post("/users/verify-email", {
 email,
 code,
 });
 return response.data;
};
export const resendCode = async (email) => {
 const response = await api.post("/users/resend-code", { email });
 return response.data;
};
/**
 * 3️⃣ Login
 */
export const loginUser = async (email, password) => {
 const response = await api.post("/users/login", {
 email,
 password,
 });
 return response.data;
};

/**
 * 4️⃣ Google Login (Authorization Code Flow)
 */
export const googleLogin = async (code, redirectUri) => {
 const response = await api.post("/users/google-login", {
 code,
 redirectUri,
 });
 return response.data;
};

/**
 * 5️⃣ Logout
 */
export const logoutUser = async () => {
 const response = await api.post("/users/logout");
 return response.data;
};

// ==============================
// 👤 PROFILE APIs
// ==============================

/**
 * 6️⃣ Get logged-in user profile
 */
export const getCurrentUser = async () => {
 const response = await api.get("/users/me");
 return response.data;
};

/**
 * 7️⃣ Update profile (with optional image upload)
 */
export const updateProfile = async ({ name, phone, imageFile }) => {
 const formData = new FormData();

 if (name) formData.append("name", name);
 if (phone) formData.append("phone", phone);
 if (imageFile) formData.append("image", imageFile);

 const response = await api.put("/users/me", formData, {
 headers: {
"Content-Type":"multipart/form-data",
 },
 });

 return response.data;
};

/**
 * 8️⃣ Change password (logged in user)
 */
// api/user.api.js
export const changePassword = async ({
 currentPassword,
 newPassword,
 confirmNewPassword,
}) => {
 const response = await api.put("/users/change-password", {
 currentPassword,
 newPassword,
 confirmNewPassword,
 });

 return response.data;
};

// ==============================
// 🔁 PASSWORD RESET APIs
// ==============================

/**
 * 9️⃣ Forgot password (Send OTP to email)
 */
export const forgotPasswordSendOtp = async (email) => {
 const response = await api.post(`/auth/forgotPassword/verifyMail/${email}`);
 return response.data;
};

/**
 * 🔟 Verify OTP for forgot password
 */
export const forgotPasswordVerifyOtp = async (otp, email) => {
 const response = await api.post(`/auth/forgotPassword/verifyOTP/${otp}/${email}`);
 return response.data;
};

/**
 * 1️⃣1️⃣ Change password (after OTP verification)
 */
export const forgotPasswordChangePassword = async (email, password, repeatPassword) => {
 const response = await api.post(`/auth/forgotPassword/changePassword/${email}`, {
  password,
  repeatPassword,
 });
 return response.data;
};

// ==============================
// 👑 ADMIN APIs
// ==============================

/**
 * 1️⃣2️⃣ Admin Login
 */

export const adminLogin = async (email, password) => {
 const response = await api.post("/users/admin-login", { email, password });
 return response.data;
};

/**
 * 1️⃣3️⃣ Get all users (Admin only)
 */
export const getAllUsers = async () => {
 const response = await api.get("/users");
 return response.data;
};

/**
 * 1️⃣4️⃣ Block / Unblock user (Admin only)
 */
export const toggleBlockUser = async (userId) => {
 const response = await api.patch(`/users/block/${userId}`);
 return response.data;
};

/**
 * 1️⃣5️⃣ Delete Account (Self)
 */
export const deleteAccount = async () => {
 const response = await api.delete("/users/me");
 return response.data;
};
