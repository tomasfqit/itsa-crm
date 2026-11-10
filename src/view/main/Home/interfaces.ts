export interface IPermissions {
  agencies: IAgency[];
}
export interface IAgency {
  id: number;
  name: string;
  subAgencies: string[];
}