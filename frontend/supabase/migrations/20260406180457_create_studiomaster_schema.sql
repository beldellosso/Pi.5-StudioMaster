/*
  # StudioMaster - Sistema de Agendamento para Studios de Tatuagem
  
  ## Descrição
  Sistema completo para gerenciamento de agendamentos, estoque e pagamentos para studios de tatuagem.
  
  ## Tabelas Criadas
  
  ### 1. usuarios (Tabela de Usuários)
  - `id` (uuid, chave primária) - Identificador único do usuário
  - `email` (text, único) - Email do usuário
  - `nome` (text) - Nome completo
  - `tipo` (text) - Tipo de usuário: 'cliente' ou 'tatuador'
  - `telefone` (text) - Telefone de contato
  - `created_at` (timestamp) - Data de criação
  
  ### 2. servicos (Tabela de Serviços)
  - `id` (uuid, chave primária) - Identificador único do serviço
  - `nome` (text) - Nome do serviço (ex: Tatuagem Pequena)
  - `descricao` (text) - Descrição do serviço
  - `preco` (numeric) - Preço do serviço
  - `duracao_minutos` (integer) - Duração em minutos
  - `created_at` (timestamp) - Data de criação
  
  ### 3. estoque (Tabela de Estoque de Materiais)
  - `id` (uuid, chave primária) - Identificador único do item
  - `nome` (text) - Nome do material (ex: Agulhas, Tintas)
  - `quantidade` (integer) - Quantidade disponível
  - `unidade` (text) - Unidade de medida
  - `nivel_minimo` (integer) - Nível mínimo de estoque
  - `updated_at` (timestamp) - Última atualização
  
  ### 4. agendamentos (Tabela de Agendamentos)
  - `id` (uuid, chave primária) - Identificador único do agendamento
  - `cliente_id` (uuid) - Referência ao usuário cliente
  - `servico_id` (uuid) - Referência ao serviço
  - `data_hora` (timestamp) - Data e hora do agendamento
  - `status` (text) - Status: 'pendente', 'confirmado', 'pago', 'cancelado', 'concluido'
  - `observacoes` (text) - Observações adicionais
  - `valor_total` (numeric) - Valor total do serviço
  - `created_at` (timestamp) - Data de criação
  
  ### 5. itens_utilizados (Tabela de Materiais Utilizados por Agendamento)
  - `id` (uuid, chave primária) - Identificador único
  - `agendamento_id` (uuid) - Referência ao agendamento
  - `estoque_id` (uuid) - Referência ao item do estoque
  - `quantidade_utilizada` (integer) - Quantidade utilizada
  - `created_at` (timestamp) - Data de criação
  
  ## Segurança
  - Row Level Security (RLS) habilitado em todas as tabelas
  - Clientes só podem ver e criar seus próprios agendamentos
  - Tatuadores têm acesso completo ao sistema
  - Políticas de segurança implementadas para cada operação
  
  ## Dados Iniciais
  - Serviços pré-cadastrados
  - Itens de estoque iniciais
*/

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('cliente', 'tatuador')),
  telefone text,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  preco numeric(10,2) NOT NULL,
  duracao_minutos integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de estoque
CREATE TABLE IF NOT EXISTS estoque (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  quantidade integer NOT NULL DEFAULT 0,
  unidade text NOT NULL,
  nivel_minimo integer NOT NULL DEFAULT 10,
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  servico_id uuid REFERENCES servicos(id),
  data_hora timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'pago', 'cancelado', 'concluido')),
  observacoes text,
  valor_total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de itens utilizados
CREATE TABLE IF NOT EXISTS itens_utilizados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id uuid REFERENCES agendamentos(id) ON DELETE CASCADE,
  estoque_id uuid REFERENCES estoque(id),
  quantidade_utilizada integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_utilizados ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON usuarios FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Tatuadores podem ver todos os usuários"
  ON usuarios FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para servicos (todos podem ver)
CREATE POLICY "Todos podem ver serviços"
  ON servicos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tatuadores podem gerenciar serviços"
  ON servicos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

-- Políticas para estoque
CREATE POLICY "Tatuadores podem ver estoque"
  ON estoque FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

CREATE POLICY "Tatuadores podem gerenciar estoque"
  ON estoque FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

-- Políticas para agendamentos
CREATE POLICY "Clientes podem ver seus próprios agendamentos"
  ON agendamentos FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());

CREATE POLICY "Tatuadores podem ver todos os agendamentos"
  ON agendamentos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

CREATE POLICY "Clientes podem criar agendamentos"
  ON agendamentos FOR INSERT
  TO authenticated
  WITH CHECK (cliente_id = auth.uid());

CREATE POLICY "Tatuadores podem atualizar agendamentos"
  ON agendamentos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

CREATE POLICY "Clientes podem atualizar seus agendamentos"
  ON agendamentos FOR UPDATE
  TO authenticated
  USING (cliente_id = auth.uid())
  WITH CHECK (cliente_id = auth.uid());

-- Políticas para itens_utilizados
CREATE POLICY "Tatuadores podem ver itens utilizados"
  ON itens_utilizados FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

CREATE POLICY "Tatuadores podem gerenciar itens utilizados"
  ON itens_utilizados FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo = 'tatuador'
    )
  );

-- Inserir serviços iniciais
INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES
  ('Tatuagem Pequena', 'Tatuagem de até 5cm', 150.00, 60),
  ('Tatuagem Média', 'Tatuagem de 5cm a 15cm', 350.00, 120),
  ('Tatuagem Grande', 'Tatuagem acima de 15cm', 600.00, 180),
  ('Tatuagem Colorida', 'Tatuagem com cores variadas', 800.00, 240),
  ('Cover Up', 'Cobertura de tatuagem antiga', 500.00, 150),
  ('Retoque', 'Retoque de tatuagem existente', 100.00, 45);

-- Inserir itens de estoque iniciais
INSERT INTO estoque (nome, quantidade, unidade, nivel_minimo) VALUES
  ('Agulhas Descartáveis', 100, 'unidades', 20),
  ('Tinta Preta', 50, 'frascos', 10),
  ('Tinta Colorida', 30, 'frascos', 8),
  ('Luvas Descartáveis', 200, 'pares', 50),
  ('Filme Protetor', 10, 'rolos', 3),
  ('Papel Toalha', 15, 'rolos', 5),
  ('Álcool 70%', 8, 'litros', 2),
  ('Vaselina', 12, 'potes', 3);
