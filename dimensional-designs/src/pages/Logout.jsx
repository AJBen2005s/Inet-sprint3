import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

function Logout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Clear the cart from cookies when logging out
        Cookies.remove('cart'); 
        
        // Optionally clear other session data (like user info) here

        // Wait for 3 seconds and then redirect
        setTimeout(() => {
            navigate('/');
        }, 3000); // 3000 milliseconds = 3 seconds
    }, [navigate]);

    return <p>Logging out...</p>;
}

export default Logout;
