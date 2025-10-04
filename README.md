*SGHSS - Sistema de Gestão Hospitalar e de Serviços de Saúde*

1. Descrição

Projeto backend para sistema hospitalar com funcionalidades de:

Cadastro e gerenciamento de pacientes

Autenticação de usuários (login/signup)

CRUD de pacientes

Desenvolvido em Node.js/Express, com PostgreSQL via Docker Compose, pronto para testes via Postman. Foco principal: backend, segurança (LGPD) e persistência de dados.


2. Tecnologias

Node.js + Express

PostgreSQL (via Docker)

JWT para autenticação

Docker & Docker Compose

Nodemon para desenvolvimento


3. Estrutura do Projeto
/src
  app.js             -> Arquivo principal do servidor
  routes/            -> Rotas (auth, pacientes)
  controllers/       -> Lógica de cada rota
  models/            -> Modelos de dados
  middlewares/       -> Middleware de autenticação JWT
docker-compose.yml    -> Configuração backend + banco
package.json          -> Dependências do projeto


4. Como rodar

Clone o repositório:

git clone <https://github.com/edsonkelvindev/SGHSS---Sistema-de-Gest-o-Hospitalar-e-de-Servi-os-de-Sa-de.git>


Inicie backend e banco:

docker compose up --build


A API ficará disponível em:

http://localhost:3000


5. Testando a API (via Postman)

Todos os endpoints protegidos requerem token JWT no header:

Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhdGVuZGVudGUiLCJpYXQiOjE3NTk2MDE3NDUsImV4cCI6MTc1OTYwNTM0NX0.K18xnv-9vLvseo_-YmrVOsT46zPHuI5nxszg4kOaZvo>

5.1 Autenticação

Signup: POST /auth/signup

Login: POST /auth/login → retorna token JWT

5.2 Pacientes

Criar paciente: POST /pacientes

Listar pacientes: GET /pacientes

6. Observações

Todos os dados são armazenados no PostgreSQL.

Se reiniciar os containers, é necessário cadastrar novamente os usuários.

Projeto focado no backend, sem interface web completa.