export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role?: string;   
  tipo?: string;   
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao_minutos: number;
  created_at: string;
}

export interface Estoque {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  nivel_minimo: number;
  updated_at: string;
}

export interface Agendamento {
  id: string;
  cliente_id: string;
  servico_id: string;
  data_hora: string;
  status: 'pendente' | 'confirmado' | 'pago' | 'cancelado' | 'concluido';
  observacoes?: string;
  valor_total: number;
  created_at: string;
  servico?: Servico;
  cliente?: Usuario;
}

export interface ItemUtilizado {
  id: string;
  agendamento_id: string;
  estoque_id: string;
  quantidade_utilizada: number;
  created_at: string;
}