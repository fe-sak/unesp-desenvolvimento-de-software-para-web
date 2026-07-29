package com.comp.reparo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Servico;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByClienteId(Long clienteId);
    List<Servico> findByTecnicoId(Long tecnicoId);
    List<Servico> findByTecnicoIdOrTecnicoIsNull(Long tecnicoId);
}
