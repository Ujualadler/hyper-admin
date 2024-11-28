import axios from "axios";

export const API_URL = "http://localhost:4000";
// export const API_URL = "https://docapi.campuscare.cloud";


export const API_CLIENT = axios.create({ 
    baseURL: API_URL,
});


export const setUserDetails = (token: string, schoolName: string, schoolCode: string) => {
    if(token) {
        API_CLIENT.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API_CLIENT.defaults.headers.common["Authorization"];
    }
}


API_CLIENT.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage or any other storage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error); // Handle errors in the request
    }
);

// API_CLIENT.interceptors.response.use(
//     (response) => {
//       return response; // Return the response if successful
//     },
//     (error) => {
//       // Handle errors globally (e.g., token expiry, server errors)
//       if (error.response && error.response.status === 401) {
//         // Redirect to login if unauthorized
//         window.location.href = '/';
//       }
//       return Promise.reject(error); // Return the error for further handling
//     }
// );