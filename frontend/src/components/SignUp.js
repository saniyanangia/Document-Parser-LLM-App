import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit'; 

const SignupPage = () => { 
	const [username, setUsername] = useState(''); 
	const [email, setEmail] = useState(''); 
	const [password, setPassword] = useState(''); 
	const [confirmPassword, setConfirmPassword] = useState(''); 
	const [error, setError] = useState(''); 
	const history = useNavigate(); 

	const handleSignup = async () => { 
		try { 
			// Check for empty fields 
			if (!username || !email || !password || !confirmPassword) { 
				setError('Please fill in all fields.'); 
				return; 
			} 
	
			// Check if passwords match
			if (password !== confirmPassword) { 
				throw new Error("Passwords do not match"); 
			}
	
			// Check password strength
			const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;
			if (!passwordRegex.test(password)) {
				throw new Error("Password must be at least 8 characters long, and include a mix of uppercase, lowercase, numbers, and special characters.");
			}
	
			// Check if username is already taken
			const usernameCheckResponse = await axios.get(`http://localhost:8080/auth/check-username?username=${username}`);
			if (usernameCheckResponse.data.isTaken) {
				throw new Error("Username is already taken. Please choose another one.");
			}
	
			// Proceed with signup
			const response = await axios.post('http://localhost:8080/auth/signup', { 
				username, 
				email, 
				password
			}); 
	
			// Handle successful signup 
			console.log(response.data); 
			history('/login'); 
			
		} catch (error) {
			console.error('Signup failed:', error.response ? error.response.data : error.message);
			if (error.response && error.response.data && typeof error.response.data === 'object') {
				setError(error.response.data.message || 'An unknown error occurred');
			} else {
				setError(error.message || 'An unknown error occurred');
			}
		}
	}

	return ( 
		<div className="d-flex justify-content-center align-items-center vh-100"> 
			<div className="border rounded-lg p-4" style={{width: '600px', height: 'auto'}}> 
				<MDBContainer className="p-3"> 
					<h2 className="mb-4 text-center">Sign Up Page</h2> 
					{error && <p className="text-danger">{error}</p>} 
					<input 
						id='username' 
						placeholder="Username" 
						value={username} 
						type='text'
						class="form-control"
						onChange={(e) => setUsername(e.target.value)}
					/> 
					<input 
						placeholder='Email Address' 
						id='email' 
						value={email} 
						type='email'
						class="form-control"
						onChange={(e) => setEmail(e.target.value)}
					/> 
					<input 
						placeholder='Password' 
						id='password' 
						type='password' 
						class="form-control"
						value={password} 
						onChange={(e) => setPassword(e.target.value)}
					/> 
					<input 
						placeholder='Confirm Password' 
						id='confirmPassword' 
						type='password'
						class="form-control"
						value={confirmPassword} 
						onChange={(e) => setConfirmPassword(e.target.value)}
					/> 

					<div class='mt-3'>
						<div class="d-grid gap-2">
							<button className="btn btn-lg btn-primary" type='button' onClick={handleSignup}>Sign Up</button> 
						</div>
					</div>
					<div class='mt-4'>
						<div className="text-center"> 
						<p>Already registered? <a href="/login">Login</a></p> 
						</div> 
					</div>
				</MDBContainer> 
			</div> 
		</div> 
	);
};

export default SignupPage; 
