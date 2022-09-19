export interface GenericResponse {
  success: boolean;
  errors: string[];
}

export interface GenericResponseModel<T> extends GenericResponse {
  data: T;
}
