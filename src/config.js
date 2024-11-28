export const API_URL="http://localhost:4000";
// export const API_URL="https://docapi.campuscare.cloud";

export const getHeaders = () => {
    const token = localStorage.getItem('token');
  
    return {
      headers: {
          'Authorization': `Bearer ${token}`,
      }
    }
};