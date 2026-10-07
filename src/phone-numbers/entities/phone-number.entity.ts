// src/phone-numbers/entities/phone-number.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Carrier } from '../../carrier/entities/carrier.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum PhoneNumberStatus {
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
  DISCONNECTED = 'DISCONNECTED',
}

@Entity('phone_numbers')
export class PhoneNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'phone_number',
    unique: true,
  })
  phoneNumber: string;

  @ManyToOne(() => Carrier, {
    nullable: false,
  })
  @JoinColumn({
    name: 'carrier_id',
  })
  carrier: Carrier;

  @Column({
    name: 'carrier_id',
  })
  carrierId: string;

  @Column({
    type: 'enum',
    enum: PhoneNumberStatus,
    default: PhoneNumberStatus.UNASSIGNED,
  })
  status: PhoneNumberStatus;

  @Column({
    nullable: true,
  })
  city?: string;

  @Column({
    nullable: true,
  })
  state?: string;

  @Column({
    name: 'date_obtained',
    type: 'timestamp',
    nullable: true,
  })
  dateObtained?: Date;

  @ManyToOne(() => Customer, (customer) => customer.phoneNumbers, {
    nullable: true,
  })
  @JoinColumn({
    name: 'customer_id',
  })
  customer?: Customer;

  @Column({
    name: 'customer_id',
    nullable: true,
  })
  customerId?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
