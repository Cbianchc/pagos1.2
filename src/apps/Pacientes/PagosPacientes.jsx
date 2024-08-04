import React, { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import confetti from "canvas-confetti";
import AddPago from "./AddPago";
import waitingbear from "/public/waitingbear.gif";
import { Box, Button, Card, CardContent, Typography, IconButton, Container, Divider } from "@mui/material";
import { MdDelete } from "react-icons/md";

export default function PagosPacientes({ pacienteId, userId }) {
	const [pacienteData, setPacienteData] = useState({ pagos: [] });
	const [showAddNuevo, setShowAddNuevo] = useState(false);
	const MySwal = withReactContent(Swal);

	useEffect(() => {
		const getPacienteData = async () => {
			try {
				const pacienteRef = doc(db, "users", userId, "pacientes", pacienteId);
				const pacienteSnap = await getDoc(pacienteRef);

				if (pacienteSnap.exists()) {
					const pacienteData = pacienteSnap.data();
					setPacienteData({ pagos: pacienteData.pagos || [] });
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching patient data: ", error);
			}
		};

		getPacienteData();
	}, [pacienteId, userId]);

	const handleAddPago = () => {
		setShowAddNuevo(!showAddNuevo);
	};

	const handleClosePago = () => {
		setShowAddNuevo(false);
	};

	const handlePagoAdded = (nuevoPago) => {
		setPacienteData((prevData) => ({
			...prevData,
			pagos: [...prevData.pagos, nuevoPago],
		}));
		setShowAddNuevo(false); // Cierra el formulario
		handleConfetti();
	};

	const handleDeletePago = async (pagoId) => {
		try {
			const pacienteRef = doc(db, "users", userId, "pacientes", pacienteId);
			const pacienteSnap = await getDoc(pacienteRef);
			if (pacienteSnap.exists()) {
				// Filtrar y eliminar el pago específico del array de pagos
				const updatedPagos = pacienteData.pagos.filter(pago => pago.pagoId !== pagoId);
				await updateDoc(pacienteRef, {
					pagos: updatedPagos
				});
				setPacienteData(prevData => ({
					...prevData,
					pagos: updatedPagos
				}));
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error al eliminar el pago", error);
		}
	};

	const handleDeleteClick = (pagoId) => (e) => {
		e.stopPropagation();
		MySwal.fire({
			icon: "warning",
			html: "¿Segura? ",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "SI, que la chupe!",
			cancelButtonText: "NO, flashie...",
			width: 320
		}).then((result) => {
			if (result.isConfirmed) {
				handleDeletePago(pagoId);
				Swal.fire({
					icon: "success",
					title: "Se fue!",
				});
			}
		});
	};

	const handleConfetti = () => {
		var scalar = 2;
		var unicorn = confetti.shapeFromText({ text: '🤑💸', scalar });
		var bolsa = confetti.shapeFromText({ text: '💰', scalar });

		var defaults = {
			spread: 300,
			ticks: 60,
			gravity: 1,
			decay: 0.96,
			startVelocity: 10,
			shapes: [unicorn, bolsa],
			scalar,
			zIndex: 2000,
		};

		function shoot() {
			confetti({
				...defaults,
				particleCount: 30
			});

			confetti({
				...defaults,
				particleCount: 5,
				flat: true
			});

			confetti({
				...defaults,
				particleCount: 15,
				scalar: scalar / 2,
				shapes: ['circle']
			});
		}

		setTimeout(shoot, 0);
		setTimeout(shoot, 100);
		setTimeout(shoot, 200);
	};

	return (
		<Container>
			<Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleAddPago}
				>
					Nuevo pago
				</Button>
			</Box>
			{showAddNuevo && (
				<AddPago
					onClose={handleClosePago}
					// pacienteNombre={pacienteData.nombre}
					pacienteId={pacienteId}
					onPagoAdded={handlePagoAdded}
					userId={userId}
				/>
			)}
			{pacienteData.pagos.length > 0 ? (
				[...pacienteData.pagos].reverse().map((pago, index) => (
					<Card key={index} sx={{ mb: 2 }}>
						<CardContent sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
							<Typography variant="body1" sx={{ mr:3 }}>{pago.fechaPago}</Typography>
							<Typography variant="h6">${pago.montoPagado}</Typography>
							<IconButton
								edge="end"
								aria-label="delete"
								onClick={handleDeleteClick(pago.pagoId)}
								sx={{ ml: 'auto' }}
							>
								<MdDelete size={23} color="red"/>
							</IconButton>
						</CardContent>
					</Card>
				))
			) : (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
					<img src={waitingbear} width={320} alt="No hay nada" />
				</Box>
			)}
		</Container>
	);
}
