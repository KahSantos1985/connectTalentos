🤝 Plataforma Conectando Talentos | Projeto Integrador 4 (PI4)

A Plataforma Conectando Talentos é um Marketplace de serviços focado na economia comunitária. O nosso objetivo é ligar Prestadores de Serviços locais (pequenos empreendedores) a Residentes de baixo e médio rendimento, promovendo a confiança, a inclusão digital e o desenvolvimento económico dentro das comunidades.

🚀 O Problema que Resolvemos Para Residentes: Dificuldade em encontrar prestadores de serviços qualificados e de confiança na vizinhança.

Para Prestadores (Empreendedores Locais): Baixa visibilidade, dificuldade em provar a qualidade do trabalho e em precificar corretamente os serviços.

A nossa hipótese central é que a confiança pode ser construída e escalada através de mecanismos digitais robustos (avaliações) e transparentes (tecnologia IoT).

✨ Funcionalidades Principais do MVP O foco do MVP (Produto Mínimo Viável) é validar o fluxo de reserva end-to-end.

Módulos de Negócio Jornada de Prestador: Cadastro simplificado de perfil, gestão de serviços (descrição, fotos) e calendário de disponibilidade.

Jornada de Residente: Busca avançada por bairro/cidade, visualização do perfil do prestador e solicitação de reserva.

Comunicação Mínima: Sistema de mensagens habilitado após a aprovação do serviço para combinar detalhes.

Sistema de Reputação: Avaliações simples (estrelas e comentários) para construir capital social e confiança.

Incrementos Tecnológicos (Inteligência e Segurança) Assistente de Precificação: Um chatbot interativo baseado na metodologia Sebrae para ajudar os prestadores a calcular o preço de venda, considerando custos variáveis, impostos e margem de lucro.

Inteligência de Mercado: Painel analítico que utiliza dados públicos do IBGE (renda local) e RFB/SEBRAE (concorrência por CNAE) para fornecer insights de mercado aos prestadores.

Prova de Serviço (PoS) via IoT: Previsão de integração com Capacitor Geolocation para registro de Check-in/Check-out e anexação de fotos de conclusão, aumentando a confiança na transação.

🛠️ Stack Tecnológico (O que está no Repositório) O projeto segue uma arquitetura moderna, eficiente e focada em escalabilidade e manutenibilidade.

Categoria

Tecnologia

Uso

Frontend

React 18, TypeScript

Desenvolvimento de interface de utilizador ágil e tipada.

Backend/DB

Supabase (PostgreSQL)

Base de dados relacional, autenticação (Auth) e armazenamento de ficheiros (Storage).

Estilização

Tailwind CSS

Desenvolvimento rápido de UI e layout responsivo.

Componentes

Shadcn/ui & Radix UI

Componentes acessíveis e de alta qualidade (utilizados na simulação do chatbot).

Estado

TanStack React Query

Gestão de estado do servidor (caching e sincronização de dados).

Forms

React Hook Form / Zod

Gestão de formulários e validação de esquema robusta.

⚙️ Como Configurar o Ambiente Local Para colocar o projeto a funcionar na sua máquina, siga os passos abaixo:

Pré-requisitos Node.js (versão LTS) e npm/yarn

Conta no Supabase (para obter as chaves de API)

Instalação Clone o repositório:

git clone [URL_DO_SEU_REPOSITÓRIO] cd [pasta-do-projeto]

Instale as dependências:

npm install

ou
yarn install

Configuração do Supabase (Obrigatório): Crie um ficheiro .env na raiz do projeto com as suas chaves Supabase:

.env
VITE_SUPABASE_URL="[SUA_URL_DO_SUPABASE]" VITE_SUPABASE_ANON_KEY="[SUA_CHAVE_ANON_PÚBLICA]"

Nota: As tabelas (users, services, etc.) devem ser configuradas previamente no painel do Supabase com as definições de RLS (Row Level Security).

Iniciar o Servidor de Desenvolvimento:

npm run dev

ou
yarn dev

A aplicação estará acessível em http://localhost:5173 (ou porta similar).

💡 Como Contribuir Valorizamos a contribuição da comunidade! Se deseja melhorar este projeto, por favor, siga o nosso fluxo de contribuição:

Fork o projeto.

Crie um novo branch (git checkout -b feature/sua-melhoria).

Faça suas alterações e crie o commit (git commit -m 'feat: Adiciona nova funcionalidade X').

Envie o seu branch (git push origin feature/sua-melhoria).

Abra um Pull Request (PR) detalhado no repositório principal.

⚖️ Licença Este projeto está licenciado sob a licença MIT.
