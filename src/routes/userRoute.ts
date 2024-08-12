import express from 'express';
import { Request, Response } from 'express';
import User from '../models/userModel';
import { isJudge } from '../middlewares/roleMiddleware';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.post('/like', isJudge, async(req: Request , res: Response) => {
    try {
        const {judgeId, trainerId} = req.body;
        const user = await User.findOne({userId: trainerId});

        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (!user.likes.includes(judgeId)) {
            return res.status(200).send('You have already liked the user');
        }
        user.likes.push(judgeId);
        await user.save();
        res.status(200).send('Trainer liked successfully.');
    } catch(err) {
        res.status(400).json(`Something went wrong ${err}`);
    }
});

router.get('/home/:userId', async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.status(200).json({pokemons: user.pokemons});
    } catch(err) {
        res.status(400).json(`Something went wrong ${err}`);
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.query as string | undefined;
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const filePath = path.resolve(__dirname, '..', 'data', 'Pokemons.json');

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const pokemons = JSON.parse(data);

        const filteredPokemons = pokemons.filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );

        res.status(200).json(filteredPokemons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/leaderboard', async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: 'trainer' });

        if (users.length === 0) {
            return res.status(200).send('No users found');
        }

        const trainers = users.map(user => {
            const pokemonName = user.pokemons.length > 0 ? user.pokemons[0].name : 'No Pokémon';
            return {
                username: user.username,
                userId: user.userId,
                pokemon: pokemonName,
                likes: user.likes.length
            };
        });

        trainers.sort((a, b) => b.likes - a.likes);
        res.status(200).json(trainers);
    } catch (err) {
        res.status(400).json({ message: 'Something went wrong', err });
    }
});

router.get('/pokemons', (req, res) => {
    const filePath = path.join(__dirname,'..' ,'data', 'Pokemons.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        try {
            const pokemons = JSON.parse(data);
            res.status(200).json(pokemons);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

router.post('/addPokemon', async (req, res) => {
    const { userId, pokemonId } = req.body;

    try {
        const filePath = path.resolve(__dirname, '..', 'data', 'Pokemons.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const pokemons = JSON.parse(data);

        const pokemonData = pokemons.find((p: any) => p.id === parseInt(pokemonId));
        if (!pokemonData) {
            return res.status(404).json({ message: 'Pokémon not found in the JSON file' });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.pokemons.some(pokemon => pokemon.id === pokemonData.id)) {
            user.pokemons.push(pokemonData);
            await user.save();
        }

        res.status(200).json({ message: 'Pokémon added to user\'s collection' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;