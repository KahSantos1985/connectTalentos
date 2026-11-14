import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/register">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-6 text-foreground">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais, 
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). 
              Ao utilizar nossa plataforma, você concorda com as práticas descritas nesta política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Definições</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p><strong>Dados Pessoais:</strong> Qualquer informação relacionada a pessoa natural identificada ou identificável.</p>
              <p><strong>Titular:</strong> Pessoa natural a quem se referem os dados pessoais.</p>
              <p><strong>Controlador:</strong> A plataforma, responsável pelas decisões sobre o tratamento de dados pessoais.</p>
              <p><strong>Tratamento:</strong> Toda operação realizada com dados pessoais (coleta, armazenamento, uso, compartilhamento, etc.).</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Dados Coletados</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1. Dados fornecidos por você:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nome completo</li>
                  <li>E-mail</li>
                  <li>Telefone</li>
                  <li>Endereço (cidade, bairro)</li>
                  <li>Tipo de usuário (cliente ou prestador)</li>
                  <li>Para prestadores: descrição de serviços, qualificações, experiência</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2. Dados coletados automaticamente:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Endereço IP</li>
                  <li>Informações do dispositivo e navegador</li>
                  <li>Dados de localização (quando autorizado)</li>
                  <li>Logs de acesso e uso da plataforma</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Finalidade do Tratamento de Dados</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>Utilizamos seus dados pessoais para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Criar e gerenciar sua conta na plataforma</li>
                <li>Conectar prestadores de serviços e contratantes</li>
                <li>Processar transações e pagamentos</li>
                <li>Comunicar sobre atualizações e novidades</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                <li>Realizar análises estatísticas e de mercado</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Base Legal para o Tratamento</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>O tratamento de seus dados pessoais está fundamentado em:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Consentimento:</strong> Quando você autoriza expressamente o tratamento</li>
                <li><strong>Execução de contrato:</strong> Para prestação dos serviços da plataforma</li>
                <li><strong>Legítimo interesse:</strong> Para melhorias da plataforma e prevenção de fraudes</li>
                <li><strong>Cumprimento de obrigação legal:</strong> Quando exigido por lei</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Compartilhamento de Dados</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>Seus dados podem ser compartilhados com:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Outros usuários:</strong> Informações do perfil são visíveis para facilitar a conexão</li>
                <li><strong>Prestadores de serviços:</strong> Empresas que nos auxiliam na operação (hospedagem, pagamentos, etc.)</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
              </ul>
              <p className="mt-3">Não vendemos seus dados pessoais a terceiros.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Armazenamento e Segurança</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>7.1. Seus dados são armazenados em servidores seguros com criptografia.</p>
              <p>7.2. Implementamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, 
                 perda, alteração ou divulgação.</p>
              <p>7.3. Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas ou conforme exigido por lei.</p>
              <p>7.4. Após o término do tratamento, os dados serão eliminados ou anonimizados.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Seus Direitos como Titular de Dados</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>Conforme a LGPD, você tem direito a:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
                <li><strong>Anonimização, bloqueio ou eliminação:</strong> De dados desnecessários ou tratados irregularmente</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Informação sobre compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
                <li><strong>Revogação do consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento em determinadas situações</li>
                <li><strong>Revisão de decisões automatizadas:</strong> Questionar decisões tomadas unicamente por sistemas automatizados</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Cookies e Tecnologias Similares</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>Utilizamos cookies e tecnologias similares para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Manter você conectado à plataforma</li>
                <li>Personalizar sua experiência</li>
                <li>Analisar o uso da plataforma</li>
                <li>Melhorar nossos serviços</li>
              </ul>
              <p className="mt-3">Você pode gerenciar cookies através das configurações do seu navegador.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Transferência Internacional de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seus dados podem ser transferidos e armazenados em servidores localizados fora do Brasil. 
              Quando isso ocorrer, garantiremos que sejam aplicadas salvaguardas adequadas para proteger seus dados 
              conforme a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Menores de Idade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nossa plataforma não se destina a menores de 18 anos. Não coletamos intencionalmente dados de menores. 
              Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas para excluí-los.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. 
              Notificaremos você sobre alterações significativas através da plataforma ou por e-mail. 
              A data da última atualização será sempre indicada no início do documento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Encarregado de Dados (DPO)</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com nosso Encarregado de Dados:</p>
              <p><strong>E-mail:</strong> dpo@plataforma.com.br</p>
              <p><strong>Telefone:</strong> (XX) XXXX-XXXX</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Caso suas solicitações não sejam atendidas adequadamente, você pode contatar a Autoridade Nacional de Proteção de Dados (ANPD) 
              através do site: <a href="https://www.gov.br/anpd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.gov.br/anpd</a>
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

export default PrivacyPolicyPage;
