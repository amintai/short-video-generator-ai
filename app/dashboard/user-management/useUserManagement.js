import { useState, useCallback, useEffect } from "react";
import { eq } from "drizzle-orm";
import { db } from "../../../configs/db";
import { Users } from "../../../configs/schema";
import { useSelector } from "react-redux";

const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const userRole = useSelector((state) => state.user.details.role);

    useEffect(() => {
        // Fetch users only if admin
        if (userRole === "admin") {
            fetchUsers()
        }
    }, [userRole]);


    const fetchUsers = useCallback(async () => {
        try {
            const result = await db.select().from(Users);
            setUsers(result);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    }, []);

    const addUser = async (userData) => {
        try {
            const inserted = await db.insert(Users).values(userData).returning();
            setUsers((prev) => [...prev, ...inserted]);
        } catch (err) {
            console.error("Failed to add user:", err);
        }
    };

    const updateUser = async (user) => {
        try {
            await db.update(Users).set(user).where(eq(Users.id, user.id));
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...user } : u)));
        } catch (err) {
            console.error("Failed to update user:", err);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await db.delete(Users).where(eq(Users.id, userId));
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    return [
        {
            users,
            userRole
        },
        {
            fetchUsers,
            addUser,
            updateUser,
            deleteUser,
        }]

};

export default useUserManagement;
