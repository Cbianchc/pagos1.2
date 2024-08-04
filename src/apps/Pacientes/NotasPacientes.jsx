import React, { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddNota from "./AddNota";

import { MdDelete } from "react-icons/md";
import { Box, Button, Card, CardContent, Typography, IconButton, Container, Divider } from "@mui/material";

export default function NotasPacientes({ pacienteId, userId }) {
	const [pacienteData, setPacienteData] = useState({ notas: [] });
	const [showAddNuevaNota, setShowAddNuevaNota] = useState(false);
	const MySwal = withReactContent(Swal);

	useEffect(() => {
		const getPacienteData = async () => {
			try {
				const pacienteRef = doc(db, "users", userId, "pacientes", pacienteId);
				const pacienteSnap = await getDoc(pacienteRef);

				if (pacienteSnap.exists()) {
					const pacienteData = pacienteSnap.data();
					setPacienteData({ notas: pacienteData.notas || [] });
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching patient data: ", error);
			}
		};

		getPacienteData();
	}, [pacienteId, userId]);

	const handleAddNota = () => {
		setShowAddNuevaNota(!showAddNuevaNota);
	};

	const handleCloseNota = () => {
		setShowAddNuevaNota(false);
	};

	const handleNotaAdded = (nuevaNota) => {
		setPacienteData((prevData) => ({
			...prevData,
			notas: [...prevData.notas, nuevaNota],
		}));
		setShowAddNuevaNota(false);
	};

	const handleDeleteNota = async (notaId) => {
		try {
			const pacienteRef = doc(db, "users", userId, "pacientes", pacienteId);
			const pacienteSnap = await getDoc(pacienteRef);

			if (pacienteSnap.exists()) {
				const updatedNotas = pacienteData.notas.filter(nota => nota.notaId !== notaId);
				await updateDoc(pacienteRef, {
					notas: updatedNotas
				});
				setPacienteData(prevData => ({
					...prevData,
					notas: updatedNotas
				}));
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error al eliminar Nota", error);
		}
	};

	const handleDeleteNotaClick = (notaId) => (e) => {
		e.stopPropagation();
		MySwal.fire({
			icon: "warning",
			html: "¿Segura? ",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sí, eliminar!",
			cancelButtonText: "No, cancelar",
			width: 320
		}).then((result) => {
			if (result.isConfirmed) {
				handleDeleteNota(notaId);
				Swal.fire({
					icon: "success",
					title: "Nota eliminada!",
				});
			}
		});
	};

	return (
		<Container>
			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleAddNota}
					sx={{ mb: 2 }}
				>
					Nueva nota
				</Button>
				{showAddNuevaNota && (
					<AddNota
						onClose={handleCloseNota}
						pacienteId={pacienteId}
						onNotaAdded={handleNotaAdded}
						userId={userId}
					/>
				)}
			</Box>

			<Box>
				{pacienteData.notas.length > 0 ? (
					[...pacienteData.notas].reverse().map((nota, index) => (
						<Card key={index} sx={{ mb: 2 }}>
							<CardContent>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box>
										<Typography variant="body1" sx={{ mb: 1 }}>
											{nota.nota}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											{nota.fechaNota}
										</Typography>
									</Box>
									<IconButton
										color="error"
										onClick={handleDeleteNotaClick(nota.notaId)}
									>
										<MdDelete size={24} />
									</IconButton>
								</Box>
							</CardContent>
							<Divider />
						</Card>
					))
				) : (
					<Typography variant="body2" color="textSecondary">
						No hay notas todavía
					</Typography>
				)}
			</Box>
		</Container>
	);
}

