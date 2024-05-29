import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [formValue, setFormValue] = useState({ Username: '', Password: '' })
    const handlePostShip = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    }
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const allInputValue = { Username: formValue.Username, Password: formValue.Password }
        console.log(allInputValue)
        try {
            // Replace with your actual login logic
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(allInputValue),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            // Assuming the response contains a success flag and possibly a token
            const data = await response.json();
            if (data.message == "success") {
                window.sessionStorage.setItem("token", data.data.token);
                window.sessionStorage.setItem("username", data.data.Username);
                console.log(window.sessionStorage.getItem("username"))
                navigate('/');
            } else {
                setError('Invalid Username or Password');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'block', minHeight: '100vh', margin: '5rem' }}>
            <button onClick={() => navigate(-1)}>Back</button>
            <form onSubmit={handleLogin} style={{ display: 'block', textAlign: 'center', }}>
            {/* <form action="http://localhost:8080/login" method="post" style={{ display: 'block', textAlign: 'center', }}> */}
                <h1>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>
                    <label for="username">Username</label>
                    <input type="text" placeholder="Username" name="Username" value={formValue.Username} onChange={handlePostShip} />
                    {/* <input type="text" placeholder="Username" name="Username" /> */}
                </p>
                <p>
                    <label for="current-password">Password</label>
                    <input type="password" placeholder="Password" name="Password" value={formValue.Password} onChange={handlePostShip} />
                    {/* <input type="password" placeholder="Password" name="Password"  /> */}
                </p>
				<button type="submit">Sign in</button>
            </form>
        </div>
    );
}

export default Login;