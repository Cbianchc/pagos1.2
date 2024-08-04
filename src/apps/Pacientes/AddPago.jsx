import React, { useState } from "react";
import { db } from "../../data/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

export default function AddPago({ userId, onClose, pacienteId, onPagoAdded }) {
	const [monto, setMonto] = useState("");
	const [forma, setForma] = useState("sesión (default)");
	const [fechaPago, setFechaPago] = useState("");

	const insertar = async (e) => {
		e.preventDefault();

		if (monto !== "") {
			const pago = {
				pagoId: Date.now(), 
				fechaPago: new Date().toLocaleDateString(), 
				montoPagado: monto,
				formaPago: forma,
			};

			try {
				const pacienteDocRef = doc(db, "users", userId, "pacientes", pacienteId);
				await updateDoc(pacienteDocRef, {
					pagos: arrayUnion(pago),
				});
				setMonto("");
				setForma("sesión (default)");
				setFechaPago("");
				onPagoAdded(pago); 
				onClose();
			} catch (error) {
				console.error("Error adding document: ", error);
			}
		}
	};

	return (
		<Box 
			component="form" 
			onSubmit={insertar} 
			sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 8 }}>
			<Typography variant="h6">Agregar Pago</Typography>
			<TextField
				label="Monto"
				type="number"
				variant="outlined"
				value={monto}
				onChange={(e) => setMonto(e.target.value)}
				fullWidth
			/>
			<FormControl fullWidth>
				<InputLabel>Forma de Pago</InputLabel>
				<Select
					value={forma}
					onChange={(e) => setForma(e.target.value)}
					label="Forma de Pago"
				>
					<MenuItem value="sesión (default)">Sesión (default)</MenuItem>
					<MenuItem value="efectivo">Efectivo</MenuItem>
					<MenuItem value="tarjeta">Tarjeta</MenuItem>
					{/* Puedes añadir más opciones aquí */}
				</Select>
			</FormControl>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
				<Button
					variant="contained"
					color="primary"
					type="submit"
				>
					Insertar
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					onClick={onClose}
				>
					Cancelar
				</Button>
			</Box>
		</Box>
	);
}

