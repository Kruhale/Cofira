package com.cofira.repositories;

import com.cofira.entities.ConsumoAgua;
import com.cofira.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ConsumoAguaRepository extends JpaRepository<ConsumoAgua, Long> {

    Optional<ConsumoAgua> findByUsuarioAndFecha(Usuario usuario, LocalDate fecha);

    List<ConsumoAgua> findByUsuarioAndFechaBetweenOrderByFechaAsc(
        Usuario usuario,
        LocalDate fechaInicio,
        LocalDate fechaFin
    );
}
