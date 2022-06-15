import { DependencyKey, Injection } from './types';

export class Container {
  private static _registry: Map<string, any> = new Map();

  static register ( key: DependencyKey, instance: any ) {
    if ( Container._registry.has( key ) === false ) Container._registry.set( key, instance );;
    return this;
  }

  static getInstance ( key: DependencyKey ) {
    return Container._registry.get( key );
  }
}

export function Inject ( key: DependencyKey ) {
  return function ( target: any, propertyKey: string, parameterPosition: number ) {
    const injection: Injection = { index: parameterPosition, key };
    const existingInjections: Injection[] = target.injections ?? [];
    target.injections = [ ...existingInjections, injection ];
  };
}

export function InjectionTarget () {
  return function <T extends { new ( ...args: any[] ): object }>( constructor: T ) {
    return class extends constructor {
      constructor ( ...args: any[] ) {

        const injections = ( constructor as any ).injections as Injection[];
        const injectedArgs: any[] = injections.map( ( { index, key } ) => Container.getInstance( key ) ?? args[index] );

        super( ...injectedArgs );
      }
    };
  };
}
