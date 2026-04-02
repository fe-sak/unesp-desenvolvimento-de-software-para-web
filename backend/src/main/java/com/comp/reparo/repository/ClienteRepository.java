package com.comp.reparo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.reparo.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}