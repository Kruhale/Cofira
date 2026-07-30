package com.cofira.dto.rutinaejercicio;

import com.cofira.dto.ejercicios.EjerciciosDTO;
import lombok.Data;
import java.util.List;

@Data
public class DiaEjercicioDTO {
    private Long id;
    private String diaSemana;
    private List<EjerciciosDTO> ejercicios;
}
