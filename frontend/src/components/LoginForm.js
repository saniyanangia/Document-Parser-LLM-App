import React from 'react'
import { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { MDBContainer } from 'mdb-react-ui-kit'; 

const LoginForm = ({ setLoggedIn, setUser }) => { 
	const [username, setUsername] = useState(''); 
	const [password, setPassword] = useState(''); 
	const [error, setError] = useState(''); 
	const navigate = useNavigate(); 

	const handleLogin = async () => { 

		try { 
			if (!username || !password) { 
				setError('Please enter both username and password.'); 
				return; 
			} 

			const response = await axios.post('http://localhost:8080/auth/signin', { username, password }); 
			console.log('Login successful:', response.data); 
			const { jwt } = response.data;
			localStorage.setItem('jwtToken', jwt);
			localStorage.setItem('user', username);

			setLoggedIn(true);
			setUser(username);
			navigate('/dashboard'); 

		} catch (error) { 
			console.error('Login failed:', error.response ? error.response.data : error.message); 
			setError('Invalid username or password.'); 
		} 
	}; 

    return ( 
        <div className="d-flex justify-content-center align-items-center vh-100"> 
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto' }}> 
                <MDBContainer className="p-3"> 
                    <h2 className="mb-4 text-center">Login Page</h2> 
                    <input placeholder='Username' id='username' value={username} type='text' className='form-control' onChange={(e) => setUsername(e.target.value)} /> 
                    <input placeholder='Password' id='password' type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} /> 
                    {error && <p className="text-danger">{error}</p>}
			<div className='mt-3'>
				<div className="d-grid gap-2">
					<button className="btn btn-lg btn-primary" type='button' onClick={handleLogin}>Sign In</button> 
				</div>
			</div>
			<div className='mt-4'>
				<div className="text-center"> 
					<p>Not already registered? <a href="/signup">Register</a></p> 
				</div> 
			</div>
                </MDBContainer> 
            </div> 
        </div> 
    ); 
}    


export default LoginForm;
