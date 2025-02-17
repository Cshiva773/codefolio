const badgeSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    imageUrl: String,
    criteria: String,
    earnedDate: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['Achievement', 'Skill', 'Participation']
    }
  }, { timestamps: true });
  
export const Badge = mongoose.model('Badge', badgeSchema);