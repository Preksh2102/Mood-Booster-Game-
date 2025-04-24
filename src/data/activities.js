import React from 'react';
import { Activity, Heart, Moon, Music, Coffee, Edit, Sun, Book, Droplet, CloudRain, Accessibility, Brain, Bike, Users, PenTool, Smile, Umbrella, Sparkles } from 'lucide-react';

// Activities database organized by mood type
const activities = {
  happy: [
    { 
      id: 'happy1',
      name: 'Dance to your favorite song', 
      icon: <Music size={24} />, 
      description: 'Move to the beat and express your joy through movement! Dancing releases endorphins and amplifies your positive mood.',
      duration: '5 min'
    },
    { 
      id: 'happy2',
      name: 'Share your positivity', 
      icon: <Heart size={24} />, 
      description: 'Call or message someone you care about to spread the good mood. Sharing positive emotions strengthens social bonds.',
      duration: '10 min'
    },
    { 
      id: 'happy3',
      name: 'Try something new', 
      icon: <Activity size={24} />, 
      description: 'Use this positive energy to explore a new activity or hobby. Your brain is more receptive to learning when you\'re in a good mood.',
      duration: '15-30 min'
    },
    { 
      id: 'happy4',
      name: 'Creative expression', 
      icon: <Edit size={24} />, 
      description: 'Channel your positive energy into art, writing, or another creative outlet. Creativity flows more easily when you\'re feeling good.',
      duration: '20 min'
    },
    { 
      id: 'happy5',
      name: 'Random act of kindness', 
      icon: <Sparkles size={24} />, 
      description: 'Do something nice for someone else. Acts of kindness while you\'re happy can create a positive ripple effect.',
      duration: '5-15 min'
    },
    { 
      id: 'happy6',
      name: 'Set a new goal', 
      icon: <PenTool size={24} />, 
      description: 'Your positive mood is a great time to think about what you want to achieve next. Write down a new goal and the first steps to get there.',
      duration: '10 min'
    },
    { 
      id: 'happy7',
      name: 'Outdoor adventure', 
      icon: <Sun size={24} />, 
      description: 'Go outside and enjoy nature. Whether it\'s a walk in the park or sitting in your garden, fresh air enhances your good mood.',
      duration: '15-30 min'
    },
    { 
      id: 'happy8',
      name: 'Social connection', 
      icon: <Users size={24} />, 
      description: 'Reach out to friends or family to share your good mood. Positive emotions are contagious!',
      duration: '15 min'
    }
  ],
  
  sad: [
    { 
      id: 'sad1',
      name: 'Gentle yoga stretch', 
      icon: <Activity size={24} />, 
      description: 'A few minutes of gentle movement can help shift your mood. Try some simple stretches to release tension in your body.',
      duration: '5 min'
    },
    { 
      id: 'sad2',
      name: 'Mindful breathing', 
      icon: <Moon size={24} />, 
      description: 'Take 5 deep breaths, focusing on how your body feels. Breathe in for 4 counts, hold for 2, and exhale for 6 counts.',
      duration: '3 min'
    },
    { 
      id: 'sad3',
      name: 'Comfort break', 
      icon: <Coffee size={24} />, 
      description: 'Make yourself a warm drink and take a moment to relax. Sometimes a small comfort can make a big difference.',
      duration: '10 min'
    },
    { 
      id: 'sad4',
      name: 'Nature connection', 
      icon: <Sun size={24} />, 
      description: 'Step outside or look out a window at the natural world for a few minutes. Nature has a calming effect on our emotions.',
      duration: '5 min'
    },
    { 
      id: 'sad5',
      name: 'Hydration refresh', 
      icon: <Droplet size={24} />, 
      description: 'Drink a glass of water. Staying hydrated can have a surprising impact on mood and energy levels.',
      duration: '2 min'
    },
    { 
      id: 'sad6',
      name: 'Soothing sounds', 
      icon: <Music size={24} />, 
      description: 'Listen to calming music or nature sounds. Audio can help shift your emotional state gently.',
      duration: '7 min'
    },
    { 
      id: 'sad7',
      name: 'Cozy comfort', 
      icon: <Umbrella size={24} />, 
      description: 'Wrap yourself in a soft blanket or put on comfortable clothes. Physical comfort can help ease emotional discomfort.',
      duration: '5 min'
    },
    { 
      id: 'sad8',
      name: 'Emotion journaling', 
      icon: <Edit size={24} />, 
      description: 'Write down how you\'re feeling without judgment. Acknowledging emotions can help process them more effectively.',
      duration: '10 min'
    }
  ],
  
  neutral: [
    { 
      id: 'neutral1',
      name: 'Quick energy boost', 
      icon: <Activity size={24} />, 
      description: 'Try 10 jumping jacks to get your blood flowing. A burst of movement can help shift your energy level.',
      duration: '1 min'
    },
    { 
      id: 'neutral2',
      name: 'Gratitude moment', 
      icon: <Heart size={24} />, 
      description: 'Think of three things you\'re grateful for right now. Gratitude practice has been shown to increase positive emotions.',
      duration: '2 min'
    },
    { 
      id: 'neutral3',
      name: 'Creative expression', 
      icon: <Music size={24} />, 
      description: 'Doodle, hum, or write for a few minutes to spark creativity. Even small creative acts can shift your mood.',
      duration: '5 min'
    },
    { 
      id: 'neutral4',
      name: 'Quick read', 
      icon: <Book size={24} />, 
      description: 'Read a short article or a few pages of a book to stimulate your mind and potentially shift your perspective.',
      duration: '10 min'
    },
    { 
      id: 'neutral5',
      name: 'Mindful moment', 
      icon: <Brain size={24} />, 
      description: 'Take a minute to focus on your surroundings. Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
      duration: '3 min'
    },
    { 
      id: 'neutral6',
      name: 'Quick walk', 
      icon: <Bike size={24} />, 
      description: 'Take a short walk around your space or outside. Moving your body can help shift your mental state.',
      duration: '5 min'
    },
    { 
      id: 'neutral7',
      name: 'Facial relaxation', 
      icon: <Smile size={24} />, 
      description: 'Gently massage your face or try smiling for 30 seconds. Facial expressions can influence how we feel.',
      duration: '2 min'
    },
    { 
      id: 'neutral8',
      name: 'Deep breathing', 
      icon: <CloudRain size={24} />, 
      description: 'Take 10 deep breaths, focusing on the sensation of air moving in and out of your body.',
      duration: '2 min'
    }
  ]
};

export default activities;