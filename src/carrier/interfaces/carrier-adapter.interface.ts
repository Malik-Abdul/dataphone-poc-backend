export interface CarrierNumber {
  phoneNumber: string;
  status: 'AVAILABLE' | 'ACTIVE' | 'DISCONNECTED';
  city?: string;
  state?: string;
  dateObtained?: Date;
}

export interface CarrierAdapter {
  getNumbers(): Promise<CarrierNumber[]>;
}
