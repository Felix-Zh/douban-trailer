import mongoose from 'mongoose';


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const movieSchema = new Schema({
  doubanId: {
    type: String,
    unique: true
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  rate: Number,
  title: String,
  description: String,
  videoURL: String,
  videoCoverURL: String,
  posterURL: String,
  videoURLKey: String,
  videoCoverURLKey: String,
  posterURLKey: String,
  rawTitle: String,
  movieTypes: [String],
  year: Number,
  hasDetail: {
    type: Boolean,
    required: true,
    default: false
  },
  meta: {
    createTime: Date,
    updateTime: Date
  }
});

movieSchema.pre('save', async function () {
  if (this.isNew) {
    this.meta.createTime = this.meta.updateTime = Date.now();
  } else {
    this.meta.updateTime = Date.now();
  }
});

export default mongoose.model('Movie', movieSchema);
