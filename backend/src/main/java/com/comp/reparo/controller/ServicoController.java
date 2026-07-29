package com.comp.reparo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.comp.reparo.model.Servico;
import com.comp.reparo.model.User;
import com.comp.reparo.repository.ServicoRepository;

import java.util.List;

@RestController
@RequestMapping("/servicos")
public class ServicoController {

    @Autowired
    private ServicoRepository repository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping(value = "/", produces = "application/json")
    public List<Servico> findAll() {
        User user = getCurrentUser();
        if (user.isTecnico() && user.getTecnico() != null) {
            return repository.findByTecnicoId(user.getTecnico().getId());
        }
        if (user.isCliente() && user.getCliente() != null) {
            return repository.findByClienteId(user.getCliente().getId());
        }
        return repository.findAll();
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Servico> findById(@PathVariable Long id) {
        Servico servico = repository.findById(id).orElseThrow();

        return new ResponseEntity<Servico>(servico, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Servico> create(@RequestBody Servico servico) {
        Servico created = repository.save(servico);

        return new ResponseEntity<Servico>(created, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Servico> update(@RequestBody Servico servico) {
        Servico created = repository.save(servico);

        return new ResponseEntity<Servico>(created, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/text")
    public String deletar(@PathVariable("id") Long id) {
        repository.deleteById(id);

        return "ok";
    }
}
