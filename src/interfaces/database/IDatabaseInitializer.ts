export interface IDatabaseInitializer {
  initialize(): Promise<void>;
}
