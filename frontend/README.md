# StudioMaster - Sistema de Agendamento para Studios de Tatuagem

Sistema completo para gerenciamento de agendamentos, estoque e pagamentos para studios de tatuagem.

## 🎨 Funcionalidades

### Para Clientes:
- ✅ Cadastro e login seguro com senha criptografada
- ✅ Visualização de serviços disponíveis
- ✅ Agendamento de sessões de tatuagem
- ✅ Acompanhamento de agendamentos
- ✅ Pagamento simulado (fictício)
- ✅ Confirmação de reserva de materiais

### Para Tatuadores (Administradores):
- ✅ Dashboard administrativo completo
- ✅ Visualização de todos os agendamentos
- ✅ Confirmação de agendamentos
- ✅ Controle de estoque integrado
- ✅ Alertas de estoque baixo
- ✅ Baixa automática de materiais ao concluir sessão
- ✅ Reposição de estoque
- ✅ Acompanhamento de faturamento

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Ícones**: Lucide React

## 📦 Instalação

### 1. Clone o repositório:
```bash
git clone [seu-repositorio]
cd studiomaster
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure as variáveis de ambiente:
O arquivo `.env` já está configurado com as credenciais do Supabase.

### 4. Execute o projeto:
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

## 👥 Como Usar

### Primeiro Acesso:

1. **Cadastre-se** na tela inicial
2. Escolha o tipo de conta:
   - **Cliente**: Para agendar tatuagens
   - **Tatuador**: Para gerenciar o studio

### Como Cliente:

1. Faça login com seu email e senha
2. Selecione um serviço disponível
3. Escolha data e hora
4. Adicione observações sobre sua ideia
5. Clique em "Agendar Sessão"
6. Aguarde a confirmação do tatuador
7. Realize o pagamento fictício (botão "Pagar Agora")
8. Material será automaticamente reservado

### Como Tatuador:

1. Faça login com sua conta de tatuador
2. Visualize o dashboard com:
   - Agendamentos futuros
   - Alertas de estoque
   - Faturamento total
3. Na aba "Agendamentos":
   - Confirme novos agendamentos
   - Conclua sessões (baixa automática no estoque)
4. Na aba "Estoque":
   - Monitore níveis de materiais
   - Reponha itens quando necessário
   - Receba alertas de estoque baixo

## 🎨 Paleta de Cores

- **Preto**: `#000000` - Fundo principal
- **Cinza Escuro**: `#1F2937` - Cards e containers
- **Cinza Médio**: `#4B5563` - Bordas e elementos secundários
- **Dourado**: `#EAB308` - Destaque e CTAs principais
- **Branco**: `#FFFFFF` - Textos principais

## 🔒 Segurança

- ✅ Senhas criptografadas automaticamente pelo Supabase Auth (bcrypt)
- ✅ Row Level Security (RLS) habilitado
- ✅ Clientes só veem seus próprios dados
- ✅ Tatuadores têm acesso administrativo completo
- ✅ Tokens JWT para autenticação

## 🗄️ Estrutura do Banco de Dados

### Tabelas:

1. **usuarios**: Dados de clientes e tatuadores
2. **servicos**: Tipos de tatuagens disponíveis
3. **estoque**: Materiais do studio (agulhas, tintas, luvas, etc)
4. **agendamentos**: Sessões agendadas
5. **itens_utilizados**: Rastreamento de materiais por sessão

## 📊 Fluxo de Agendamento

```
Cliente Agenda → Status: PENDENTE
↓
Tatuador Confirma → Status: CONFIRMADO
↓
Cliente Paga (Simulado) → Status: PAGO → Material Reservado
↓
Tatuador Conclui Sessão → Status: CONCLUÍDO → Baixa Automática no Estoque
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Cria versão de produção
npm run preview    # Visualiza versão de produção
npm run lint       # Verifica erros de código
```

## 📝 Notas para o TCC

### Conceitos Implementados:

1. **Interoperabilidade**:
   - Integração entre agendamento e estoque
   - Baixa automática de materiais ao concluir sessão
   - Comunicação em tempo real entre cliente e tatuador

2. **Segurança**:
   - Autenticação com senha criptografada (bcrypt via Supabase)
   - Row Level Security para proteção de dados
   - Validação de permissões por tipo de usuário

3. **Pagamento Fictício**:
   - Botão simula processamento de pagamento
   - Altera status do agendamento para "PAGO"
   - Exibe confirmação de reserva de material
   - Não processa valores reais

## 🎯 Diferenciais do Projeto

- Interface moderna e profissional
- Design responsivo (funciona em mobile e desktop)
- Atualizações em tempo real
- Sistema de alertas de estoque
- Dashboard com métricas importantes
- Experiência de usuário otimizada

## 📱 Capturas de Tela

O sistema possui:
- Tela de Login/Cadastro com design moderno
- Área do Cliente com formulário de agendamento
- Dashboard do Tatuador com estatísticas
- Controle de Estoque com alertas visuais

## 👨‍💻 Desenvolvido para TCC

Sistema desenvolvido como projeto de conclusão de curso, demonstrando conceitos de:
- Desenvolvimento Full Stack
- Segurança de aplicações web
- Integração de sistemas
- Gestão de banco de dados
- Interface de usuário moderna

---

**StudioMaster** - Transformando a gestão de studios de tatuagem 🎨✨
