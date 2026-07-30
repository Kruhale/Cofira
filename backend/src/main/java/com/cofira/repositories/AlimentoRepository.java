package com.cofira.repositories;

import com.cofira.entities.Alimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlimentoRepository extends JpaRepository<Alimento, Long> {
    List<Alimento> findByNombreContainingIgnoreCase(String nombre);
}
