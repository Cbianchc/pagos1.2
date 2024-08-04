// src/apps/Profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../data/firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
	getDoc
} from "firebase/firestore";
// import '../App.css';

const UserProfile = () => {
	const [userData, setUserData] = useState({ birthdate: '', phone: '', celebrate: true });
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			const user = auth.currentUser;
			if (user) {
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					setUserData(userDoc.data());
				}
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleSave = async () => {
		try {
			const user = auth.currentUser;
			if (user) {
				// Actualiza los datos del usuario
				await updateDoc(doc(db, 'users', user.uid), userData);

				const normalizedBirthday = {
					id: user.uid,
					name: userData.username || 'Nombre no disponible',
					date: userData.birthdate,
					type: 'birthday',
					eventType: '',
					admin: '',
					description: '',
					participants: [],
				};

				// Actualiza los datos de la oficina en base a la celebración del cumpleaños
      const offices = userData.offices || [];
      for (const office of offices) {
        const officeRef = doc(db, 'offices', office);
        if (userData.celebrate) {
          await updateDoc(officeRef, {
            [`birthdays.${user.uid}`]: normalizedBirthday
          });
        } else {
          await updateDoc(officeRef, {
            [`birthdays.${user.uid}`]: null
          });
        }
      }

      navigate('/');
    }
  } catch (error) {
    console.error("Error al actualizar perfil: ", error);
  }
};

  // Función para exportar datos a JSON
  const handleExport = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const json = JSON.stringify(data, null, 2);

      // Crear un enlace para descargar el archivo JSON
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backupPacientes.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar datos: ", error);
    }
  };


	if (loading) return <div>Cargando...</div>;

	return (
		<Container component="main" className='perfil'>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Typography component="h1" mt={2} mb={1} variant="h5">Perfil de Usuario</Typography>

				<Box mt={3} mb={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
					{/* <Typography component='h2' sx={{ mx: 2, my: 3 }}> Estas en: {userData.offices}</Typography>
					<Button
						fullWidth
						variant="contained"
						color="secondary"
						onClick={() => {}}
						sx={{ m: 2 }}
					>
						Cambiar de entorno
					</Button> */}
					<Button variant="outlined" color="primary" onClick={handleExport}>
          Exportar mi base
        </Button>
				</Box>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="Usuario"
					value={userData.username}
					onChange={(e) => setUserData({ ...userData, username: e.target.value })}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="Email"
					value={userData.email}
					disabled
				/>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="Fecha de Nacimiento"
					type="date"
					InputLabelProps={{ shrink: true }}
					value={userData.birthdate}
					onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
				/>
				<FormControlLabel
					control={
						<Switch
							checked={userData.celebrate}
							onChange={(e) => setUserData({ ...userData, celebrate: e.target.checked })}
						/>
					}
					label="¿Festejas tu cumpleaños?"
				/>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="Teléfono"
					value={userData.phone}
					onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
				/>
				<Button
					fullWidth
					variant="contained"
					color="primary"
					onClick={handleSave}
					sx={{ mt: 2 }}
				>
					Guardar cambios
				</Button>
			</Box>
		</Container>
	);
};

export default UserProfile;
