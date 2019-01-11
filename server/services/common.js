import mongoose from 'mongoose';


const Genres = mongoose.model('Genres');

/**
 * 所有类分类
 */
export function getAllGenres() {
  return Genres.aggregate([
      { $project: { id: "$_id", name: "$name", _id: 0 } },
    ])
    .sort({ 'meta.createTime': -1 });
}
