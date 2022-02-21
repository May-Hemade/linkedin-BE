import mongoose from "mongoose"
import mongooseToCsv from "mongoose-to-csv"

const { Schema, model } = mongoose

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    description: { type: String, required: true },
    area: { type: String, required: true },

    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

ExperienceSchema.plugin(mongooseToCsv, {
    headers: 'Role Company StartDate EndDate Area Username',
    constraints: {
      'Role': 'role',
      'Company': 'company',
      'StartDate': 'startDate',
      'EndDate': 'endDate',
      'Area':'area',
      'Username':"username"
    },
})

// ProductSchema.static("findPoductWithReviews", async function (mongoQuery) {
//     const total = await this.countDocuments(mongoQuery.criteria)
//     const products = await this.find(mongoQuery.criteria)
//       .limit(mongoQuery.options.limit)
//       .skip(mongoQuery.options.skip)
//       .sort(mongoQuery.options.sort) 
//       .populate({
//         path: "reviews",
//         select: "comment rate",
//       })
//     return { total, products }
//   })
export default model("Experience ", ExperienceSchema)
