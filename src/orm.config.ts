import * as dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata"
import { DataSource } from "typeorm"
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { Note } from './entities/notes.entity'
import { CreateNotesTable1684113229559 } from './migrations/1684113229559-CreateNotesTable'

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: "public",
    synchronize: false,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [Note],
    migrations: [CreateNotesTable1684113229559],
})

export const getDataSource = async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize()
    return AppDataSource
}

export const getRepository = async (entity: any) => {
    const ds = await getDataSource()
    return ds.getRepository(entity)
}

export default AppDataSource