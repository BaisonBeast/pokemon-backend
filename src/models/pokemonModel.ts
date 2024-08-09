import mongoose, { Document, Schema } from 'mongoose';

interface IPokemon extends Document {
    id: number;
    name: string;
    type: string;
    height: number;
    weight: number;
}

const pokemonSchema: Schema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
});

const Pokemon = mongoose.model<IPokemon>('Pokemon', pokemonSchema);

export default Pokemon;
export { IPokemon };
