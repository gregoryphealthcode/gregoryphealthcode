import Guid from 'devextreme/core/guid';



export class CorrespondenceTemplateModel {
  uniqueNo: number;
  templateId: Guid;
  siteId: Guid;
  siteRef: string;
  rank: number;
  category: number;
  description: string;
  fileName: string;
  comments: string;
  active: boolean;
  heading: string;
  baseTemplate: string;
  default : boolean;
  type : number;
  isPatientZone : boolean;
}
