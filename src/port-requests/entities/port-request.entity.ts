// src/port-requests/entities/port-request.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PortRequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  DATE_CONFIRMED = 'DATE_CONFIRMED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('port_requests')
export class PortRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'customer_id',
  })
  customerId: string;

  @Column({
    name: 'carrier_id',
  })
  carrierId: string;

  @Column({
    name: 'phone_numbers',
    type: 'jsonb',
  })
  phoneNumbers: string[];

  @Column({
    name: 'account_name',
  })
  accountName: string;

  @Column({
    name: 'service_address',
  })
  serviceAddress: string;

  @Column({
    name: 'current_provider',
  })
  currentProvider: string;

  @Column({
    name: 'account_number',
    nullable: true,
  })
  accountNumber?: string;

  @Column({
    name: 'pin',
    nullable: true,
  })
  pin?: string;

  @Column({
    type: 'enum',
    enum: PortRequestStatus,
    default: PortRequestStatus.DRAFT,
  })
  status: PortRequestStatus;

  @Column({
    name: 'confirmed_port_date',
    type: 'timestamp',
    nullable: true,
  })
  confirmedPortDate?: Date;

  @Column({
    name: 'rejection_reason',
    nullable: true,
  })
  rejectionReason?: string;

  @Column({
    name: 'submitted_at',
    type: 'timestamp',
    nullable: true,
  })
  submittedAt?: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamp',
    nullable: true,
  })
  completedAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
