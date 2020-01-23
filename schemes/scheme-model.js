const knex = require("../data/dbConfig");

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  update,
  remove
};

function find() {
  return knex.select("*").from("schemes");
}

function findById(id) {
  return knex
    .select("*")
    .from("schemes")
    .where({ id: id });
}

/*
SELECT scheme_name, step_number, instructions
FROM schemes
JOIN steps
ON schemes.id = steps.scheme_id
ORDER BY scheme_name, step_number
*/
function findSteps(id) {
  return knex("schemes")
    .join("steps", "schemes.id", "=", "steps.scheme_id")
    .select("schemes.scheme_name", "steps.step_number", "steps.instructions")
    .where({ "schemes.id": id })
    .orderBy(["scheme_name", { column: "step_number", order: "asc" }]);
}

function add(scheme) {
  return knex("schemes")
    .insert(scheme, "id")
    .then(id => {
      return knex("schemes")
        .select("*")
        .where({ id: id[0] });
    });
}

function addStep(step, id) {
  const newStep = {
    ...step,
    scheme_id: id
  };

  return knex("steps")
    .insert(newStep, "id")
    .then(id => {
      return knex("steps")
        .select("*")
        .where({ id: id[0] });
    });
}

function update(changes, id) {
  return knex("schemes")
    .where({ id })
    .update(changes, "id")
    .then(() => {
      return knex("schemes")
        .select("*")
        .where({ id: id });
    });
}

function remove(id) {
  return knex("schemes")
    .where({ id })
    .del();
}