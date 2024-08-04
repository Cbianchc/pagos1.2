import { useState } from "react";
import { db } from "../data/firebase"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Card, CardContent, Typography, IconButton, CardActions, Modal, Box } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

import Paciente from "./Paciente";

import { MdDeleteForever } from "react-icons/md";
import { FaPauseCircle } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";


export function CardCliente({ todo, handleDelete, toggleComplete, handleEdit, userId }) {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newCobrando, setNewCobrando] = useState(todo.cobrando);
  const [showPaciente, setShowPaciente] = useState(false);


  const MySwal = withReactContent(Swal)

  const handleChange = (e) => {
    if (todo.completed === true) {
      setNewTitle(todo.title);
    } else {
      todo.title = "";
      setNewTitle(e.target.value);
    }
  };

  const handleDivClick = () => {
    setShowPaciente(true);
  };

  const handleClosePacienteModal  = (e) => {
    e.stopPropagation();
    setShowPaciente(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    MySwal.fire({
      icon: "warning",
      html: "¿Lo eliminamos? ",
      title: todo.title,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI, chau!",
      cancelButtonText: "NO, flashie...",
      width: 320
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(todo.id)
        Swal.fire({
          icon: "success",
          title: "Se fue!",
        });
      }
    });
  };

  //Mostrar el ultimo pago
  const getLastPagoDate = (pagos) => {
    if (!pagos || pagos.length === 0) return "No hay pagos";
    const lastPago = pagos.reduce((max, pago) => {
      const pagoDate = new Date(pago.fechaPago.split('/').reverse().join('-'));
      return pagoDate > max ? pagoDate : max;
    }, new Date(0));
    return lastPago.toLocaleDateString();
  };

  return (
    <>
      <Card sx={{ margin: '1rem', boxShadow: 3 }}>
        <CardContent onClick={handleDivClick}>
          <Typography variant="h5" component="div" sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </Typography>
          <div className="datos_paciente_lista">
            <Typography variant="body1" color="text.secondary">
              Pagando: ${todo.cobrando}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Último pago: {getLastPagoDate(todo.pagos)}
            </Typography>
          </div>
        </CardContent>
        <CardActions >
          <IconButton onClick={() => toggleComplete(todo)}>
            <FaPauseCircle size={25} color="orange" />
          </IconButton>
          <IconButton onClick={handleDeleteClick}>
            <MdDeleteForever size={25} color="red" />
          </IconButton>
        </CardActions>
      </Card>

      {/* Modal de Paciente se maneja en el componente Paciente */}
      {showPaciente && (
        <Paciente
          open={showPaciente}
          pacienteId={todo.id}
          pacienteNombre={todo.title}
          pacienteMonto={todo.cobrando}
          handleClose={handleClosePacienteModal}
          userId={userId}
        />
      )}
    </>
  );
}