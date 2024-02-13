import bcrypt from 'bcrypt';
const saltRounds = 8;


export const hashingText = async (value: string): Promise<string> => {
    return (await bcrypt.hash(value, saltRounds));
}