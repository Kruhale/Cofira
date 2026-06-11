package com.gestioneventos.cofira.dto.suscripcion;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Estado de la suscripción PRO de un usuario, calculado SIEMPRE en el servidor.
 * El cliente nunca decide si es PRO: solo lee este estado.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuscripcionEstadoDTO {
    private boolean esPro;
    private String estado;            // "activa" | "expirada" | "sin_suscripcion"
    private LocalDate fechaExpiracion;
    private long diasRestantes;
}
