// Post model for RiverForo.com

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [10000, 'Content cannot be more than 10000 characters']
  },
  user: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  },
  thread: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Thread',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      username: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  mentions: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      username: String
    }
  ],
  attachments: [
    {
      filename: String,
      originalname: String,
      mimetype: String,
      size: Number,
      url: String
    }
  ],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [
    {
      content: String,
      editedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field
PostSchema.pre('save', function(next) {
  // If content is modified and it's not a new post, add to edit history
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    
    // Get the previous version from the database
    this.constructor.findById(this._id)
      .then(oldPost => {
        if (oldPost) {
          this.editHistory.push({
            content: oldPost.content,
            editedAt: new Date()
          });
        }
      })
      .catch(err => console.error('Error saving edit history:', err));
  }
  
  this.updatedAt = Date.now();
  next();
});

// Extract mentions from content
PostSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Extract mentions using regex (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(this.content)) !== null) {
      const username = match[1];
      
      // Check if username is already in mentions
      const alreadyMentioned = mentions.some(mention => mention.username === username);
      
      if (!alreadyMentioned) {
        mentions.push({ username });
      }
    }
    
    // Update mentions array with usernames only, user IDs will be populated later
    this.mentions = mentions;
  }
  
  next();
});

module.exports = mongoose.model('Post', PostSchema);
