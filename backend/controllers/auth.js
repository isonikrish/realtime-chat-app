import { generateToken } from '../lib/utils.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs'
export async function handleSignup(req, res) {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be atleast 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })
        if (newUser) {
            //generate Token here
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ msg: "Invalid User Data" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}
export async function handleLogin(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ msg: "All fields are required" })
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if (!isPasswordCorrect) return res.status(400).json({ msg: "Invalid password" });

        generateToken(user._id,res);
        res.status(200).json({msg: "Logged In"})

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}
export async function handleLogout(req, res) {

}