// /models/cmsClient.js (using ES6)
import mongoose from "mongoose"

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    display: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export default mongoose.models.CMSClient || mongoose.model('CMSClient', clientSchema);
