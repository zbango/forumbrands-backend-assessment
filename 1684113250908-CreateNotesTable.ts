import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateNotesTable1684113250908 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "notes" (
          "id" SERIAL PRIMARY KEY,
          "title" character varying NOT NULL,
          "content" text NOT NULL,
          "created_at" timestamp NOT NULL DEFAULT now(),
          "updated_at" timestamp NOT NULL DEFAULT now()
        );
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notes";`);

    }

}
