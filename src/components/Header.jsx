import React, { useState, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../apps/contexts/authContext';

import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import { Logout, Brightness4, Brightness7 } from '@mui/icons-material';
import { AccountCircle } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import ConfirmLogoutModal from './ConfirmLogoutModal';

import '../App.css';
import { ThemeContext } from '../apps/contexts/ThemeContext';

const Header = ({ handleLogout }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, loading } = useAuth();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);

	// const renderGreeting = () => {
	// 	if (loading) return 'Cargando...';
	// 	if (user && user.username) return (
	// 		<span className="greeting">
	// 			HOLA <span className="gradient-name">{user.username}</span>!
	// 		</span>
	// 	);
	// 	return '¡Bienvenido! Por favor carga tus datos en tu perfil 👉';
	// };

	const handleProfileClick = () => {
		if (isProfileOpen) {
			navigate('/'); // Vuelve a la página anterior
		} else {
			navigate('/profile'); //O abre el profile
		}
		setIsProfileOpen(!isProfileOpen);
	};

	const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    handleLogout();
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
  };

	// revisar si esta en Home y Profile
	const isHomePage = location.pathname === '/';
	const isProfile = location.pathname === '/profile';

	return (
		<AppBar className="header" position="static">
			<Toolbar>
				{/* Condicional para que aparezca el icono home */}
				{!isHomePage && !isProfile && (
					<Button
						onClick={() => navigate('/profile')}
						sx={{
							position: 'absolute',
							top: 16,
							left: 16,
							color: 'white',
						}}
					>
						<HomeIcon />
					</Button>
				)}
				<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					{/* Ícono de perfil a la izquierda */}
					<IconButton color="inherit" onClick={handleProfileClick}>
						<AccountCircle />
					</IconButton>
					{/* Espacio vacío para centrar los iconos de la derecha */}
					<Box sx={{ flexGrow: 1 }} />
					{/* Íconos de logout y darkmode a la derecha */}
					<Box>
						<IconButton color="inherit" onClick={toggleTheme}>
							{theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
						</IconButton>
						<IconButton color="inherit" onClick={handleLogoutClick}>
							<Logout />
						</IconButton>
					</Box>
				</Box>
			</Toolbar>
			<ConfirmLogoutModal
        open={logoutModalOpen}
        handleClose={handleCloseLogoutModal}
        handleConfirm={handleConfirmLogout}
      />
		</AppBar>
	);
};

export default Header;
