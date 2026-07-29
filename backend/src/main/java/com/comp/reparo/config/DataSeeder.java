package com.comp.reparo.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.comp.reparo.model.Aparelho;
import com.comp.reparo.model.Cliente;
import com.comp.reparo.model.Servico;
import com.comp.reparo.model.StatusServico;
import com.comp.reparo.model.Tecnico;
import com.comp.reparo.model.User;
import com.comp.reparo.model.UserRole;
import com.comp.reparo.repository.AparelhoRepository;
import com.comp.reparo.repository.ClienteRepository;
import com.comp.reparo.repository.ServicoRepository;
import com.comp.reparo.repository.TecnicoRepository;
import com.comp.reparo.repository.UserRepository;

@Component
@Profile("!prod")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClienteRepository clienteRepository;
    private final TecnicoRepository tecnicoRepository;
    private final AparelhoRepository aparelhoRepository;
    private final ServicoRepository servicoRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    public DataSeeder(UserRepository userRepository, ClienteRepository clienteRepository,
            TecnicoRepository tecnicoRepository, AparelhoRepository aparelhoRepository,
            ServicoRepository servicoRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clienteRepository = clienteRepository;
        this.tecnicoRepository = tecnicoRepository;
        this.aparelhoRepository = aparelhoRepository;
        this.servicoRepository = servicoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) return;

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole(UserRole.ADMIN);
        admin.setName("Administrador");
        userRepository.save(admin);

        Cliente c1 = new Cliente();
        c1.setNome("Joao Silva");
        c1.setTelefone("(11) 99999-0001");
        c1.setEmail("joao@email.com");
        clienteRepository.save(c1);

        Cliente c2 = new Cliente();
        c2.setNome("Maria Souza");
        c2.setTelefone("(11) 99999-0002");
        c2.setEmail("maria@email.com");
        clienteRepository.save(c2);

        Cliente c3 = new Cliente();
        c3.setNome("Pedro Santos");
        c3.setTelefone("(11) 99999-0003");
        c3.setEmail("pedro@email.com");
        clienteRepository.save(c3);

        User clienteUser = new User();
        clienteUser.setUsername("joao");
        clienteUser.setPassword(passwordEncoder.encode("123"));
        clienteUser.setRole(UserRole.USER);
        clienteUser.setCliente(c1);
        clienteUser.setName("Joao");
        userRepository.save(clienteUser);

        Tecnico t1 = new Tecnico();
        t1.setNome("Carlos Eletronica");
        t1.setEspecialidade("Eletronica");
        tecnicoRepository.save(t1);

        User tecnicoUser = new User();
        tecnicoUser.setUsername("carlos");
        tecnicoUser.setPassword(passwordEncoder.encode("123"));
        tecnicoUser.setRole(UserRole.TECNICO);
        tecnicoUser.setTecnico(t1);
        tecnicoUser.setName("Carlos");
        userRepository.save(tecnicoUser);

        Aparelho a1 = new Aparelho();
        a1.setTipo("Notebook");
        a1.setMarca("Dell");
        a1.setModelo("Inspiron 15");
        a1.setDefeitoRelatado("Nao liga");
        a1.setCliente(c1);
        aparelhoRepository.save(a1);

        Aparelho a2 = new Aparelho();
        a2.setTipo("Celular");
        a2.setMarca("Samsung");
        a2.setModelo("Galaxy S23");
        a2.setDefeitoRelatado("Tela quebrada");
        a2.setCliente(c2);
        aparelhoRepository.save(a2);

        Aparelho a3 = new Aparelho();
        a3.setTipo("Ar Condicionado");
        a3.setMarca("LG");
        a3.setModelo("Split 12000");
        a3.setDefeitoRelatado("Nao gela");
        a3.setCliente(c3);
        aparelhoRepository.save(a3);

        Aparelho a4 = new Aparelho();
        a4.setTipo("Notebook");
        a4.setMarca("Lenovo");
        a4.setModelo("ThinkPad");
        a4.setDefeitoRelatado("Teclado parou de funcionar");
        a4.setCliente(c1);
        aparelhoRepository.save(a4);

        Servico s1 = new Servico();
        s1.setData(LocalDate.now());
        s1.setHora(LocalTime.of(9, 0));
        s1.setStatus(StatusServico.PENDENTE);
        s1.setObservacao("Cliente deixou o carregador");
        s1.setCliente(c1);
        s1.setTecnico(t1);
        s1.setAparelho(a1);
        servicoRepository.save(s1);

        Servico s2 = new Servico();
        s2.setData(LocalDate.now());
        s2.setHora(LocalTime.of(10, 30));
        s2.setStatus(StatusServico.CONFIRMADO);
        s2.setObservacao("Tela precisa ser importada");
        s2.setCliente(c2);
        s2.setTecnico(t1);
        s2.setAparelho(a2);
        servicoRepository.save(s2);

        Servico s3 = new Servico();
        s3.setData(LocalDate.now());
        s3.setHora(LocalTime.of(14, 0));
        s3.setStatus(StatusServico.EM_ANDAMENTO);
        s3.setCliente(c3);
        s3.setTecnico(t1);
        s3.setAparelho(a3);
        servicoRepository.save(s3);

        Servico s4 = new Servico();
        s4.setData(LocalDate.now().minusDays(2));
        s4.setHora(LocalTime.of(11, 0));
        s4.setStatus(StatusServico.CONCLUIDO);
        s4.setCliente(c1);
        s4.setTecnico(t1);
        s4.setAparelho(a4);
        servicoRepository.save(s4);

        Servico s5 = new Servico();
        s5.setData(LocalDate.now().minusDays(5));
        s5.setHora(LocalTime.of(15, 30));
        s5.setStatus(StatusServico.CANCELADO);
        s5.setCliente(c2);
        s5.setTecnico(t1);
        s5.setAparelho(a2);
        servicoRepository.save(s5);
    }
}
