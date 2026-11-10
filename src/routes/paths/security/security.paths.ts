export const SECURITY_PATHS = {
  index: () => "security" as const,
  secAccessModule: () => `${SECURITY_PATHS.index()}/modules` as const,
  secAccessSubmodule: () => `${SECURITY_PATHS.secAccessModule()}/submodules` as const,
  secAccessSubmoduleGroup: () => `${SECURITY_PATHS.secAccessSubmodule()}/groups` as const,
  secAccessRoles: () => `${SECURITY_PATHS.index()}/roles` as const,
  secAccessPoliciesAcce: () => `${SECURITY_PATHS.index()}/access-policies` as const,
  secAccessRoleAgencyProgramAction: () => `${SECURITY_PATHS.index()}/role-agency-program-actions` as const,
  secAccessUsers: () => `${SECURITY_PATHS.index()}/users` as const,
  secAccessDenied: () => `${SECURITY_PATHS.index()}/access-denied` as const,
  secPermissionsManagement: () => `${SECURITY_PATHS.index()}/permissions-management` as const,
  secAccessUserRoles: () => `${SECURITY_PATHS.index()}/user-roles` as const,
  secRolesManagementClone: () => `${SECURITY_PATHS.index()}/roles-management-clone` as const,
};
