export interface Produto {
    id: number;
    nome: string;
    descricao: string | null;
    preco: number;
    quantidade: number;
    total: number;
}

export interface ProdutoLixeira extends Produto {
    dataExclusao: string | null;
}