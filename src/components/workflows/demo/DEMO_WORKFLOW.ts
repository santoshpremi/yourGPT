import { type Workflow } from "../../../../backend/src/api/workflow/workflowTypes";

export const DEMO_WORKFLOW: Workflow = {
  id: "demo_workflow",
  name: "Demo Workflow",
  description:
    "Dies ist ein einfacher Workflow für neue Benutzer. Er hilft den Nutzern, einen unvergesslichen Flug zu planen, der dem angegebenen Land und Budget entspricht.",
  steps: [
    {
      id: "step1",
      order: 0,
      promptTemplate:
        "Plane einen unvergesslichen Flug nach {{destination}} für {{duration}} mit einem Budget von {{budget}}.",
      modelOverride: null,
    },
    {
      id: "step2",
      order: 1,
      promptTemplate:
        "Sag dem Benutzer mit einem Satz, dass er seinen eigenen Workflow erstellen kann.",
      modelOverride: null,
    },
  ],
  inputs: [
    { key: "budget", name: "Budget", type: "short_text", options: [] },
    { key: "destination", name: "Reiseziel", type: "short_text", options: [] },
    {
      key: "duration",
      name: "Aufenthaltsdauer",
      type: "short_text",
      options: [],
    },
  ],
  index: 0,
  departmentId: "demoDepartment",
  includedDocuments: [],
  modelOverride: null,
  allowDocumentUpload: false,
};
