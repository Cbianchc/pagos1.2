import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function FiltrarModal({ onClose, setFiltro }) {
  const [selectedEstadoFiltro, setSelectedEstadoFiltro] = useState('activos');
  const [selectedPagoFiltro, setSelectedPagoFiltro] = useState('');

  const handleEstadoFiltroChange = (e) => {
    setSelectedEstadoFiltro(e.target.value);
  };

  const handlePagoFiltroChange = (e) => {
    setSelectedPagoFiltro(e.target.value);
  };

  const handleApplyFiltro = () => {
    // Enviar los filtros seleccionados
    setFiltro({ estado: selectedEstadoFiltro, fecha: selectedPagoFiltro });
    onClose();
  };

  const isEstadoSelected = selectedEstadoFiltro !== 'todos';

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Filtrar</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            value={selectedEstadoFiltro}
            onChange={handleEstadoFiltroChange}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="activos">Activos</MenuItem>
            <MenuItem value="pausados">Pausados</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="pago-label">Fecha de Pago</InputLabel>
          <Select
            labelId="pago-label"
            value={selectedPagoFiltro}
            onChange={handlePagoFiltroChange}
            disabled={selectedEstadoFiltro === 'todos'}
          >
            <MenuItem value="">Sin Filtro</MenuItem>
            <MenuItem value="7_dias">Últimos 7 días</MenuItem>
            <MenuItem value="15_dias">Últimos 15 días</MenuItem>
            <MenuItem value="30_dias">Últimos 30 días</MenuItem>
            <MenuItem value="60_dias">Últimos 60 días</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApplyFiltro} color="primary">
          Filtrar
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
