export type StatusAgendamento = 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado';

export class Agendamento {
  constructor(
    public clienteId: number,
    public funcionarioId: number,
    public servicoId: number,
    public data: string,
    public hora: string,
    public status: StatusAgendamento = 'Pendente',
    public observacoes: string = '',
    public id?: number,
    public ordem: number = 0
  ) {}
}
