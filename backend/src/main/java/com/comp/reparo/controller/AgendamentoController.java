package com.comp.reparo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Agendamento;
import com.comp.reparo.model.User;
import com.comp.reparo.repository.AgendamentoRepository;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository repository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping(value = "/", produces = "application/json")
    public List<Agendamento> findAll() {
        User user = getCurrentUser();
        if (!user.isAdmin() && user.getCliente() != null) {
            return repository.findByClienteId(user.getCliente().getId());
        }
        return repository.findAll();
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Agendamento> findById(@PathVariable Long id) {
        Agendamento agendamento = repository.findById(id).orElseThrow();

        return new ResponseEntity<Agendamento>(agendamento, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Agendamento> create(@RequestBody Agendamento agendamento) {
        Agendamento created = repository.save(agendamento);

        return new ResponseEntity<Agendamento>(created, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Agendamento> update(@RequestBody Agendamento agendamento) {
        Agendamento created = repository.save(agendamento);

        return new ResponseEntity<Agendamento>(created, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/text")
    public String deletar(@PathVariable("id") Long id) {
        repository.deleteById(id);

        return "ok";
    }
}