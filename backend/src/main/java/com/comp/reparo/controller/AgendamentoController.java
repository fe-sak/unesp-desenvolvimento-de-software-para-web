package com.comp.reparo.controller;

import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Agendamento;
import com.comp.reparo.repository.AgendamentoRepository;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoRepository repository;

    public AgendamentoController(AgendamentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Agendamento> findAll() {
        return repository.findAll();
    }

    @PostMapping
    public Agendamento create(@RequestBody Agendamento a) {
        return repository.save(a);
    }
}