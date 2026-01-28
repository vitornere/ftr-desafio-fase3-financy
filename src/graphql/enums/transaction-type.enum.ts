import { registerEnumType } from 'type-graphql';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Tipo da transação: Receita (INCOME) ou Despesa (EXPENSE)',
});
