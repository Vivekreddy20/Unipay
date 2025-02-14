const mongoose = require('mongoose');

// Define schema
const FeeSchema = new mongoose.Schema({
    Batch: {
        type: Number,
        required: true
    },
    Roll: {
        type: String,
        required: true
    },
    DOB: {
      type: String,
      required: true
  },
    Gender: {
        type: String,
        required: true
    },
    Branch: {
        type: String,
        required: true
    },
    Section: {
        type: String,
        required: true
    },
    isEnabled: {
        CollegeFee: {
            I: {
                type: Boolean,
                default: false
            },
            II: {
                type: Boolean,
                default: false
            },
            III: {
                type: Boolean,
                default: false
            },
            IV: {
                type: Boolean,
                default: false
            }
        },
        TransportFee: {
            I: {
                type: Boolean,
                default: false
            },
            II: {
                type: Boolean,
                default: false
            },
            III: {
                type: Boolean,
                default: false
            },
            IV: {
                type: Boolean,
                default: false
            }
        },
        RegularFee: {
            'I-I': {
                type: Boolean,
                default: false
            },
            'I-II': {
                type: Boolean,
                default: false
            },
            'II-I': {
                type: Boolean,
                default: false
            },
            'II-II': {
                type: Boolean,
                default: false
            },
            'III-I': {
                type: Boolean,
                default: false
            },
            'III-II': {
                type: Boolean,
                default: false
            },
            'IV-I': {
                type: Boolean,
                default: false
            },
            'IV-II': {
                type: Boolean,
                default: false
            }
        },
        SupplyFee: {
            'I-I': {
                type: Boolean,
                default: false
            },
            'I-II': {
                type: Boolean,
                default: false
            },
            'II-I': {
                type: Boolean,
                default: false
            },
            'II-II': {
                type: Boolean,
                default: false
            },
            'III-I': {
                type: Boolean,
                default: false
            },
            'III-II': {
                type: Boolean,
                default: false
            },
            'IV-I': {
                type: Boolean,
                default: false
            },
            'IV-II': {
                type: Boolean,
                default: false
            }
        },
        'Re-Evaluation': {
            'I-I': {
                type: Boolean,
                default: false
            },
            'I-II': {
                type: Boolean,
                default: false
            },
            'II-I': {
                type: Boolean,
                default: false
            },
            'II-II': {
                type: Boolean,
                default: false
            },
            'III-I': {
                type: Boolean,
                default: false
            },
            'III-II': {
                type: Boolean,
                default: false
            },
            'IV-I': {
                type: Boolean,
                default: false
            },
            'IV-II': {
                type: Boolean,
                default: false
            }
        }
    },
    isPaid: {
        CollegeFee: {
            I: {
                type: Boolean,
                default: false
            },
            II: {
                type: Boolean,
                default: false
            },
            III: {
                type: Boolean,
                default: false
            },
            IV: {
                type: Boolean,
                default: false
            }
        },
        TransportFee: {
            I: {
                type: Boolean,
                default: false
            },
            II: {
                type: Boolean,
                default: false
            },
            III: {
                type: Boolean,
                default: false
            },
            IV: {
                type: Boolean,
                default: false
            }
        },
        RegularFee: {
            'I-I': {
                type: Boolean,
                default: false
            },
            'I-II': {
                type: Boolean,
                default: false
            },
            'II-I': {
                type: Boolean,
                default: false
            },
            'II-II': {
                type: Boolean,
                default: false
            },
            'III-I': {
                type: Boolean,
                default: false
            },
            'III-II': {
                type: Boolean,
                default: false
            },
            'IV-I': {
                type: Boolean,
                default: false
            },
            'IV-II': {
                type: Boolean,
                default: false
            }
        },
        SupplyFee: {
            'I-I': {
                type: Boolean,
                default: false
            },
            'I-II': {
                type: Boolean,
                default: false
            },
            'II-I': {
                type: Boolean,
                default: false
            },
            'II-II': {
                type: Boolean,
                default: false
            },
            'III-I': {
                type: Boolean,
                default: false
            },
            'III-II': {
                type: Boolean,
                default: false
            },
            'IV-I': {
                type: Boolean,
                default: false
            },
            'IV-II': {
                type: Boolean,
                default: false
            }
        },
        'Re-Evaluation': {
            'I-I': {
                type: Boolean,
                default: false
            },
            'I-II': {
                type: Boolean,
                default: false
            },
            'II-I': {
                type: Boolean,
                default: false
            },
            'II-II': {
                type: Boolean,
                default: false
            },
            'III-I': {
                type: Boolean,
                default: false
            },
            'III-II': {
                type: Boolean,
                default: false
            },
            'IV-I': {
                type: Boolean,
                default: false
            },
            'IV-II': {
                type: Boolean,
                default: false
            }
        }
    },
    FeeAmount: {
        CollegeFee: {
            I: {
                type: Number,
                default: 120000
            },
            II: {
                type: Number,
                default: 120000
            },
            III: {
                type: Number,
                default: 120000
            },
            IV: {
                type: Number,
                default: 120000
            }
        },
        TransportFee: {
            I: {
                type: Number,
                default: 37000
            },
            II: {
                type: Number,
                default: 37000
            },
            III: {
                type: Number,
                default: 37000
            },
            IV: {
                type: Number,
                default: 37000
            }
        },
        RegularFee: {
            'I-I': {
                type: Number,
                default: 2000
            },
            'I-II': {
                type: Number,
                default: 2000
            },
            'II-I': {
                type: Number,
                default: 2000
            },
            'II-II': {
                type: Number,
                default: 2000
            },
            'III-I': {
                type: Number,
                default: 2000
            },
            'III-II': {
                type: Number,
                default: 2000
            },
            'IV-I': {
                type: Number,
                default: 2000
            },
            'IV-II': {
                type: Number,
                default: 2000
            }
        },
        SupplyFee: {
            'I-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'I-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'II-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'II-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'III-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'III-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'IV-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'IV-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            }
        },
        'Re-Evaluation': {
            'I-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'I-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'II-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'II-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'III-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'III-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'IV-I': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            },
            'IV-II': {
                'No of Subjects': {
                    type: Number,
                    default: 0
                },
                Subjects: [String],
                Amount: {
                    type: Number,
                    default: 0
                }
            }
        }
    }
});

// Create model
const FeeDetail = mongoose.model('2021fees', FeeSchema);

module.exports = FeeDetail;
