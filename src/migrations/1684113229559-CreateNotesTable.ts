import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateNotesTable1684113229559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "notes" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
