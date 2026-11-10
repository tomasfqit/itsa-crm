import { ISubAgencyRequest } from "../../view/security/interfaces";

export const securityKeys = {
  init: () => ["security"] as const,
  microFrontends: () => [...securityKeys.init(), "microFrontends"] as const,
  validateRoute: () => [...securityKeys.init(), "validateRoute"] as const,
  getPermissions: () => [...securityKeys.init(), "getPermissions"] as const,
  userInformation: () => [...securityKeys.init(), "userInformation"] as const,
  subAgencies: (params?: ISubAgencyRequest) => [...securityKeys.init(), "subAgencies", params] as const,
  agencies: (params: { businessLineId: number }) => [...securityKeys.init(), "agencies", params] as const,
  allAgencies: () => [...securityKeys.init(), "allAgencies"] as const,
};