import axios from "axios";

const AuthService = {
  isAuthenticated: false,
  // userRole: null,

  initializeAuth: async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/check_authentication"
      );

      if (response.data.user.isAuthenticated) {
        AuthService.isAuthenticated = true;
        AuthService.userRole = response.data.user.Role;
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("userRole", AuthService.userRole);
      } else {
        AuthService.isAuthenticated = false;
        AuthService.userRole = null;
        localStorage.setItem("authenticated", "false");
        localStorage.removeItem("userRole");
        localStorage.clear();
      }
    } catch (error) {
      console.error("Authentication initialization error:", error);
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/Login_view/", {
        email: email,
        password: password,
      });

      if (response.data.message === "Login successful") {
        AuthService.isAuthenticated = true;
        AuthService.userRole = response.data.user.role; // Assuming the backend sends the user role
        localStorage.setItem("authenticated", "true");
        // localStorage.setItem("userRole", AuthService.userRole);
        // console.log("AuthService.userRole:", AuthService.userRole);
      } else {
        console.error("Login Error:", response.data.error_message);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  },

  logout: async () => {
    try {
      await axios.post("http://127.0.0.1:8000/logout");
      AuthService.isAuthenticated = false;
      AuthService.userRole = null;
      localStorage.setItem("authenticated", "false");

      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  getUserRole: () => {
    return AuthService.userRole || localStorage.getItem("userRole");
  },

  clearUserRole: () => {
    AuthService.userRole = null;
    localStorage.removeItem("userRole");
  },

  getIsAuthenticated: () => {
    return AuthService.isAuthenticated;
  },
};

export default AuthService;
