const Institution = require('../model/Institution');
const vectorSyncService = require('../ai/vectorSyncService');

//GET institutions details
exports.getInstitution  = async (req,res) =>{
    try{
        const institution = await Institution.findOne();
        res.status(200).json(institution);
    }catch(error){
        res.status(500).json({message:"Error fetching institution details", error: error.message});

    }
}

// CREATE or UPDATE institution details
exports.upsertInstitution = async (req, res) => {
  try {
    const data = {
      ...req.body,
      lastUpdatedBy: req.adminId,
    };

    const institution = await Institution.findOneAndUpdate(
      {},
      data,
      { new: true, upsert: true }
    );

    // 🚀 Sync with Vector DB
    await vectorSyncService.syncInstitution(institution);

    res.json({ message: "Institution details saved", institution });
  } catch (err) {
    res.status(500).json({ message: "Failed to save institution details" });
  }
};