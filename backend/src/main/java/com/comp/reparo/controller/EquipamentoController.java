package com.comp.reparo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Equipamento;
import com.comp.reparo.model.User;
import com.comp.reparo.repository.EquipamentoRepository;

@RestController
@RequestMapping("/equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoRepository repository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<List<Equipamento>> findAll() {
        User user = getCurrentUser();
        List<Equipamento> list;
        if (!user.isAdmin() && user.getCliente() != null) {
            list = repository.findByClienteId(user.getCliente().getId());
        } else {
            list = repository.findAll();
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Equipamento> findById(@PathVariable Long id) {
        Equipamento equipamento = repository.findById(id).orElseThrow();
        return new ResponseEntity<>(equipamento, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Equipamento> create(@RequestBody Equipamento equipamento) {
        Equipamento created = repository.save(equipamento);
        return new ResponseEntity<>(created, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Equipamento> update(@RequestBody Equipamento equipamento) {
        Equipamento updated = repository.save(equipamento);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/text")
    public String delete(@PathVariable("id") Long id) {
        repository.deleteById(id);
        return "ok";
    }
}