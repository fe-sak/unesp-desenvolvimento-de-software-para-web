package com.comp.reparo.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Tecnico;

public interface TecnicoRepository extends JpaRepository<Tecnico, Long> {}