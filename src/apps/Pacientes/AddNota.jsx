import React, { useState } from "react";
import { db } from "../../data/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function AddNota({ userId, onClose, pacienteId, onNotaAdded }) {
	const [notaText, setNotaText] = useState("");

	const Insertar = async (e) => {
		e.preventDefault();

		if (notaText !== "") {
			const nuevaNota = {
				notaId: Date.now(), 
				fechaNota: new Date().toLocaleDateString(), 
				nota: notaText,
			};

			try {
				const pacienteDocRef = doc(db, "users", userId, "pacientes", pacienteId);
				await updateDoc(pacienteDocRef, {
					notas: arrayUnion(nuevaNota),
				});
				setNotaText("");
				onNotaAdded(nuevaNota);
				onClose();
			} catch (error) {
				console.error("Error con Nota: ", error);
			}
		}
	};

	return (
		<Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Agregar Nota</DialogTitle>
			<DialogContent>
				<Box component="form" onSubmit={Insertar} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<TextField
						label="Nota de sesión"
						multiline
						rows={4}
						variant="outlined"
						placeholder="Datos de la nota / recordatorios"
						value={notaText}
						onChange={(e) => setNotaText(e.target.value)}
						fullWidth
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancelar
				</Button>
				<Button type="submit" onClick={Insertar} variant="contained" color="primary">
					Insertar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
