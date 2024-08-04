import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../data/firebase";

import { Box, Button, Container, Grid, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { CardCliente } from "./CardCliente.jsx";
import AddNuevo from "./AddNuevo.jsx";
import FiltrarModal from "./FiltrarModal.jsx";
import confetti from "canvas-confetti";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [showAddNuevo, setShowAddNuevo] = useState(false);
  const [showFiltrarModal, setShowFiltrarModal] = useState(false);
  const [filtro, setFiltro] = useState({ estado: 'activos' });
  const [userId, setUserId] = useState(null);

  //Obtener el user actual para pasarlo a AddUser
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  //Traer los datos de la base 
  useEffect(() => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      const q = query(collection(userDocRef, "pacientes"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let pacientesArray = [];
        querySnapshot.forEach((doc) => {
          pacientesArray.push({ ...doc.data(), id: doc.id });
        });
        setTodos(pacientesArray);
      }, (error) => {
        console.error("Error fetching data: ", error);
      });
      return () => unsub();
    }
  }, [userId]);

  const handleEdit = async (pacienteId, updatedData) => {
    if (userId) {
      const pacienteDocRef = doc(db, "users", userId, "pacientes", pacienteId);
      await updateDoc(pacienteDocRef, updatedData);
    }
  };

  const handleDelete = async (pacienteId) => {
    if (userId) {
      const pacienteDocRef = doc(db, "users", userId, "pacientes", pacienteId);
      await deleteDoc(pacienteDocRef);
    }
  };

  const toggleComplete = async (pacienteId, completed) => {
    if (userId) {
      const pacienteDocRef = doc(db, "users", userId, "pacientes", pacienteId);
      await updateDoc(pacienteDocRef, { completed: !completed });
    }
  };



  const handleAddNewClick = () => {
    setShowAddNuevo(!showAddNuevo);
  };

  const handleClose = () => {
    setShowAddNuevo(false);
  };

  const handleFiltrarClick = () => {
    setShowFiltrarModal(!showFiltrarModal);
  };

  const handleCloseFiltro = () => {
    setShowFiltrarModal(false);
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 220,
      spread: 100,
      origin: { y: 0.8 }
    });
  };

  const applyFilter = (todos, filtro) => {
    // console.log("Iniciando filtrado con:", { todos: todos.length, filtro });
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // console.log("Fecha de hoy:", today);
  
    const parseFecha = (fechaString) => {
      if (!fechaString) return null;
      const [dia, mes, anio] = fechaString.split('/');
      return new Date(anio, mes - 1, dia);
    };
  
    const getMostRecentPayment = (pagos) => {
      if (!pagos || pagos.length === 0) return null;
      return pagos.reduce((mostRecent, current) => {
        const currentDate = parseFecha(current.fechaPago);
        const recentDate = parseFecha(mostRecent.fechaPago);
        return currentDate > recentDate ? current : mostRecent;
      });
    };
  
    const filteredByEstado = todos.filter(todo => {
      switch (filtro.estado) {
        case "activos":
          return !todo.completed;
        case "pausados":
          return todo.completed;
        case "todos":
        default:
          return true;
      }
    });
  
    // console.log("Después de filtrar por estado:", filteredByEstado.length);
  
    if (!filtro.fecha) {
      // console.log("No hay filtro de fecha, retornando filtrado por estado");
      return filteredByEstado;
    }
  
    const filteredByFecha = filteredByEstado.filter(todo => {
      // console.log("Procesando todo:", todo);
      const recentPayment = getMostRecentPayment(todo.pagos);
      if (!recentPayment) {
        // console.log("Item sin pagos válidos:", todo.id);
        return false;
      }
  
      const fechaPagoString = recentPayment.fechaPago;
      // console.log("Fecha de pago más reciente antes de parsear:", fechaPagoString);
  
      const fechaPago = parseFecha(fechaPagoString);
  
      if (!fechaPago) {
        console.log("No se pudo parsear la fecha:", fechaPagoString);
        return false;
      }
  
      const diffDays = Math.floor((today - fechaPago) / (1000 * 60 * 60 * 24));
      // console.log("Diferencia de días:", { id: todo.id, fechaPago, diffDays });
  
      const rangos = {
        "7_dias": 7,
        "15_dias": 15,
        "30_dias": 30,
        "60_dias": 60
      };
  
      const cumpleFiltro = diffDays >= 0 && diffDays < (rangos[filtro.fecha] || Infinity);
      // console.log("Cumple filtro:", { id: todo.id, cumple: cumpleFiltro });
      return cumpleFiltro;
    });
  
    // console.log("Resultado final del filtrado:", filteredByFecha.length);
    return filteredByFecha;
  };

// Aplicar los filtros
const filteredTodos = applyFilter(todos, filtro);
// Ordenar pacientes por nombre en orden alfabético
const sortedTodos = [...filteredTodos].sort((a, b) => {
  const nameA = a.title.toUpperCase(); // Asegúrate de que el campo se llama 'nombre'
  const nameB = b.title.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
});
//Parece que funcinan bien... si pagos viejos tienen pagos nuevos tambien lo toma
//probar otras opciones??


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleAddNewClick}>
          Agregar nuevo
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={handleFiltrarClick}>
            <FilterListIcon /> {/* Ícono de filtro */}
          </IconButton>
        </Box>
      </Box>
      {showFiltrarModal && <FiltrarModal 
                              onClose={handleCloseFiltro} 
                              setFiltro={setFiltro} />}
      {showAddNuevo && <AddNuevo 
                          userId={userId} 
                          onClose={handleClose} 
                          onSuccess={handleConfetti} />}
      <Grid container spacing={1} justifyContent="center">
        {sortedTodos.map((todo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={todo.id}>
            <CardCliente
              todo={todo}
              handleDelete={() => handleDelete(todo.id)}
              toggleComplete={() => toggleComplete(todo.id, todo.completed)}
              handleEdit={(updatedData) => handleEdit(todo.id, updatedData)}
              userId={userId}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

