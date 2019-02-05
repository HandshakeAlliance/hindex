exports.up = async function(knex) {
  await knex.schema.createTable("covenant", function(t) {
    t.increments("id")
      .unsigned()
      .primary();
    //Potentially optimize this by only saving the number, and then have a conversion table.
    t.string("action");
    t.string("name_hash");
    //This needs to be reviewed.
    t.text("data");
    t.string("nonce");
    t.bigInteger("output_id");
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("covenant");
};