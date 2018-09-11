USE 'd30cqa3430ap1p';

-- DROP TABLE if EXISTS "users";
CREATE TABLE "users" (
"id"  SERIAL ,
"name" VARCHAR(255) ,
"password" VARCHAR(255) /* hash + salt */,
PRIMARY KEY ("id")
);
COMMENT ON TABLE "users" IS 'may need a few attributes for oAuth';
COMMENT ON COLUMN "users"."password" IS 'hash + salt';

-- DROP TABLE if EXISTS "items";
CREATE TABLE "items" (
"id" INTEGER /* add id from api call */,
"name" VARCHAR(255) ,
"price" DECIMAL ,
"description" VARCHAR(255) ,
"image" VARCHAR(255) ,
"store_id" INTEGER ,
PRIMARY KEY ("id")
);
COMMENT ON COLUMN "items"."id" IS 'add id from api call';

-- DROP TABLE if EXISTS "lists";
CREATE TABLE "lists" (
"id"  SERIAL ,
"budget" INTEGER ,
"user_id" INTEGER ,
"name" VARCHAR(255) ,
PRIMARY KEY ("id")
);

-- DROP TABLE if EXISTS "lists_items";
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