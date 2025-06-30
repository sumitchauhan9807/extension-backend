import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn ,UpdateDateColumn, BaseEntity } from "typeorm"
import {User} from './User'

@Entity()
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    prompt: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}