"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Full description is required"]
    },
    straight_up: {
        type: String,
        default: ""
    },
    lowdown: {
        type: [String],
        default: []
    },
    regularPrice: {
        type: Number,
        required: [true, "Regular price is required"]
    },
    salePrice: {
        type: Number,
        required: [true, "Sale price is required"],
        validate: {
            validator: function (value) {
                return value <= this.regularPrice;
            },
            message: "Sale price cannot be higher than regular price",
        },
    },
    thumbnail: {
        type: String,
        required: [true, "Main thumbnail image is required"]
    },
    images: {
        type: [String],
        required: [true, "At least one gallery image is required"]
    },
    categoryID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category is required"]
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    isNew: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)('Product', productSchema);
//# sourceMappingURL=product.model.js.map