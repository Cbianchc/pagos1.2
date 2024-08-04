import { useState } from "react";
import { db } from "../data/firebase.jsx";
import { collection, addDoc, doc } from "firebase/firestore";
import { Modal, Box, TextField, Select, MenuItem, Button, Typography } from "@mui/material";

export default function AddNuevo({ userId, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [forma, setForma] = useState("sesión");
  const [cobrando, setCobrando] = useState("");

  const Insertar = async (e) => {
    e.preventDefault();
    if (title !== "") {
      const userDocRef = doc(db, "users", userId);
      await addDoc(collection(userDocRef, "pacientes"), {
        title,
        completed: false,
        formapago: forma,
        cobrando,
        pagos: [],
        notas: []
        
      });
      setTitle("");
      setForma("");
      setCobrando("");
      onClose();
      onSuccess();
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        component="form"
        onSubmit={Insertar}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: { xs: '80%', sm: '80%', md: '400px' }, 
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          mx: 'auto',
          mt: '10%',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" component="h2">
          Agregar Nuevo
        </Typography>
        <TextField
          label="Nombre y Apellido"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <Select
          value={forma}
          onChange={(e) => setForma(e.target.value)}
          fullWidth
        >
          <MenuItem value="sesión">Por sesión</MenuItem>
          <MenuItem value="mes">Por mes</MenuItem>
          <MenuItem value="otros">Otros</MenuItem>
        </Select>
        <TextField
          label="Valor acordardo"
          value={cobrando}
          onChange={(e) => setCobrando(e.target.value)}
          fullWidth
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Insertar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
