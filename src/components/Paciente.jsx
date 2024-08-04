import React, { useState } from "react";

import { Modal, Box, Button, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";

import { IconButton } from "@mui/material";
import { TiArrowBack } from "react-icons/ti";

import EditarPacientes from "../apps/Pacientes/EditarPaciente.jsx";
import NotasPacientes from "../apps/Pacientes/NotasPacientes.jsx";
import PagosPacientes from "../apps/Pacientes/PagosPacientes";

const AnimatedBox = animated(Box);

export default function Paciente({ open, handleClose, pacienteId, pacienteNombre, userId }) {
	const [showEditar, setShowEditar] = useState(true);
	const [showNotas, setShowNotas] = useState(false);
	const [showPagos, setShowPagos] = useState(false);

	const handleEditarClick = () => {
		setShowEditar(true);
		setShowNotas(false);
		setShowPagos(false);
	};

	const handleNotasClick = () => {
		setShowEditar(false);
		setShowNotas(true);
		setShowPagos(false);
	};

	const handlePagoClick = () => {
		setShowEditar(false);
		setShowNotas(false);
		setShowPagos(true);
	};

	const animation = useSpring({
		transform: open ? 'translateY(0%)' : 'translateY(100%)',
		opacity: open ? 1 : 0,
	});


	return (
		<Modal open={open} onClose={handleClose}>
			<AnimatedBox
				sx={{
					position: 'fixed',
					bottom: 0,
					right: 0,
					width: '91%',
					maxWidth: 500,
					height: '95%',
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					mx: 'auto',
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
					overflowY: 'auto'
				}}
				style={animation}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<IconButton onClick={handleClose} sx={{ mr: 2 }}>
						<TiArrowBack size={24} color="primary" />
					</IconButton>
					{/* Contenedor para el título */}
					<Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
						<Typography
							variant="h6"
							component="h2"
							color="textSecondary"
							sx={{ textAlign: 'center' }}
						>
							{pacienteNombre}
						</Typography>
					</Box>
				</Box>
	
				<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
					<Button onClick={handleEditarClick} variant={showEditar ? "contained" : "outlined"}>
						Editar
					</Button>
					<Button onClick={handleNotasClick} variant={showNotas ? "contained" : "outlined"}>
						Notas
					</Button>
					<Button onClick={handlePagoClick} variant={showPagos ? "contained" : "outlined"}>
						Pagos
					</Button>
				</Box>
				<Box>
					{showEditar && <EditarPacientes
						userId={userId}
						pacienteId={pacienteId}
						handleClose={handleClose} />}
					{showNotas && <NotasPacientes 
						userId={userId}
						pacienteId={pacienteId}
						handleClose={handleClose} />}
					{showPagos && <PagosPacientes 
						userId={userId}
						pacienteId={pacienteId}
						handleClose={handleClose} />}
				</Box>
			</AnimatedBox>
		</Modal>
	);
	
}