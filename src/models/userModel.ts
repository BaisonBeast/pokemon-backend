import mongoose, { Document, Schema } from 'mongoose';
import { IPokemon } from './pokemonModel';

interface IUser extends Document {
    userId: string;
    username: string;
    password: string;
    role: 'trainer' | 'judge';
    likes: string[];
    pokemons: IPokemon[];
}

const userSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['trainer', 'judge'],
        default: 'trainer',
    },
    likes: {
        type: [String],
        default: [],
    },
    pokemons: {
        type: [Schema.Types.Mixed],
        default: [],
    },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
export { IUser };
