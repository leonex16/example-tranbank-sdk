export type DependencyKey = 'PaymentMethod' |
'Server' |
'SimultaneousTransaction' |
'DefferTransaction';

export type Injection = { index: number, key: DependencyKey };
