import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../App.css';

const StyledNavLink = styled(Nav.Link)`
    color: #ffffff;
    padding: 0.5rem 1rem;
    margin-right: 10px;
    text-decoration: none;
    &:hover {
        color: #ffffff;
        text-decoration: none;
        background-color: #007bff;
        border-radius: 4px;
    }
`;

const WelcomeMessage = styled.span`
    color: #7DFDFE;
    padding: 0.5rem 1rem;
    margin-right: 10px;
    text-decoration: none;
    }
`;

const Navbar = ({ loggedIn, logout, user }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        logout();
        navigate('/login');
    };

    const authLinks = (
        <Nav className="bg-dark">
            <StyledNavLink as={Link} to="/dashboard">
                Dashboard
            </StyledNavLink>
            <StyledNavLink as={Link} to="/upload">
                Upload
            </StyledNavLink>
            <WelcomeMessage> Welcome, {user} </WelcomeMessage>
            <StyledNavLink onClick={handleLogout}>
                Logout
            </StyledNavLink>
        </Nav>
    );

    const genLinks = (
        <Nav className="bg-dark">
            <StyledNavLink as={Link} to="/login">
                Login
            </StyledNavLink>
        </Nav>
    );

    return (
        <Nav className="navbar bg-dark">
            {loggedIn ? authLinks : genLinks}
        </Nav>
    );
};

export default Navbar;