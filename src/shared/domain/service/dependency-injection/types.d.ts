export type DependencyKey = 'PaymentMethod' |
'Server' |
'SimultaneousTransaction' |
'DeferredTransaction';

export type Injection = { index: number, key: DependencyKey };
