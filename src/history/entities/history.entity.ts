// src/history/entities/history.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum HistoryAction {
  BOUGHT = 'BOUGHT',
  PORTED_IN = 'PORTED_IN',
  ASSIGNED = 'ASSIGNED',
  MOVED = 'MOVED',
  RELEASED = 'RELEASED',
  DISCONNECTED = 'DISCONNECTED',
  NOTE_ADDED = 'NOTE_ADDED',
  CARRIER_UPDATE = 'CARRIER_UPDATE',
}

@Entity('number_history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'phone_number_id',
  })
  phoneNumberId: string;

  @Column({
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: HistoryAction,
  })
  action: HistoryAction;

  @Column({
    name: 'from_customer_id',
    nullable: true,
  })
  fromCustomerId?: string;

  @Column({
    name: 'to_customer_id',
    nullable: true,
  })
  toCustomerId?: string;

  @Column({
    name: 'performed_by',
    nullable: true,
  })
  performedBy?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
