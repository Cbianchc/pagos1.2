import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../data/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

const defaultTheme = createTheme();

const JoinOffice = () => {
  const [officeId, setOfficeId] = useState('');
  const [newOfficeName, setNewOfficeName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleJoinOffice = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (userData && userData.username) {
          const username = userData.username;

          const officeRef = doc(db, 'offices', officeId);
          const officeSnap = await getDoc(officeRef);
          if (officeSnap.exists()) {
            await updateDoc(officeRef, {
              users: arrayUnion({ id: user.uid, name: username }),
              
            });
            await updateDoc(doc(db, 'users', user.uid), {
              offices: arrayUnion(officeId),
            });
            navigate('/profile');
          } else {
            setErrorMsg('Oficina no encontrada');
          }
        } else {
          setErrorMsg('Usuario no encontrado o sin nombre de usuario');
        }
      } else {
        setErrorMsg('Usuario no autenticado');
      }
    } catch (error) {
      setErrorMsg('Error al unirse a la oficina: ' + error.message);
    }
  };

  const handleCreateOffice = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (userData && userData.username) {
          const username = userData.username;

          const officeId = `${newOfficeName}_${user.uid}`;
          await setDoc(doc(db, 'offices', officeId), {
            name: newOfficeName,
            users: [{ id: user.uid, name: username }],
            birthdays: [{ id: user.uid, name: username, date: new Date().toISOString() }],
          });
          await updateDoc(doc(db, 'users', user.uid), {
            offices: arrayUnion(officeId),
          });
          navigate('/profile');
        } else {
          setErrorMsg('Usuario no encontrado o sin nombre de usuario');
        }
      } else {
        setErrorMsg('Usuario no autenticado');
      }
    } catch (error) {
      setErrorMsg('Error al crear la oficina: ' + error.message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'linear-gradient(to right, #ff7e5f, #feb47b)', 
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <WorkIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              PASO 2:
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Typography component="h2" variant="h6" sx={{ mt: 4 }}>
                Sumarme a un entorno
              </Typography>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Office ID"
                autoComplete="office-id"
                autoFocus
                value={officeId}
                onChange={(e) => setOfficeId(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleJoinOffice}
                sx={{ mt: 4 }}
              >
                Join Office
              </Button>
              <Typography component="h2" variant="h6" sx={{ mt: 8 }}>
                O crea tu entorno
              </Typography>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="New Office Name"
                autoComplete="new-office-name"
                value={newOfficeName}
                onChange={(e) => setNewOfficeName(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCreateOffice}
                sx={{ mt: 4 }}
              >
                Create Office
              </Button>
              {errorMsg && <Typography color="error" sx={{ mt: 2 }}>{errorMsg}</Typography>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default JoinOffice;

