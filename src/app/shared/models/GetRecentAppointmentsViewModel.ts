export interface GetRecentAppointmentsViewModel {
  today: RecentAppointmentViewModel[];
  yesterday: RecentAppointmentViewModel[];
}

export interface RecentAppointmentViewModel {
  patientFirstName: string;
  patientLastName: string;
  birthDate: string | null;
  appointmentStartDateTime: string | null;
  patientId: string | null;
  appointmentId: number;
}


