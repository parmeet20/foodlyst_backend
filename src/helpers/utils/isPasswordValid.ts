import bcrypt from "bcryptjs";
export const isPasswordValid = (passwordRequest: string, dbPassword: string): boolean => {
    return bcrypt.compareSync(passwordRequest, dbPassword);
};
