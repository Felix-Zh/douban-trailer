import mongoose from 'mongoose';


const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const genresSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie',
    default: []
  }],
  meta: {
    createTime: Date,
    updateTime: Date
  }
});

genresSchema.pre('save', async function () {
  if (this.isNew) {
    this.meta.createTime = this.meta.updateTime = Date.now();
  } else {
    this.meta.updateTime = Date.now();
  }
});

export default mongoose.model('Genres', genresSchema);
