package com.cofira.repositories;

import com.cofira.entities.RutinaAlimentacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RutinaAlimentacionRepository extends JpaRepository<RutinaAlimentacion, Long> {
}
