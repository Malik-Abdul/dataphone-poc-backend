// src/carrier/entities/carrier.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PhoneNumber } from '../../phone-numbers/entities/phone-number.entity';

export enum CarrierCode {
  PEERLESS = 'PEERLESS',
  BULKVS = 'BULKVS',
  BANDWIDTH = 'BANDWIDTH',
}

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
    type: 'enum',
    enum: CarrierCode,
  })
  code: CarrierCode;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.carrier)
  phoneNumbers: PhoneNumber[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
