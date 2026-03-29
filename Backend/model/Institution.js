const mongoose = require("mongoose");

const InstitutionSchema = new mongoose.Schema(
  {
    institutionName: { type: String, required: true },
    contactDetails: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
      address: {
        text: { type: String },
      },
    },
    timings: {
      morningShift: { type: String },
      eveningShift: { type: String },
      general: { type: String },
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institution", InstitutionSchema);
