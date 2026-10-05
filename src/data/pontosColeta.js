export const pontosColeta = [
  {
    id: '1',
    nome: 'Sede Centro',
    tipo: 'Coleta e distribuição',
    endereco: 'Rua 10, nº 250, Setor Central, Goiânia - GO, 74013-010',
    diasHorarios: 'Segunda a sexta, das 8h às 17h; sábado, das 8h às 12h',
    recebe: ['Roupas', 'Alimentos não perecíveis', 'Produtos de higiene'],
    distribui: ['Cestas básicas', 'Kits de higiene'],
  },
  {
    id: '2',
    nome: 'Paróquia São José',
    tipo: 'Coleta',
    endereco: 'Av. Anhanguera, nº 1200, Setor Oeste, Goiânia - GO, 74110-010',
    diasHorarios: 'Terça a sábado, das 9h às 16h',
    recebe: ['Roupas', 'Calçados', 'Cobertores'],
    distribui: [],
  },
  {
    id: '3',
    nome: 'Escola Municipal Esperança',
    tipo: 'Coleta',
    endereco: 'Rua das Flores, nº 45, Jardim América, Goiânia - GO, 74270-030',
    diasHorarios: 'Segunda a sexta, das 7h às 12h',
    recebe: ['Material escolar', 'Livros', 'Brinquedos'],
    distribui: [],
  },
  {
    id: '4',
    nome: 'Supermercado Bom Preço',
    tipo: 'Coleta',
    endereco: 'Av. T-63, nº 890, Setor Bueno, Goiânia - GO, 74230-100',
    diasHorarios: 'Todos os dias, das 8h às 20h',
    recebe: ['Alimentos não perecíveis', 'Produtos de limpeza'],
    distribui: [],
  },
  {
    id: '5',
    nome: 'Centro Comunitário Vila Nova',
    tipo: 'Distribuição',
    endereco: 'Rua 205, nº 12, Vila Nova, Goiânia - GO, 74645-170',
    diasHorarios: 'Sábado, das 8h às 12h',
    recebe: [],
    distribui: ['Cestas básicas', 'Roupas', 'Calçados'],
  },
  {
    id: '6',
    nome: 'Associação de Moradores do Jardim Novo Mundo',
    tipo: 'Coleta e distribuição',
    endereco: 'Av. Nova York, nº 530, Jardim Novo Mundo, Goiânia - GO, 74703-010',
    diasHorarios: 'Quarta e sexta, das 14h às 18h',
    recebe: ['Alimentos não perecíveis', 'Cobertores', 'Roupas'],
    distribui: ['Cestas básicas', 'Cobertores'],
  },
  {
    id: '7',
    nome: 'Posto de Saúde Vila Redenção',
    tipo: 'Distribuição',
    endereco: 'Rua 1047, nº 80, Vila Redenção, Goiânia - GO, 74845-040',
    diasHorarios: 'Segunda a quinta, das 7h às 11h',
    recebe: [],
    distribui: ['Kits de higiene', 'Fraldas', 'Leite em pó'],
  },
];

export function pontosQueRecebemDoacao() {
  return pontosColeta.filter((ponto) => ponto.recebe.length > 0);
}
