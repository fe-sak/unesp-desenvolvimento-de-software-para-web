package com.comp.reparo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Aparelho;

public interface AparelhoRepository extends JpaRepository<Aparelho, Long> {
    List<Aparelho> findByClienteId(Long clienteId);
}
