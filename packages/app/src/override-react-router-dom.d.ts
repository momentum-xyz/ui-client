export * from 'react-router-dom';

declare module 'react-router-dom' {
  export declare function useParams<ParamsOrKey>(): Readonly<ParamsOrKey>;
}
