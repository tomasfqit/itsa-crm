import { IPermissions, IProgram, ISubmodule } from "@itsa-develop/itsa-fe-components";

const normalizeRoutePath = (path: string) => path.replace(/^\/+|\/+$/g, "");

export const findProgramInSubmodule = (submodule: ISubmodule, routePath: string): IProgram | undefined => {
  const program = submodule.programs.find((item) => normalizeRoutePath(item.path) === routePath);
  if (program) return program;

  return submodule.groups?.map((group) => findProgramInSubmodule(group, routePath)).find(Boolean);
};

export const findRoutePermissionContext = (permissions: IPermissions, path: string) => {
  const routePath = normalizeRoutePath(path);

  for (const agency of permissions.agencies) {
    for (const subAgency of agency.subAgencies) {
      for (const module of subAgency.modules) {
        for (const submodule of module.submodules) {
          const program = findProgramInSubmodule(submodule, routePath);
          if (program) {
            return {
              moduleId: module.id,
              roleId: program.roleId,
            };
          }
        }
      }
    }
  }

  return undefined;
};
