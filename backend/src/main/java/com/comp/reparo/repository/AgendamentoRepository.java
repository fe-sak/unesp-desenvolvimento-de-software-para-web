package com.comp.reparo.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
}