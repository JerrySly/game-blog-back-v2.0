import { PageRequest, PageResponse } from './../types/page.d';
import { CreateModel } from './../types/createModelTypes';
import { Model } from "sequelize";

export interface IRepository<T> {
    create(createEntity: CreateModel): void | Promise<void>
    update(entity: Omit<T, keyof Model>): void | Promise<void>
    delete(uuid: string): void | Promise<void>
    get(uuid: string): T | Promise<T | undefined>
    getList(pageRequest: PageRequest): PageResponse<T> | Promise<PageResponse<T> | undefined>
}