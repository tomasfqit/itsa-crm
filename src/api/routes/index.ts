export const API_ROUTES = {
  // Security public
  login: "sec/auth/v1/login/",
  closeSession: "sec/auth/v1/close-session/",
  checkSession: "sec/auth/v1/check-session/",
  exchangeCode: "sec/auth/v1/exchange-code/",
  refreshToken: "sec/auth/v1/refresh/",
  revaliteRefresh: "sec/auth/v1/revalidate-refresh/",

  // Security private
  logout: "sec/api/v1/security/logout/",
  permissions: "sec/api/v1/security/get-permissions/",
  validateRoute: "sec/api/v1/security/validate-route/",
  validatePermissions: "sec/api/v1/security/validate-permissions/",
  userInformation: "sec/api/v1/security/user-information/",
  securityModules: "sec/api/v1/security/modules/",
  securitySubModules: "sec/api/v1/security/submodules/",
  microFrontends: "sec/api/v1/security/micro-frontends/",
  securityPrograms: "sec/api/v1/security/programs/",
  securityGroups: "sec/api/v1/security/groups/",
  securityRoles: "sec/api/v1/security/roles/",
  securityAccessPolicies: "sec/api/v1/security/roles_access_policies/",
  securityRAPActions: "sec/api/v1/security/role_agency_program_action/",
  securityUsers: "sec/api/v1/security/users/",
  securityCatalog: "sec/api/v1/security/catalog/",

}