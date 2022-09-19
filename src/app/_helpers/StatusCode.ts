export enum StatusCode {
    success = 200,
    appointmentOverlap = 201,
    RecordNotFound = 202,
    invoiceNumberNotUnique = 300,
    MissingBillingAddress = 301,
    MissingEmail = 302,
    InvalidMobileNumber = 303,
    unauthorised = 401,
    ediError = 400,
    PatientZoneError = 500,
    PatientZoneRegistrationPending = 501,
    otherError = 900
}


export enum InvoiceStatus {
        'Draft',
        'WaitingApproval',
        'Issued',
        'Balanced'
}

export enum PayorType {
    Payor,
    EDI,
    PatientZone
}
