@Entity
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;
    private LocalTime hora;

    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;

    private String observacao;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Equipamento equipamento;

    @ManyToOne
    private Tecnico tecnico; 
}