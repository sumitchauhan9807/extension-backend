import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn ,UpdateDateColumn, BaseEntity, ManyToMany, JoinTable } from "typeorm"
import {Chat} from './Chat'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    username: string

    @Column()
    name: string

    @Column({unique:true})
    email: string

    @Column({default:"de"})
    first_operation_lang: string

    @Column({default:"en"})
    second_operation_lang: string

    @Column()
    password: string

    @ManyToMany(() => Chat)
    @JoinTable()
    chats: Chat[]

		@Column({default:"de"})
    langs: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}