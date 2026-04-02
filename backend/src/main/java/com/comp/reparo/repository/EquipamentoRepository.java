package com.comp.reparo.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Equipamento;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {}