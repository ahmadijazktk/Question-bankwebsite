import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: false,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function (options) {
        return options.length >= 1 && options.some(opt => opt.isCorrect === true);
      },
      message: 'Question must have at least 1 option and one correct answer'
    }
  },
  summary: {
    type: String,
    trim: true
  },
  diagram: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  image: {
    type: String,
    trim: true
  },
  image2: {
    type: String,
    trim: true
  },
  isFreeTrialQuestion: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ category: 1, difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;


