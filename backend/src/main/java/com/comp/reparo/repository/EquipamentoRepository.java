package com.comp.reparo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Equipamento;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    List<Equipamento> findByClienteId(Long clienteId);
}