import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/register">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-6 text-foreground">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar esta plataforma, você concorda em cumprir e estar vinculado aos presentes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nossa plataforma conecta prestadores de serviços a clientes, facilitando a contratação de serviços diversos. 
              Atuamos como intermediários na conexão entre as partes, não sendo responsáveis pela execução dos serviços contratados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta de Usuário</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>3.1. Para utilizar os serviços, você deve criar uma conta fornecendo informações precisas e completas.</p>
              <p>3.2. Você é responsável por manter a confidencialidade de sua senha e conta.</p>
              <p>3.3. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.</p>
              <p>3.4. Você deve ter pelo menos 18 anos de idade para criar uma conta.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Responsabilidades do Usuário</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>4.1. Fornecer informações verdadeiras, precisas e atualizadas.</p>
              <p>4.2. Não utilizar a plataforma para fins ilegais ou não autorizados.</p>
              <p>4.3. Não violar direitos de propriedade intelectual de terceiros.</p>
              <p>4.4. Não transmitir vírus, malware ou qualquer código malicioso.</p>
              <p>4.5. Respeitar os demais usuários e manter conduta ética.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Prestadores de Serviços</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>5.1. Prestadores devem possuir as qualificações e licenças necessárias para oferecer seus serviços.</p>
              <p>5.2. São responsáveis pela qualidade, execução e garantia dos serviços prestados.</p>
              <p>5.3. Devem cumprir todos os acordos estabelecidos com os contratantes.</p>
              <p>5.4. São responsáveis pelo recolhimento de impostos e obrigações trabalhistas.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contratantes</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>6.1. São responsáveis pelo pagamento dos serviços contratados conforme acordado.</p>
              <p>6.2. Devem fornecer informações precisas sobre os serviços desejados.</p>
              <p>6.3. Devem avaliar os prestadores de forma justa e honesta.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitação de Responsabilidade</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>7.1. A plataforma não se responsabiliza pela qualidade dos serviços prestados.</p>
              <p>7.2. Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais.</p>
              <p>7.3. A plataforma não garante que o serviço será ininterrupto ou livre de erros.</p>
              <p>7.4. Não somos responsáveis por disputas entre usuários e prestadores.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software, 
              é de propriedade da plataforma ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Modificações dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após sua publicação na plataforma. 
              O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Cancelamento e Suspensão</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, 
              por violação destes termos ou por qualquer outra razão que consideremos apropriada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Lei Aplicável</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa relacionada a estes termos será resolvida no foro da comarca da sede da empresa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para questões sobre estes Termos de Uso, entre em contato através do email: contato@plataforma.com.br
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t">
          <Link to="/register">
            <Button>Voltar ao Cadastro</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
