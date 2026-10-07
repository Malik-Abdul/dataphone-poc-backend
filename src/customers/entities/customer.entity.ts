// src/customers/entities/customer.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PhoneNumber } from '../../phone-numbers/entities/phone-number.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  email?: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.customer)
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
