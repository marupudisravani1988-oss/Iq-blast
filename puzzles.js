/* ============================================================
   puzzles.js  –  Brain Blast!
   ============================================================
   HOW TO ADD NEW PUZZLES
   ──────────────────────
   Each puzzle object has three fields:
     q : the question text  (supports emoji!)
     o : array of answer choices  (2–4 items)
     a : the correct answer  (must exactly match one item in o)

   Puzzles are grouped by:
     Category  →  "math" | "story" | "logic" | "emotion"
     Difficulty →  "easy" | "medium" | "hard"

   Example – add a new easy math question:
     { q: "🌙 6 + 6 = ?", o: ["10","11","12","13"], a: "12" },

   The game automatically picks difficulty based on the
   player's total correct answers (see game.js → getLevel).
   ============================================================ */

const PUZZLES = {

  /* ── MATH ─────────────────────────────────────────────────── */
  math: {
    easy: [
      { q: "🍕 3 + 4 = ?",    o: ["6","7","8","5"],       a: "7"  },
      { q: "🐣 5 + 2 = ?",    o: ["6","7","8","9"],       a: "7"  },
      { q: "🌈 8 − 3 = ?",    o: ["4","5","6","7"],       a: "5"  },
      { q: "🎈 2 × 3 = ?",    o: ["5","6","7","8"],       a: "6"  },
      { q: "🍓 10 − 4 = ?",   o: ["5","6","7","8"],       a: "6"  },
      { q: "🐸 4 + 4 = ?",    o: ["6","7","8","9"],       a: "8"  },
      { q: "🌟 3 × 3 = ?",    o: ["6","8","9","10"],      a: "9"  },
      { q: "🎀 12 ÷ 4 = ?",   o: ["2","3","4","5"],       a: "3"  },
      { q: "🌙 6 + 6 = ?",    o: ["10","11","12","13"],   a: "12" },
      { q: "🍦 9 − 5 = ?",    o: ["3","4","5","6"],       a: "4"  },
    ],
    medium: [
      { q: "🚀 15 + 27 = ?",  o: ["40","42","43","44"],   a: "42" },
      { q: "🎯 56 − 19 = ?",  o: ["35","36","37","38"],   a: "37" },
      { q: "🌊 7 × 8 = ?",    o: ["54","56","58","60"],   a: "56" },
      { q: "🍦 48 ÷ 6 = ?",   o: ["6","7","8","9"],       a: "8"  },
      { q: "🦋 34 + 48 = ?",  o: ["80","82","83","84"],   a: "82" },
      { q: "🎸 63 ÷ 9 = ?",   o: ["6","7","8","9"],       a: "7"  },
      { q: "🏀 9 × 9 = ?",    o: ["79","80","81","82"],   a: "81" },
      { q: "🎪 88 − 35 = ?",  o: ["51","52","53","54"],   a: "53" },
    ],
    hard: [
      { q: "🧠 125 + 76 = ?", o: ["199","200","201","202"], a: "201" },
      { q: "🔥 12 × 13 = ?",  o: ["144","154","156","164"], a: "156" },
      { q: "⚡ 144 ÷ 12 = ?", o: ["11","12","13","14"],   a: "12"  },
      { q: "🌙 250 − 88 = ?", o: ["160","162","163","164"],a: "162" },
      { q: "💎 15 × 15 = ?",  o: ["215","220","225","230"],a: "225" },
      { q: "🚂 17 × 11 = ?",  o: ["185","186","187","188"],a: "187" },
    ],
  },

  /* ── STORY ────────────────────────────────────────────────── */
  story: {
    easy: [
      { q: "🍎 Sara has 8 apples. She gives 3 away. How many left?",        o: ["4","5","6","7"],    a: "5" },
      { q: "🐕 Tom sees 4 dogs and 3 cats. Animals total?",                 o: ["5","6","7","8"],    a: "7" },
      { q: "🍬 Mia has 6 candies and eats 2. How many remain?",             o: ["3","4","5","6"],    a: "4" },
      { q: "🐠 Jake has 5 fish, buys 4 more. Fish now?",                    o: ["7","8","9","10"],   a: "9" },
      { q: "🎒 Lily packs 3 books + 5 pencils. Total?",                     o: ["7","8","9","10"],   a: "8" },
      { q: "🚂 Train has 7 cars. 2 are removed. Cars left?",                o: ["4","5","6","7"],    a: "5" },
    ],
    medium: [
      { q: "🍕 8 slices, 4 kids share equally. Each gets?",                 o: ["2","3","4","5"],    a: "2"  },
      { q: "🚌 Bus: 24 seats, 17 taken. Empty seats?",                      o: ["5","6","7","8"],    a: "7"  },
      { q: "🎈 5 balloons per table × 6 tables = ?",                        o: ["28","29","30","31"],a: "30" },
      { q: "📚 Emma reads 12 pages/day. Pages in 5 days?",                  o: ["55","60","65","70"],a: "60" },
      { q: "🍫 A bag has 36 chocolates shared among 4 friends. Each gets?", o: ["8","9","10","11"],  a: "9"  },
    ],
    hard: [
      { q: "🏪 345 items Mon + 278 Tue. Total?",                            o: ["621","623","625","627"],a: "623" },
      { q: "🚗 60 km/h × 3.5 hours. Distance?",                            o: ["200","205","210","215"],a: "210" },
      { q: "🎡 Tickets cost $12. Sam buys 7. Total cost?",                  o: ["$82","$84","$86","$88"],a: "$84" },
    ],
  },

  /* ── LOGIC ────────────────────────────────────────────────── */
  logic: {
    easy: [
      { q: "🔢 Next: 2, 4, 6, 8, __",                                       o: ["9","10","11","12"],         a: "10"  },
      { q: "🔢 Next: 1, 3, 5, 7, __",                                       o: ["8","9","10","11"],          a: "9"   },
      { q: "🔢 Next: 10, 20, 30, __",                                       o: ["35","38","40","45"],        a: "40"  },
      { q: "🎨 Red, Blue, Red, Blue, __?",                                  o: ["Red","Blue","Green","Yellow"],a: "Red"},
      { q: "🔢 Next: 5, 10, 15, 20, __",                                    o: ["22","23","25","30"],        a: "25"  },
      { q: "🐾 Cat, Dog, Cat, Dog, __?",                                    o: ["Cat","Dog","Bird","Fish"],  a: "Cat" },
      { q: "🔢 Next: 0, 2, 4, 6, __",                                       o: ["7","8","9","10"],           a: "8"   },
    ],
    medium: [
      { q: "🔢 Next: 1, 4, 9, 16, __",                                      o: ["20","24","25","30"],        a: "25"    },
      { q: "🔢 Next: 3, 6, 12, 24, __",                                     o: ["36","42","48","60"],        a: "48"    },
      { q: "🎯 Odd one out: Circle, Square, Triangle, Sphere",               o: ["Circle","Square","Triangle","Sphere"],a: "Sphere"},
      { q: "🔢 Next: 100, 50, 25, __",                                      o: ["10","12","12.5","15"],      a: "12.5"  },
      { q: "🧩 What shape has 4 equal sides AND 4 right angles?",            o: ["Rectangle","Square","Diamond","Trapezoid"],a: "Square"},
    ],
    hard: [
      { q: "🧩 All Bloops=Razzies. All Razzies=Lazzies. Are Bloops Lazzies?",o: ["Yes","No","Maybe","Sometimes"],a: "Yes"   },
      { q: "🔢 Next: 1, 1, 2, 3, 5, 8, __",                                o: ["11","12","13","14"],        a: "13"    },
      { q: "🧮 2 machines → 2 widgets in 2 min. 8 machines → 8 widgets in?",o: ["1 min","2 min","4 min","8 min"],a: "2 min"},
      { q: "🔢 Next: 2, 6, 18, 54, __",                                     o: ["108","162","216","162"],    a: "162"   },
    ],
  },

  /* ── EMOTION ──────────────────────────────────────────────── */
  emotion: {
    easy: [
      { q: "😢 Your friend is crying. What do you do?",                     o: ["Comfort them","Ignore","Laugh","Walk away"],     a: "Comfort them"   },
      { q: "🎉 Classmate wins a prize. You?",                               o: ["Congratulate","Be jealous","Ignore","Boo"],      a: "Congratulate"   },
      { q: "😠 Someone is angry. Best thing to say?",                       o: ["Stay calm","Fight back","Laugh","Leave"],        a: "Stay calm"      },
      { q: "🤝 You bump into someone by accident. You say?",                o: ["Sorry!","Nothing","Blame them","Run away"],      a: "Sorry!"         },
      { q: "🙁 Friend feels left out. You?",                                o: ["Include them","Ignore","Laugh","Walk away"],     a: "Include them"   },
      { q: "😊 Someone shares their lunch with you. You feel?",             o: ["Grateful","Angry","Bored","Jealous"],            a: "Grateful"       },
    ],
    medium: [
      { q: "🧠 Friend is nervous before a test. Best advice?",              o: ["You'll do great!","Give up","Tests are dumb","Who cares"],a: "You'll do great!"},
      { q: "💬 Someone shares a secret with you. You?",                    o: ["Keep it safe","Tell everyone","Forget it","Post online"],a: "Keep it safe"   },
      { q: "🌧️ You feel sad. A healthy way to cope?",                     o: ["Talk to someone","Bottle it up","Yell","Skip school"],a: "Talk to someone"},
      { q: "🤗 A new student looks lonely. What do you do?",                o: ["Say hi and invite them","Ignore","Point","Walk past"],a: "Say hi and invite them"},
    ],
    hard: [
      { q: "🤔 A friend lies to protect your feelings. This is called?",    o: ["White lie","Big lie","True lie","No lie"],       a: "White lie" },
      { q: "😌 Staying calm when things go wrong is?",                      o: ["Patience","Anger","Sadness","Boredom"],          a: "Patience"  },
      { q: "💡 Seeing things from another person's view is called?",        o: ["Empathy","Sympathy","Apathy","Jealousy"],        a: "Empathy"   },
    ],
  },

};

/* ── Category meta (used by game.js for colours & labels) ─── */
const CATS = {
  math:    { icon: "🔢", label: "Math",     color: "#d08000", bg: "#fffbea" },
  story:   { icon: "📖", label: "Story",    color: "#1a8a40", bg: "#eafbee" },
  logic:   { icon: "🧩", label: "Logic",    color: "#7030cc", bg: "#f6eaff" },
  emotion: { icon: "❤️", label: "Feelings", color: "#cc4010", bg: "#fff4ea" },
};
