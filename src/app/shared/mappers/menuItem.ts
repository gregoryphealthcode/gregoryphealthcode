import * as moment from 'moment';
import { RecentAppointmentViewModel } from 'src/app/shared/models/GetRecentAppointmentsViewModel';
import { GetLastSelectedPatientsViewModel } from 'src/app/shared/models/getLasSelectedPatientViewModel';

export const patchFromRecentAppointmentViewModel = (menuItem: any, viewModel: RecentAppointmentViewModel) => {
  const itemText = `${moment(viewModel.appointmentStartDateTime).format('HH:mm')} ${viewModel.patientLastName}, ${viewModel.patientFirstName}`;
  const itemHint = `${itemText} dob: ${viewModel.birthDate}`;

  menuItem.text = itemText;
  menuItem.PatientId = viewModel.patientId;
  menuItem.AppointmentId = viewModel.appointmentId;
  menuItem.Hint = itemHint;
  menuItem.visible = true;
};

export const patchFromLastSelectedPatientsViewModel = (menuItem: any, viewModel: GetLastSelectedPatientsViewModel, index: number) => {
  const itemText = `${index + 1})   ${viewModel.patientName} - ${moment(viewModel.birthDate).format('DD/MM/YYYY')}`;
  const itemHint = `${itemText} dob: ${viewModel.birthDate}`;
  const itemTextShort = `${index + 1})   ${viewModel.shortname} - ${moment(viewModel.birthDate).format('DD/MM/YY')}`;
if (itemText.length >3) {
  menuItem.text = itemTextShort;
}else
{
  menuItem.text = itemText;
};

  
  menuItem.PatientId = viewModel.patientId;
  menuItem.Hint = itemHint;
  menuItem.visible = true;//
};


export const removeFromLastSelectedPatientsViewModel = (menuItem: any) => {
  menuItem.visible = false;
};
