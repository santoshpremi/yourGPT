import type { Department } from "../../../../backend/src/api/organization/department/departmentTypes.ts";

export function optimisticWorkflowReorder(
  departments: Department[],
  workflowId: string,
  sourceDepartmentId: string,
  targetDepartmentId: string,
  index: number
) {
  // filter out the workflow from the old department
  const oldDepartment = departments.find((d) => d.id === sourceDepartmentId);
  if (!oldDepartment) return departments;
  const workflow = oldDepartment.workflows.find((uc) => uc.id === workflowId);
  if (!workflow) return departments;
  oldDepartment.workflows = oldDepartment.workflows.filter(
    (uc) => uc.id !== workflowId
  );

  // add the workflow to the new department
  const newDepartment = departments.find((d) => d.id === targetDepartmentId);
  if (!newDepartment) return departments;

  newDepartment.workflows.splice(index, 0, workflow);

  // update indices
  newDepartment.workflows.forEach((uc, i) => {
    uc.index = i;
  });

  return departments;
}
