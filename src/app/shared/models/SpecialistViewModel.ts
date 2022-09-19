import Guid from 'devextreme/core/guid';

export class SpecialistViewModel {
  name?: string;
  id: Guid | null;
  speciality?: string;
  subSpeciality?: string;
  jobTitle?: string;
  active?: boolean;
  gmcNo?: string;
  displayName: string;
  photoUrl?: string;
  title?: string;
  santisedPhotoUrl?: any;
  siteId?: string;
  photoDataType?: string;
  photoAsBase64String?: string;
  photoBytes?: string;
  notes?: string;
  selected?: boolean;
  appointmentTypes?: string[];
}

export class SpecialistModel {
  id: Guid;
  displayName: string;
}
