DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
"id"  SERIAL ,
"name" VARCHAR(255) ,
"password" VARCHAR(255) ,
PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "items" CASCADE;
CREATE TABLE "items" (
"id" SERIAL ,
"name" VARCHAR(255) ,
"price" DECIMAL ,
"image" VARCHAR(255) ,
"store_name" varchar(50),
"query" varchar(255),
"user_id" INT,
PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS   "lists" CASCADE;
CREATE TABLE "lists" (
"id"  SERIAL ,
"budget" INTEGER ,
"user_id" INTEGER ,
"name" VARCHAR(255) ,
PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "lists_items" CASCADE;
CREATE TABLE "lists_items" (
"id"  SERIAL ,
"lists_id" INTEGER ,
"items_id" INTEGER ,
"quantity" INTEGER DEFAULT 1 ,
PRIMARY KEY ("id")
);

ALTER TABLE "lists" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "lists_items" ADD FOREIGN KEY ("lists_id") REFERENCES "lists" ("id");
ALTER TABLE "lists_items" ADD FOREIGN KEY ("items_id") REFERENCES "items" ("id");