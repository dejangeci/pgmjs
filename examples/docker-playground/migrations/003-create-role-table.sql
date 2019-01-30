CREATE TABLE "public"."role" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "description" character varying NOT NULL,
    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
)