package com.cofira.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cofira.entities.FeedbackEjercicio;

@Repository
public interface FeedbackEjercicioRepository extends JpaRepository<FeedbackEjercicio, Long> {

    Optional<FeedbackEjercicio> findTopByUsuarioIdOrderBySemanaNumeroDesc(Long usuarioId);

    List<FeedbackEjercicio> findByFechaFeedbackBetween(LocalDate inicio, LocalDate fin);

    // Con feedback diario hay varias filas por semana: el "único" es el más reciente
    Optional<FeedbackEjercicio> findTopBySemanaNumeroAndUsuarioIdOrderByFechaFeedbackDesc(Integer semanaNumero, Long usuarioId);

    List<FeedbackEjercicio> findBySemanaNumeroAndUsuarioIdOrderByFechaFeedbackAsc(Integer semanaNumero, Long usuarioId);
}
