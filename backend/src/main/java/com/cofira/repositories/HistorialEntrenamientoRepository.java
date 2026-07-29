package com.cofira.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cofira.entities.HistorialEntrenamiento;

@Repository
public interface HistorialEntrenamientoRepository extends JpaRepository<HistorialEntrenamiento, Long> {

    List<HistorialEntrenamiento> findByFechaEntrenamientoBetween(LocalDate inicio, LocalDate fin);

    List<HistorialEntrenamiento> findByDiaSemanaAndSemanaNumero(String diaSemana, Integer semanaNumero);

    List<HistorialEntrenamiento> findBySemanaNumeroAndUsuarioId(Integer semanaNumero, Long usuarioId);

    @Query("SELECT COUNT(h) FROM HistorialEntrenamiento h WHERE h.completado = true AND h.semanaNumero = :semana AND h.usuario.id = :usuarioId")
    Long countCompletadosBySemanaYUsuario(@Param("semana") Integer semana, @Param("usuarioId") Long usuarioId);

    @Query("SELECT DISTINCT h.nombreEjercicio FROM HistorialEntrenamiento h WHERE h.usuario.id = :usuarioId ORDER BY h.nombreEjercicio")
    List<String> findDistinctNombreEjercicioByUsuario(@Param("usuarioId") Long usuarioId);

    @Query("SELECT h FROM HistorialEntrenamiento h WHERE h.nombreEjercicio = :nombreEjercicio AND h.usuario.id = :usuarioId AND h.pesoKg IS NOT NULL ORDER BY h.fechaEntrenamiento ASC")
    List<HistorialEntrenamiento> findByNombreEjercicioYUsuarioConPeso(@Param("nombreEjercicio") String nombreEjercicio, @Param("usuarioId") Long usuarioId);

    @Query("SELECT h FROM HistorialEntrenamiento h WHERE h.usuario.id = :usuarioId AND h.fechaEntrenamiento >= :desde ORDER BY h.fechaEntrenamiento DESC")
    List<HistorialEntrenamiento> findRecientesByUsuario(@Param("usuarioId") Long usuarioId, @Param("desde") LocalDate desde);

    @Query("SELECT h FROM HistorialEntrenamiento h WHERE h.pesoKg IS NOT NULL ORDER BY h.fechaEntrenamiento DESC")
    List<HistorialEntrenamiento> findAllConPesoOrdenadoPorFechaDesc();
}
