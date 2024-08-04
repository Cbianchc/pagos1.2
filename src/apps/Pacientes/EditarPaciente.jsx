import React, { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, Select, MenuItem, Typography, Box } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function EditarPacientes({ userId, pacienteId, handleClose }) {
	const [pacienteData, setPacienteData] = useState({
		title: "",
		monto: "",
		formapago: "",
		telefono: "",
		fechaNacimiento: "",
		ubicacion: "",
		actividad: "",
		pagos: [],
		notas: [],

	});
	const [ultimoPago, setUltimoPago] = useState(null);
	const [newTitle, setNewTitle] = useState("");
	const [newCobrando, setNewCobrando] = useState("");
	const [newForma, setNewForma] = useState("");
	const [Estado, SetEstado] = useState("");


	useEffect(() => {
		const getPacienteData = async () => {
			try {
				const docRef = doc(db, "users", userId, "pacientes", pacienteId); // Ajusta esto según tu estructura de Firestore
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setPacienteData(data);
					setNewTitle(data.title || newTitle);
					setNewCobrando(data.cobrando || newCobrando);
					setNewForma(data.formaPago || newForma);
					SetEstado(data.completed);
					if (data.pagos && data.pagos.length > 0) {
						const pagosOrdenados = data.pagos.sort((a, b) => b.pagoId - a.pagoId);
						setUltimoPago(pagosOrdenados[0]);
					}
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching patient data: ", error);
			}
		};

		getPacienteData();
	}, [userId, pacienteId]);

	const handleChangeNombre = (e) => {
		setNewTitle(e.target.value);
	};
	const handleChangeCobrando = (e) => {
		setNewCobrando(e.target.value);
	};
	const handleChangeForma = (e) => {
		setNewForma(e.target.value);
	};


	const handleEdit = async () => {
		try {
			const docRef = doc(db, "users", userId, "pacientes", pacienteId);
			await updateDoc(docRef, {
				title: newTitle,
				cobrando: newCobrando,
				formaPago: newForma,
				completed: Estado
			});
			toast.success("Cambios guardados correctamente");
			setPacienteData((prevData) => ({
				...prevData,
				title: newTitle,
				cobrando: newCobrando,
				formapago: newForma
			}));
		} catch (error) {
			console.error("Error actualizando: ", error);
			toast.error("Error al guardar los cambios");
		}
	};


	return (
		<Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
			<ToastContainer />

				<Button
					variant="contained"
					color="primary"
					onClick={handleEdit}
					sx={{ mb: 3 }}
				>
					Guardar cambios
				</Button>
			<TextField
				label="Nombre"
				variant="outlined"
				value={newTitle}
				onChange={handleChangeNombre}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Paga"
				variant="outlined"
				value={newCobrando}
				onChange={handleChangeCobrando}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<Select
				label="Forma de pago"
				value={newForma}
				onChange={handleChangeForma}
				fullWidth
				sx={{ mb: 2 }}
			>
				<MenuItem value="sesión">Por sesión</MenuItem>
				<MenuItem value="mes">Por mes</MenuItem>
				<MenuItem value="otros">Otros</MenuItem>
			</Select>
			<Box
				sx={{
					color: (theme) => theme.palette.text.primary,
					p: 2,
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 1,
					mb: 2
				}}
			>
				<Typography variant="body1" component="div" sx={{ display: 'inline', pr: 3 }}>
					Último pago:
				</Typography>
				<Typography variant="body1" component="div" sx={{ display: 'inline', ml: 1, fontWeight: 'bold' }}>
					{ultimoPago ? (
						`${ultimoPago.fechaPago}: $${ultimoPago.montoPagado}`
					) : (
						"No hay pagos registrados"
					)}
				</Typography>
			</Box>
			<Box
				sx={{
					p: 2,
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 1,
					display: 'flex',
					mb: 2,
					color: (theme) => theme.palette.text.primary
				}}
			>
				<Typography variant="body1" component="div" sx={{ display: 'inline', pr: 3 }}>
					Estado
				</Typography>
				<Typography
					variant="body1"
					component="div"
					sx={{ color: Estado ? 'red' : 'green', display: 'inline', ml: 6, fontWeight: 'bold' }}
				>
					{Estado ? "PAUSADO" : "ACTIVO"}
				</Typography>
			</Box>
			<Typography variant="body1" component="p" sx={{ mt: 2, color: (theme) => theme.palette.text.primary }}>
				Datos personales:
			</Typography>
			<TextField
				label="Teléfono"
				variant="outlined"
				value={pacienteData.telefono}
				InputProps={{ readOnly: true }}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Cumpleaños"
				variant="outlined"
				value={pacienteData.fechaNacimiento}
				InputProps={{ readOnly: true }}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Ubicación"
				variant="outlined"
				value={pacienteData.ubicacion}
				InputProps={{ readOnly: true }}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Actividad"
				variant="outlined"
				value={pacienteData.actividad}
				InputProps={{ readOnly: true }}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<Typography variant="body1" component="p" sx={{ mt: 2, color: (theme) => theme.palette.text.primary }}>
				Otros datos:
			</Typography>
			<TextField
				label="Referido por"
				variant="outlined"
				value={pacienteData.referBy || ""}
				InputProps={{ readOnly: true }}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<TextField
				label="Nota"
				variant="outlined"
				value={pacienteData.notaPerfil || ""}
				InputProps={{ readOnly: true }}
				fullWidth
				sx={{ mb: 2 }}
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleEdit}
				sx={{ mt: 2 }}
			>
				Guardar cambios
			</Button>
		</Box>
	);
}