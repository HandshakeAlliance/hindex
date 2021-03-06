const { Model } = require("objection");

const Output = require("./output.js");
const Input = require("./input.js");

class TX extends Model {
  static get tableName() {
    return "tx";
  }

  static get relationMappings() {
    const Block = require("./block.js");

    return {
      block: {
        relation: Model.BelongsToOneRelation,
        modelClass: Block,
        join: {
          from: "tx.block_id",
          to: "block.id"
        }
      },

      outputs: {
        relation: Model.HasManyRelation,
        modelClass: Output,
        join: {
          from: "tx.id",
          to: "output.tx_id"
        }
      },

      inputs: {
        relation: Model.HasManyRelation,
        modelClass: Input,
        join: {
          from: "tx.id",
          to: "input.tx_id"
        }
      }
    };
  }

  static async getIDByHash(hash) {
    let results = await TX.query()
      .where("tx_id", hash)
      .select("id")
      .limit(1);

    if (results.length > 0) {
      let tx = results[0];
      return tx.id;
    } else {
      return null;
    }
  }

  static async format(tx, tx2, entry, block, view, index) {
    let newtx = {
      hash: tx.txid(),
      tx_id: tx.txid(),
      witness_hash: tx.wtxid(),
      size: tx.getSize(),
      value: tx.getOutputValue(),
      min_fee: tx.getMinFee(),
      locktime: tx.locktime,
      fee: tx.getFee(view),
      rate: tx.getRate(view),
      height: entry.height,
      time: block.time,
      index: index,
      version: tx.version
    };

    newtx.outputs = await Output.parse(tx2.outputs);
    newtx.inputs = await Input.parse(tx2.inputs, TX.getIDByHash, entry.height);

    return newtx;
  }
}

module.exports = TX;
