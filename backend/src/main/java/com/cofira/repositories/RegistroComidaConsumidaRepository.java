package com.cofira.repositories;

import com.cofira.entities.RegistroComidaConsumida;
import com.cofira.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroComidaConsumidaRepository extends JpaRepository<RegistroComidaConsumida, Long> {

    Optional<RegistroComidaConsumida> findByUsuarioAndFechaAndTipoComida(
            Usuario usuario,
            LocalDate fecha,
            String tipoComida
    );

    List<RegistroComidaConsumida> findByUsuarioAndFecha(Usuario usuario, LocalDate fecha);

    List<RegistroComidaConsumida> findByUsuarioAndFechaBetween(
            Usuario usuario,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

    List<RegistroComidaConsumida> findByUsuarioAndFechaOrderByTipoComida(Usuario usuario, LocalDate fecha);

    void deleteByUsuarioAndFechaAndTipoComida(Usuario usuario, LocalDate fecha, String tipoComida);
}
