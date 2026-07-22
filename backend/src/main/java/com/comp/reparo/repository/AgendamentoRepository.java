package com.comp.reparo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByClienteId(Long clienteId);
}