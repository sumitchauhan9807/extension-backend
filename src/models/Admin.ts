import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn ,UpdateDateColumn, BaseEntity } from "typeorm"

@Entity()
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    username: string

    @Column()
    name: string

    @Column({unique:true})
    email: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}