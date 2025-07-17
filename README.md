## Objetivo
Esse é o back‑end de um sistema completo para loja virtual, com foco em controle de clientes, estoque e vendas. Foi projetado para ser flexível e atender a diferentes tipos de comércio (como confecção e peças automotivas).

O sistema foi desenvolvido para ser o mais simples, intuitivo e direto possível, oferecendo:
- Cadastro e gerenciamento de clientes
- Controle de estoque e movimentações
- Relatórios de estoque, vendas e clientes
- Controle avançado para administradores
- Integração com WhatsApp (permitindo interação com o sistema e envio de algumas notificações)
- Notificações por e‑mail
- Integração com gateway de pagamento (previsivelmente Mercado Pago)

> ⚠️ **Status:** Em desenvolvimento.

<hr>

## Tecnologias e bibliotecas utilizadas
### Backend:
- axios — cliente HTTP para requisições
- bcryptjs — hash de senhas
- cookie-parser — leitura e manipulação de cookies
- cors — controle de acesso entre origens (CORS)
- dotenv — gerenciamento de variáveis de ambiente
- eventsource — cliente para EventSource (SSE - Server-Sent Events)
- express — framework HTTP para Node.js
- express-rate-limit — proteção contra ataques de força bruta (rate limiting)
- express-validator — validação de dados em rotas Express
- multer — middleware para upload de arquivos
- nodemailer — envio de e-mails via SMTP
- prisma — acesso e manipulação do banco de dados usando ORM
- swagger-ui-express — documentação interativa para APIs REST

### Desenvolvimento e testes:
- TypeScript
- Jest + Supertest — testes automatizados
- Docker e docker-compose

### WhatsApp Service:
- axios — cliente HTTP para requisições
- cors — controle de acesso entre origens (CORS)
- express — framework HTTP para Node.js
- qrcode — gera QR codes — necessário para autenticação via WhatsApp Web.
- whatsapp-web.js — biblioteca que encapsula a comunicação com o WhatsApp Web, permitindo envio e recebimento de mensagens, interações, e controle via API.
> Plano de Arquitetura e Segurança - A arquitetura do sistema será reestruturada para separar o serviço (automação do whatsapp) do back-end, visando aprimorar a segurança. O back-end será hospedado em uma VPS (Servidor Privado Virtual), enquanto o serviço será executado em um ambiente de self-hosting, isolado da internet pública. A comunicação entre eles será realizada por meio de short polling, garantindo que o serviço permaneça em uma rede não exposta externamente.

### Funcionalidades já implementadas
- Configuração inicial do sistema (nome da loja, logotipo)
- Criação da conta de administrador
- Login, cadastro e logout
- Envio de e-mail de ativação
- Reenvio de e-mail de ativação (em caso de token expirado ou solicitado pelo próprio usuário)
- Recuperação de senha via e-mail
- Proteções contra ataques XSS e brute force
- Alterar dados pessoais (nome, telefone e endereço)
- Listagem de usuários (admin)
- Consulta de informações de um usuário específico (admin)
- CRUD de categorias
- CRUD de produtos
- Notificação via WhatsApp.
    - Mensagens de boas vindas para pessoas cadastradas.
    - Para admin: Aviso de login, aviso de solicitação e redefinição de senha.