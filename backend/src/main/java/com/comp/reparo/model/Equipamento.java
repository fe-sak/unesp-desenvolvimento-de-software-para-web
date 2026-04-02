@Entity
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String marca;
    private String modelo;
    private String defeitoRelatado;

    @ManyToOne
    private Cliente cliente;
}